/* eslint-disable unused-imports/no-unused-vars,unused-imports/no-unused-vars */
import { AjaxMetadata } from "../../../utils/ajax";
import { mockNetworkSleep } from "../../../utils/mockUtils";
import { sleep } from "../../../utils/sleep";
import { IspFootprintInputSourceManagerApi } from "../../ispFootprintInputSourceManager";
import {
  BgpInputApiType,
  BgpInputResultApiType,
} from "../_types/ispFootprintInputSourceManagerTypes";
import { loggerCreator } from "../../../utils/logger";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

export class IspFootprintInputSourceManagerApiMock implements IspFootprintInputSourceManagerApi {
  async list(metadata: AjaxMetadata): Promise<BgpInputResultApiType> {
    await sleep(mockNetworkSleep);

    return {
      bgpInputSources: [
        {
          inputSourceId: "source-2",
          streams: {
            "stream-1": {
              sourceIp: "1.2.3.4",
              collectorIds: ["collector-1", "collector-2"],
            },
            "stream-2": {
              sourceIp: "1.2.3.5",
              collectorIds: ["collector-1", "collector-3"],
            },
          },
          processorName: "processor-x",
          processorType: "active-passive",
          activePassiveProcessorConfig: {
            activeStreamId: "stream-1",
            activeCollectorId: "collector-2",
          },
          asn: 12346,
        },
        {
          inputSourceId: "source-3",
          streams: {
            "stream-1": {
              sourceIp: "1.2.3.4",
              collectorIds: ["collector-1", "collector-2"],
            },
            "stream-2": {
              sourceIp: "1.2.3.5",
              collectorIds: ["collector-1", "collector-3"],
            },
          },
          processorName: "processor-x",
          processorType: "active-passive",
          activePassiveProcessorConfig: {
            activeStreamId: "stream-1",
            activeCollectorId: "collector-2",
          },
          asn: 12346,
        },
      ],
    };
  }

  async update(id: string, entity: BgpInputApiType): Promise<BgpInputApiType> {
    await sleep(mockNetworkSleep);
    return entity;
  }

  async create(entity: BgpInputApiType): Promise<BgpInputApiType> {
    await sleep(mockNetworkSleep);
    return entity;
  }

  async delete(id: string) {
    await sleep(mockNetworkSleep);
  }

  //region [[ Singleton ]]
  protected static _instance: IspFootprintInputSourceManagerApiMock | undefined;
  static get instance(): IspFootprintInputSourceManagerApiMock {
    if (!this._instance) {
      this._instance = new IspFootprintInputSourceManagerApiMock();
    }

    return this._instance;
  }
  //endregion
}

//region [[ Mock config types ]]
interface IspFootprintInputSourceManagerApiMockConfig {
  sampleText: string;
}
//endregion
