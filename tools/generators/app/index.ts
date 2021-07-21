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

  // app tsconfig shouldn't compile cypress folders
  updateJson(host, joinPathFragments(projectConfig.root, "tsconfig.json"), (json) => {
    json["compilerOptions"]["jsx"] = "react";
    return json;
  });

  GeneratorUtils.getAndUpdateProject(options.name, host, (projectConfig) => {
    const tsConfigPath = joinPathFragments(projectConfig.root, "tsconfig.app.json");
    projectConfig.targets["tsc"] = {
      executor: "@nrwl/workspace:run-commands",
      options: {
        command: `yarn run tsc -- -b ${tsConfigPath} --incremental`,
      },
    };
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
