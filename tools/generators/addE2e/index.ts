import {
  Tree,
  joinPathFragments,
  generateFiles,
  offsetFromRoot,
  updateJson,
  getWorkspaceLayout,
  normalizePath,
  names,
} from "@nrwl/devkit";
import { GeneratorUtils } from "../_utils/generatorUtils";

export async function generateAddE2E(host: Tree, schema: { appName: string }) {
  const appDirectory = names(schema.appName).fileName;
  const { appsDir } = getWorkspaceLayout(host);
  const appProjectRoot = normalizePath(`${appsDir}/${appDirectory}`);

  const e2eProjectRoot = joinPathFragments(appProjectRoot, "e2e");
  generateFiles(host, joinPathFragments(__dirname, "./files/e2e"), e2eProjectRoot, {
    tmpl: "",
    project: schema.appName,
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
  GeneratorUtils.getAndUpdateProject(schema.appName, host, (projectConfig) => {
    projectConfig.targets["e2e"] = {
      executor: "@nrwl/cypress:cypress",
      options: {
        cypressConfig: joinPathFragments(e2eProjectRoot, "cypress.json"),
        tsConfig: joinPathFragments(e2eProjectRoot, "tsconfig.e2e.json"),
        devServerTarget: `${schema.appName}:serve`,
      },
      configurations: {
        production: {
          devServerTarget: `${schema.appName}:serve:production`,
        },
      },
    };
  });
}

export default generateAddE2E;
