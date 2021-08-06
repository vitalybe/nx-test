import {
  Tree,
  formatFiles,
  installPackagesTask,
  joinPathFragments,
  names,
  getWorkspaceLayout,
  normalizePath,
  generateFiles,
  offsetFromRoot,
  getProjects,
  updateJson,
} from "@nrwl/devkit";
import { Linter } from "@nrwl/linter";
import { libraryGenerator } from "@nrwl/react";
import { Schema } from "@nrwl/react/src/generators/library/schema";
import { GeneratorUtils } from "../_utils/generatorUtils";

interface MySchema {
  name: string;
}

export default async function (host: Tree, options: MySchema) {
  const schema: Schema = {
    name: options.name,
    style: "styled-components",
    skipFormat: false,
    strict: true,
    unitTestRunner: "jest",
    linter: Linter.EsLint,
    routing: false,
    pascalCaseFiles: true,
    skipTsConfig: false,
  };

  await libraryGenerator(host, schema);

  const currentWorkspaceJson = getProjects(host);
  const projectConfig = currentWorkspaceJson.get(options.name);

  generateFiles(host, joinPathFragments(__dirname, "./files"), projectConfig.root, {
    ...options,
    tmpl: "",
    offsetFromRoot: offsetFromRoot(projectConfig.root),
    name: options.name,
  });

  GeneratorUtils.getAndUpdateProject(options.name, host, (projectConfig) => {
    const tsConfigPath = joinPathFragments(projectConfig.root, "tsconfig.lib.json");
    projectConfig.targets["tsc"] = {
      executor: "@nrwl/workspace:run-commands",
      options: {
        command: `yarn run tsc -b ${tsConfigPath} --incremental`,
      },
    };
  });

  updateJson(host, joinPathFragments(projectConfig.root, "tsconfig.json"), (json) => {
    // for older typescript version
    json["compilerOptions"]["jsx"] = "react";
    return json;
  });

  const contents = host.read("jest.preset.js").toString("utf8");
  host.write(
    "jest.preset.js",
    contents.replace(
      /(^.*DO NOT EDIT BELOW THIS LINE - GENERATED - moduleNameMapper.*$)/gm,
      `$1\n  "^@qwilt/${options.name}(.*)$": "${projectConfig.root}$$1",`
    )
  );

  await formatFiles(host);
  return () => {
    installPackagesTask(host);
  };
}
