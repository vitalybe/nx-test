import { sleep } from "../../../../utils/sleep";
import { FootprintElementsApi } from "../index";
import {
  FootprintApiType,
  FootprintElementsApiResult,
  FootprintElementsApiType,
} from "../_types/footprintElementsTypes";
import { loggerCreator } from "../../../../utils/logger";
import mockData from "../../../_utils/mockData";
import { mockNetworkSleep } from "../../../../utils/mockUtils";

const moduleLogger = loggerCreator("__filename");

export class FootprintElementsApiMock extends FootprintElementsApi {
  async list(): Promise<FootprintElementsApiResult> {
    await sleep(mockNetworkSleep);

    const footprints: Record<string, FootprintElementsApiType> = {};
    footprints[mockData.footprintId[0]] = {
      directives: {
        "isp-file": {
          device: "verizon",
          source: "router_11",
        },
        asn: 1,
        "manual-fallback": {
          subnets: ["192.168.2.1/30"],
        },
        "manual-override": {
          subnets: ["192.168.2.1/30"],
        },
        wire: {
          source: "DUG MOCK 1",
        },
        "rest-of-asn": false,
      },
      name: "Footprint Element 1",
    };

    footprints[mockData.footprintId[1]] = {
      directives: {
        asn: 2,
        "isp-file": {
          device: "verizon",
          source: "router_11",
        },
        "manual-fallback": {
          subnets: ["192.168.2.1/30"],
        },
        "manual-override": {
          subnets: ["192.168.2.1/30"],
        },
        wire: {
          source: "wire",
        },
        "rest-of-asn": false,
      },
      name: "Footprint Element 2",
    };

    footprints[mockData.footprintId[2]] = {
      directives: {
        asn: 3,
        "isp-file": {
          device: "verizon",
          source: "router_11",
        },
        "manual-fallback": {
          subnets: ["192.168.2.1/30"],
        },
        "manual-override": {
          subnets: ["192.168.2.1/30"],
        },
        wire: {
          source: "wire",
        },
        "rest-of-asn": false,
      },
      name: "Footprint Element 3",
    };

    return {
      "footprint-elements": footprints,
    };
  }

  async update(id: string, entity: FootprintElementsApiType): Promise<boolean> {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock update, id: " + id);
    moduleLogger.debug(JSON.stringify(entity));

    return true;
  }

  async create(entity: FootprintElementsApiType): Promise<FootprintApiType | string> {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock create: ");
    moduleLogger.debug(JSON.stringify(entity));

    return "success";
  }

  async delete(id: string): Promise<boolean> {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock delete: " + id);

    return true;
  }

  //region [[ Singleton ]]
  protected static _instance: FootprintElementsApiMock | undefined;
  static get instance(): FootprintElementsApiMock {
    if (!this._instance) {
      this._instance = new FootprintElementsApiMock();
    }

    return this._instance;
  }

  //endregion

  //region [[ Mock config ]]
  private getDefaultMockConfig() {
    return {
      sampleText: "very mock",
    };
  }

  mockConfig: FootprintElementsApiMockConfig = this.getDefaultMockConfig();
  //endregion
}

//region [[ Mock config types ]]
interface FootprintElementsApiMockConfig {
  sampleText: string;
}

//endregion
