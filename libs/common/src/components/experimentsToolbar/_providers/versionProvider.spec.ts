import { VersionsProvider } from "./versionsProvider";
import { AjaxMetadata } from "../../../utils/ajax";
import { QwosVersionsApi } from "../../../backend/qwosVersions";
import { QwosVersionsApiResult } from "../../../backend/qwosVersions/_types/qwosVersionsTypes";
import { QnDeploymentEntity } from "../../../domain/qwiltDeployment/qnDeploymentEntity";
import { DeploymentEntitiesProvider } from "../../../providers/deploymentEntitiesProvider";

describe("versionProvider", function() {
  describe("provide", function() {
    it("should provide version entities sorted with less supportedQnNames (newest to oldest)", async function() {
      const versionProviderMock = ({
        listSystems: async (): Promise<QwosVersionsApiResult> => {
          return {
            systems: {
              qnName1: {
                qwosVersion: "6.3.2.0-142007",
              },
              qnName2: {
                qwosVersion: "6.3.2.0-142007",
              },
              qnName3: {
                qwosVersion: "6.3.3.0-142059",
              },
              qnName5: {
                qwosVersion: "6.3.2.0-142007",
              },
              qnName4: {
                qwosVersion: "5.7.5.0-115177",
              },
              qnName6: {
                qwosVersion: "6.3.2.0-142007",
              },
            },
          };
        },
      } as Partial<QwosVersionsApi>) as QwosVersionsApi;

      const deploymentEntitiesProviderMock = ({
        provideQns: async (): Promise<QnDeploymentEntity[]> => {
          return [
            {
              name: "qnName1",
              network: undefined,
              uniqueName: "qnName1",
              id: 1,
              uiSystemId: "qnName1",
              systemId: "qnName1",
              attributes: {},
            },
            {
              name: "qnName2",
              network: undefined,
              uniqueName: "qnName2",
              id: 2,
              uiSystemId: "qnName2",
              systemId: "qnName2",
              attributes: {},
            },
            {
              name: "qnName3",
              network: undefined,
              uniqueName: "qnName3",
              id: 3,
              uiSystemId: "qnName3",
              systemId: "qnName3",
              attributes: {},
            },
            {
              name: "qnName4",
              network: undefined,
              uniqueName: "qnName4",
              id: 4,
              uiSystemId: "qnName4",
              systemId: "qnName4",
              attributes: {},
            },
            {
              name: "qnName5",
              network: undefined,
              uniqueName: "qnName5",
              id: 5,
              uiSystemId: "qnName5",
              systemId: "qnName5",
              attributes: {},
            },
            {
              name: "qnName6",
              network: undefined,
              uniqueName: "qnName6",
              id: 6,
              uiSystemId: "qnName6",
              systemId: "qnName6",
              attributes: {},
            },
          ];
        },
      } as Partial<DeploymentEntitiesProvider>) as DeploymentEntitiesProvider;

      const versionEntities = await VersionsProvider.instance.provide(
        new AjaxMetadata(),
        versionProviderMock,
        deploymentEntitiesProviderMock
      );

      expect(versionEntities[1].versionQnNames).toHaveLength(4);
      expect(versionEntities[2].supportedQnNames).toHaveLength(6);
    });
  });
});
