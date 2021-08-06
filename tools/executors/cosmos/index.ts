import { ExecutorContext } from "@nrwl/devkit";
import { exec } from "child_process";
import { promisify } from "util";

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
  console.info(`Executing "cosmosExecutor" with these options:`);
  console.info(`Options: ${JSON.stringify(options, null, 2)}`);

  // sample code below
  const { stdout, stderr } = await promisify(exec)(`echo ${options.textToEcho}`);
  console.log(stdout);
  console.error(stderr);

  // return: success/failure
  return { success: true };
}
