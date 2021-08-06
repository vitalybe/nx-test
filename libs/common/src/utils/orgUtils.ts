import { loggerCreator } from "./logger";

// @ts-ignore
const orgsImagesContext = require?.context?.("../images/orgs/", false);
const moduleLogger = loggerCreator("__filename");

export class OrgUtils {
  static getOrgLogo(orgId: string) {
    let path: string | undefined;

    try {
      path = orgsImagesContext?.(`./${orgId}.png`);
    } catch (e) {
      moduleLogger.warn("failed to find logo for organization id: " + orgId);
    }

    return path;
  }
}
