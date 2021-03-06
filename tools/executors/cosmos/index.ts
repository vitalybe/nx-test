import { ExecutorContext, offsetFromRoot } from "@nrwl/devkit";
import { exec } from "child_process";
import { promisify } from "util";
import * as shelljs from "shelljs";
import path = require("path");

export interface CosmosExecutorOptions {
  textToEcho: string;
}

// Add as target to workspace.json:
// "cosmos": {
//  "executor": "./tools/executors/cosmos:cosmos",
//  "options": {
//    ...
//  }
// }

export default async function cosmosExecutor(options: CosmosExecutorOptions, context: ExecutorContext) {
  if (!context.projectName) {
    throw new Error(`No project name in context`);
  }

  const sourceRoot = context.workspace.projects[context.projectName].sourceRoot;
  if (!sourceRoot) {
    throw new Error(`No source root was found`);
  }

  const configDir = path.join(path.relative(context.root, __dirname), "config/temp");
  const cosmosConfig = {
    globalImports: ["polyfills.ts"],
    watchDirs: ["./"],
    rootDir: path.join(offsetFromRoot(configDir), sourceRoot),
    webpack: {
      overridePath: path.join(offsetFromRoot(sourceRoot), "tools/executors/cosmos/config/cosmos.webpack.config.js"),
    },
  };

  const tempConfigDirectory = path.join(__dirname, "/config/temp/");
  const cosmosTempConfig = path.join(tempConfigDirectory, "cosmos.temp-config.json");
  shelljs.mkdir(tempConfigDirectory);
  shelljs.ShellString(JSON.stringify(cosmosConfig, null, 2)).to(cosmosTempConfig);
  shelljs.ShellString(JSON.stringify(context, null, 2)).to(__dirname + "/config/temp/executor-context.temp.json");
  shelljs.ShellString(JSON.stringify(options, null, 2)).to(__dirname + "/config/temp/executor-options.temp.json");

  shelljs.exec(`yarn cosmos --config ${cosmosTempConfig}`);

  // return: success/failure
  return { success: true };
}
