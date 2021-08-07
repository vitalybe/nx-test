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

  generateFiles(host, joinPathFragments(__dirname, "./files/root"), projectConfig.root, {
    ...options,
    tmpl: "",
    offsetFromRoot: offsetFromRoot(projectConfig.root),
    name: options.name,
  });

  generateFiles(host, joinPathFragments(__dirname, "./files/src"), joinPathFragments(projectConfig.root, "src"), {
    ...options,
    tmpl: "",
  });

  GeneratorUtils.getAndUpdateProject(options.name, host, (projectConfig) => {
    const tsConfigPath = joinPathFragments(projectConfig.root, "tsconfig.lib.json");
    projectConfig.targets["tsc"] = {
      executor: "@nrwl/workspace:run-commands",
      options: {
        command: `yarn run tsc -b ${tsConfigPath} --incremental`,
      },
    };

    // Add cosmos target
    projectConfig.targets["cosmos"] = {
      executor: "./tools/executors/cosmos:cosmos",
      options: {
        buildTarget: schema.name + ":z-internal-build",
      },
    };

    projectConfig.targets["z-internal-build"] = {
      executor: "@nrwl/web:build",
      outputs: ["{options.outputPath}"],
      options: {
        outputPath: "dist/libs/common",
        index: `${projectConfig.root}/src/index.html`,
        main: `${projectConfig.root}/src/index.tsx`,
        polyfills: `${projectConfig.root}/src/polyfills.ts`,
        tsConfig: `${projectConfig.root}/tsconfig.lib.json`,
        assets: [],
        styles: [],
        scripts: [],
        webpackConfig: "tools/config/webpack/webpackCustomized.config.js",
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
