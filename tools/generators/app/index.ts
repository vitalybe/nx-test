import {
  formatFiles,
  generateFiles,
  getProjects,
  getWorkspaceLayout,
  installPackagesTask,
  joinPathFragments,
  names,
  normalizePath,
  Tree,
  updateJson,
} from "@nrwl/devkit";
import { applicationGenerator } from "@nrwl/react";
import { Linter } from "@nrwl/linter";
import { Schema as NwAppSchema } from "@nrwl/react/src/generators/application/schema";
import { GeneratorUtils } from "../_utils/generatorUtils";
import generateAddE2E from "../addE2e";

interface Schema {
  name: string;
  addE2e: boolean;
}

async function generateApp(host: Tree, schema: Schema) {
  const nwAppSchema: NwAppSchema = {
    name: schema.name,
    style: "styled-components",
    skipFormat: false,
    strict: true,
    unitTestRunner: "jest",
    babelJest: false,
    e2eTestRunner: "none",
    linter: Linter.EsLint,
    routing: false,
  };
  await applicationGenerator(host, nwAppSchema);

  const currentWorkspaceJson = getProjects(host);
  const projectConfig = currentWorkspaceJson.get(schema.name);

  updateJson(host, joinPathFragments(projectConfig.root, "tsconfig.app.json"), (json) => {
    // https://stackoverflow.com/questions/48935663/webpack-property-context-does-not-exist-on-type-noderequire/48935668
    json["compilerOptions"]["types"].push("webpack-env");
    // exclude e2e folder
    json["include"] = ["src/**/*.js", "src/**/*.jsx", "src/**/*.ts", "src/**/*.tsx"];
    return json;
  });
  updateJson(host, joinPathFragments(projectConfig.root, "tsconfig.json"), (json) => {
    // for older typescript version
    json["compilerOptions"]["jsx"] = "react";
    // implicit returns
    delete json["compilerOptions"]["noImplicitReturns"];
    return json;
  });

  GeneratorUtils.getAndUpdateProject(schema.name, host, (projectConfig) => {
    const tsConfigPath = joinPathFragments(projectConfig.root, "tsconfig.app.json");
    // tsc target - check the project via tsc
    projectConfig.targets["tsc"] = {
      executor: "@nrwl/workspace:run-commands",
      options: {
        command: `yarn run tsc -b ${tsConfigPath} --incremental`,
      },
    };

    // we're using index.tsx, not main.tsx
    projectConfig.targets["build"]["options"]["main"] = joinPathFragments(projectConfig.root, "src", "index.tsx");
    host.delete(joinPathFragments(projectConfig.root, "src", "main.tsx"));

    // override webpack config
    projectConfig.targets["build"]["options"]["webpackConfig"] = `tools/config/webpack/webpackCustomized.config.js`;

    // Add validation target
    projectConfig.targets["z-internal-validate"] = {
      executor: "@nrwl/workspace:run-commands",
      options: {
        commands: [
          {
            command: "tools/scripts/validate/validate.sh",
          },
        ],
      },
    };

    // Serve target - Support HTTPS
    const serveTarget = projectConfig.targets["serve"];
    serveTarget["options"] = {
      ...serveTarget["options"],
      host: "dev-localhost.cqloud.com",
      port: 8001,
      ssl: true,
      sslCert: "tools/scripts/validate/validations/certificates/dev-localhost.cqloud.com.pem",
      sslKey: "tools/scripts/validate/validations/certificates/dev-localhost.cqloud.com-key.pem",
    };

    // Serve target - E2E mode
    serveTarget["configurations"]["e2e"] = {
      port: 8005,
      ssl: false,
    };

    // Serve target - Add validation depedency
    serveTarget["dependsOn"] = [
      {
        target: "z-internal-validate",
        projects: "self",
      },
    ];
  });
}

function addSrcTemplateFiles(host: Tree, options: Schema, appProjectRoot: string) {
  host.delete(joinPathFragments(appProjectRoot, "src", "app"));

  generateFiles(host, joinPathFragments(__dirname, "./files/src"), joinPathFragments(appProjectRoot, "src"), {
    tmpl: "",
  });

  return appProjectRoot;
}

export default async function (host: Tree, schema: Schema) {
  const appDirectory = names(schema.name).fileName;
  const { appsDir } = getWorkspaceLayout(host);
  const appProjectRoot = normalizePath(`${appsDir}/${appDirectory}`);

  // Nx app generator (without cypress)
  await generateApp(host, schema);

  // Add src files
  addSrcTemplateFiles(host, schema, appProjectRoot);
  if (schema.addE2e) {
    await generateAddE2E(host, { appName: schema.name });
  }

  await formatFiles(host);
  return () => {
    installPackagesTask(host);
  };
}
