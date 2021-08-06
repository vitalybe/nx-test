import { ExecutorContext } from "@nrwl/devkit";
import { exec } from "child_process";
import { promisify } from "util";

export interface Echo2ExecutorOptions {
  textToEcho: string;
}

// Add as target to workspace.json:
// "echo2": {
//  "executor": "./tools/executors/echo2:echo2",
//  "options": {
//    ...
//  }
// }

export default async function echo2Executor(options: Echo2ExecutorOptions, context: ExecutorContext) {
  console.info(`Executing "echo2Executor" with these options:`);
  console.info(`Options: ${JSON.stringify(options, null, 2)}`);

  // sample code below
  const { stdout, stderr } = await promisify(exec)(`echo ${options.textToEcho}`);
  console.log(stdout);
  console.error(stderr);

  // return: success/failure
  return { success: true };
}
