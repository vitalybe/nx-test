import { loggerCreator } from "../../../utils/logger";
import { AjaxMetadata } from "../../../utils/ajax";
import { VersionEntity } from "../_domain/versionEntity";
import { QwosVersionsApi } from "../../../backend/qwosVersions";
import { QwosVersionsApiResult } from "../../../backend/qwosVersions/_types/qwosVersionsTypes";
import { DeploymentEntitiesProvider } from "../../../providers/deploymentEntitiesProvider";
import { QnDeploymentEntity } from "../../../domain/qwiltDeployment/qnDeploymentEntity";
import { VersionsUtils } from "../_utils/versionsUtils";
import _ from "lodash";
import { UrlStore } from "../../../stores/urlStore/urlStore";
import { CommonUrlParams } from "../../../urlParams/commonUrlParams";

const moduleLogger = loggerCreator("__filename");

export class VersionsProvider {
  private constructor() {}

  provide = async (
    metadata: AjaxMetadata,
    qwosVersionsApi: QwosVersionsApi = QwosVersionsApi.instance,
    deploymentEntitiesProvider: DeploymentEntitiesProvider = DeploymentEntitiesProvider.instance
  ): Promise<VersionEntity[]> => {
    const { systems }: QwosVersionsApiResult = await qwosVersionsApi.listSystems(metadata);
    const qns = await deploymentEntitiesProvider.provideQns(metadata, false, true, false);
    const qnsSystemIdsMap: { [key: string]: QnDeploymentEntity } = {};

    //generates a map of { systemId -> qn }
    qns.forEach((qn) => {
      const systemId = qn.systemId;
      if (systemId) {
        qnsSystemIdsMap[systemId] = qn;
      }
    });

    const versionsMap: { [key: string]: VersionEntity } = {};

    Object.keys(systems).forEach((systemId) => {
      const versionId = VersionsUtils.formatVersionString(systems[systemId].qwosVersion);
      const qnName = qnsSystemIdsMap[systemId]?.name;

      if (qnName && !!versionId) {
        if (!versionsMap[versionId]) {
          versionsMap[versionId] = {
            id: versionId,
            versionQnNames: [qnName],
            supportedQnNames: [],
          };
        } else {
          versionsMap[versionId].versionQnNames.push(qnName);
        }
      }
    });

    //sets string[] of supported QNs into each entity.
    //supported QNs includes previous versions' supported QNs & selected version's supported QNs.
    const versionEntities = _.orderBy(Object.values(versionsMap), "id", "desc");

    versionEntities[0].supportedQnNames = versionEntities[0].versionQnNames;

    for (let i = 1; i < versionEntities.length; i++) {
      const versionEntity = versionEntities[i];

      versionEntity.supportedQnNames = [...versionEntities[i - 1].supportedQnNames, ...versionEntity.versionQnNames];
    }

    return versionEntities;
  };

  isAllQnsSupportVersion = async (version: string, metadata: AjaxMetadata): Promise<boolean> => {
    const allVersions = await this.provide(metadata);
    const selectedVersion =
      UrlStore.getInstance().getParam(CommonUrlParams.qnVersion) ?? allVersions[allVersions.length - 1].id;

    return selectedVersion.localeCompare(version) !== -1;
  };

  //region [[ Singleton ]]
  private static _instance: VersionsProvider | undefined;
  static get instance(): VersionsProvider {
    if (!this._instance) {
      this._instance = new VersionsProvider();
    }

    return this._instance;
  }
  //endregion
}
