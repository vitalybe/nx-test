import { VersionsProvider } from "common/components/experimentsToolbar/_providers/versionsProvider";
import { AjaxMetadata } from "common/utils/ajax";
import _ from "lodash";

export class VersionsUtils {
  //returns a Set of qn names supported by the entered version ID
  static async filterQns(versionId: string): Promise<Set<string>> {
    const allVersions = await VersionsProvider.instance.provide(new AjaxMetadata());
    const sortedVersions = _.orderBy(allVersions, "id");
    const selectedVersion = sortedVersions.find((versionEntity) => versionEntity.id === versionId);
    const qnsNamesSet = new Set<string>();

    if (selectedVersion?.supportedQnNames) {
      selectedVersion.supportedQnNames.forEach((qnName) => qnsNamesSet.add(qnName));
    }

    return qnsNamesSet;
  }

  static formatVersionString(version: string): string {
    const shortVersionString = version.substring(0, version.indexOf("-"));

    if (shortVersionString[shortVersionString.length - 1] === "0") {
      return shortVersionString.substring(0, shortVersionString.length - 2);
    }

    return shortVersionString;
  }
}
