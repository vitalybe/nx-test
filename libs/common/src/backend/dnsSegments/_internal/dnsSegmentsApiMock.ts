import { sleep } from "common/utils/sleep";
import { DnsSegmentsApi } from "common/backend/dnsSegments";
import { DnsSegmentsApiResult, DnsSegmentsApiType } from "common/backend/dnsSegments/_types/dnsSegmentsTypes";
import { loggerCreator } from "common/utils/logger";
import { mockNetworkSleep } from "common/utils/mockUtils";

const moduleLogger = loggerCreator(__filename);

export class DnsSegmentsApiMock extends DnsSegmentsApi {
  async list(cdnId: string): Promise<DnsSegmentsApiResult> {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock List, cdnId: " + cdnId);

    const dnsSegments: Record<string, DnsSegmentsApiType> = {};
    dnsSegments["0"] = { dnsRoutingSegmentId: "DNS Segment 1", subDomain: "subdomain" };
    dnsSegments["1"] = { dnsRoutingSegmentId: "DNS Segment 2", subDomain: "subdomain" };
    dnsSegments["2"] = { dnsRoutingSegmentId: "DNS Segment 3", subDomain: "subdomain" };
    return { dnsRoutingSegments: dnsSegments };
  }

  async update(cdnId: string, entity: DnsSegmentsApiType) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock update, id: " + entity.dnsRoutingSegmentId);
    moduleLogger.debug(JSON.stringify(entity));
  }

  async create(cdnId: string, entity: DnsSegmentsApiType) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock create: ");
    moduleLogger.debug(JSON.stringify(entity));
  }

  async delete(cdnId: string, dnsRoutingSegmentId: string) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock delete: " + dnsRoutingSegmentId);
  }

  //region [[ Singleton ]]
  protected static _instance: DnsSegmentsApiMock | undefined;
  static get instance(): DnsSegmentsApiMock {
    if (!this._instance) {
      this._instance = new DnsSegmentsApiMock();
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

  mockConfig: DnsSegmentsApiMockConfig = this.getDefaultMockConfig();
  //endregion
}

//region [[ Mock config types ]]
interface DnsSegmentsApiMockConfig {
  sampleText: string;
}

//endregion
