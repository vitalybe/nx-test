import { loggerCreator } from "../../../utils/logger";
import { devToolsStore } from "../../devTools/_stores/devToolsStore";
import { Ajax } from "../../../utils/ajax";
import { CommonUrls } from "../../../utils/commonUrls";

const moduleLogger = loggerCreator("__filename");

interface ProjectEnvVersions {
  projects: {
    [projectName: string]: {
      envs: { [env: string]: string };
    };
  };
}

// returns the project name. for non-projects or old versions, returns undefined, e.g:
// http://dev-localhost.cqloud.com/login/reset-init => login
// http://dev-localhost.cqloud.com/reset-init => undefined
// http://dev-localhost.cqloud.com/old-versions/login/v19-6-27b2/reset-init => undefined
function getProjectName(href: string): string | undefined {
  let projectName = "";

  const projectRoot = CommonUrls.getProjectRoot(href);
  const parts = projectRoot.split("/");
  // we're only interested in true projects - not old versions and such
  if (parts.length <= 2) {
    projectName = parts[0];
  }

  return projectName;
}

export async function getRedirectPathForEnv(): Promise<string | undefined> {
  try {
    let redirectUrl: string | undefined;

    // redirect to specific versions occurs only in deployed qc-services-dev
    const href = location.href;
    if (CommonUrls.isQcServicesDev(href)) {
      const env = devToolsStore.environment;
      const projectName = getProjectName(href);

      if (env && projectName) {
        const projectEnvsJson = CommonUrls.qcServicesUrl + "/data-no-git/project-env-versions.json";
        const projectEnvVersions = (await Ajax.getJson(projectEnvsJson)) as ProjectEnvVersions;

        const thisProjectEnvs = projectEnvVersions.projects[projectName];
        if (thisProjectEnvs) {
          const targetVersion = thisProjectEnvs.envs[env];
          if (targetVersion) {
            redirectUrl = CommonUrls.buildUrl(`/old-versions/${projectName}/${targetVersion}`, false, "all");
          }
        }
      }
    }

    return redirectUrl;
  } catch (e) {
    moduleLogger.warn("failed to check for redirect to older version: ", e);
    return undefined;
  }
}
