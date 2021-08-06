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
  shelljs.exec("pwd");
  console.log("context");
  console.log(context);
  console.log("options");
  console.log(options);
  console.log("__filename");
  console.log(__filename);

  if (!context.projectName) {
    throw new Error(`No project name in context`);
  }

  const sourceRoot = context.workspace.projects[context.projectName].sourceRoot;
  if (!sourceRoot) {
    throw new Error(`No source root was found`);
  }

  const cosmosConfig = {
    globalImports: ["polyfills.ts"],
    watchDirs: ["./"],
    rootDir: sourceRoot,
    webpack: {
      overridePath: path.join(
        offsetFromRoot(sourceRoot),
        "tools/executors/cosmos/config/cosmos.temp-webpack.config.js"
      ),
    },
  };

  shelljs.ShellString(JSON.stringify(cosmosConfig, null, 2)).to(__dirname + "/config/cosmos.temp-config.json");
  shelljs.ShellString(JSON.stringify(context, null, 2)).to(__dirname + "/config/executor-context.temp.json");
  shelljs.ShellString(JSON.stringify(options, null, 2)).to(__dirname + "/config/executor-options.temp.json");

  // console.info(`Executing "cosmosExecutor" with these options:`);
  // console.info(`Options: ${JSON.stringify(options, null, 2)}`);
  //
  // // sample code below
  // const { stdout, stderr } = await promisify(exec)(`echo ${options.textToEcho}`);
  // console.log(stdout);
  // console.error(stderr);

  // return: success/failure
  return { success: true };
}
