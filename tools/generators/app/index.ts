import {
  formatFiles,
  generateFiles,
  getProjects,
  getWorkspaceLayout,
  installPackagesTask,
  joinPathFragments,
  names,
  normalizePath,
  offsetFromRoot,
  ProjectConfiguration,
  Tree,
  updateJson,
  updateProjectConfiguration,
} from "@nrwl/devkit";
import { applicationGenerator } from "@nrwl/react";
import { Linter } from "@nrwl/linter";
import { addCypress } from "@nrwl/react/src/generators/application/lib/add-cypress";
import { Schema } from "@nrwl/react/src/generators/application/schema";
import { normalizeOptions } from "@nrwl/react/src/generators/application/lib/normalize-options";
import { cypressProjectGenerator } from "@nrwl/cypress";
import { GeneratorUtils } from "../_utils/generatorUtils";
import * as fs from "fs";
import path = require("path");

interface MySchema {
  name: string;
}

async function generateApp(host: Tree, options: MySchema) {
  const schema: Schema = {
    name: options.name,
    style: "styled-components",
    skipFormat: false,
    strict: true,
    unitTestRunner: "jest",
    babelJest: false,
    e2eTestRunner: "none",
    linter: Linter.EsLint,
    routing: false,
  };
  await applicationGenerator(host, schema);

  const currentWorkspaceJson = getProjects(host);
  const projectConfig = currentWorkspaceJson.get(options.name);

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

  GeneratorUtils.getAndUpdateProject(options.name, host, (projectConfig) => {
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

    // Serve target - Add validation depedency
    serveTarget["dependsOn"] = [
      {
        target: "z-internal-validate",
        projects: "self",
      },
    ];
  });
}

function addSrcTemplateFiles(host: Tree, options: MySchema, appProjectRoot: string) {
  host.delete(joinPathFragments(appProjectRoot, "src", "app"));

  generateFiles(host, joinPathFragments(__dirname, "./files/src"), joinPathFragments(appProjectRoot, "src"), {
    tmpl: "",
  });

  return appProjectRoot;
}

function addE2e(host: Tree, options: MySchema, appProjectRoot: string) {
  const e2eProjectRoot = joinPathFragments(appProjectRoot, "e2e");
  generateFiles(host, joinPathFragments(__dirname, "./files/e2e"), e2eProjectRoot, {
    ...options,
    tmpl: "",
    linter: "eslint",
    project: options.name,
    projectRoot: e2eProjectRoot,
    offsetFromRoot: offsetFromRoot(e2eProjectRoot),
  });

  // app tsconfig shouldn't compile cypress folders
  updateJson(host, joinPathFragments(appProjectRoot, "tsconfig.app.json"), (json) => {
    json["exclude"].push("e2e/**/*");
    return json;
  });

  let jestConfigPath = joinPathFragments(appProjectRoot, "jest.config.js");
  const contents = host.read(jestConfigPath).toString("utf8");
  host.write(jestConfigPath, contents.replace(/(displayName.+$)/gm, `$1\n  roots: ["src"],`));

  // Add e2e executor
  GeneratorUtils.getAndUpdateProject(options.name, host, (projectConfig) => {
    projectConfig.targets["e2e"] = {
      executor: "@nrwl/cypress:cypress",
      options: {
        cypressConfig: joinPathFragments(e2eProjectRoot, "cypress.json"),
        tsConfig: joinPathFragments(e2eProjectRoot, "tsconfig.e2e.json"),
        devServerTarget: `${options.name}:serve`,
      },
      configurations: {
        production: {
          devServerTarget: `${options.name}:serve:production`,
        },
      },
    };
  });
}

export default async function (host: Tree, options: MySchema) {
  const appDirectory = names(options.name).fileName;
  const { appsDir } = getWorkspaceLayout(host);
  const appProjectRoot = normalizePath(`${appsDir}/${appDirectory}`);

  // Nx app generator (without cypress)
  await generateApp(host, options);

  // Add src files
  addSrcTemplateFiles(host, options, appProjectRoot);
  addE2e(host, options, appProjectRoot);

  await formatFiles(host);
  return () => {
    installPackagesTask(host);
  };
}
