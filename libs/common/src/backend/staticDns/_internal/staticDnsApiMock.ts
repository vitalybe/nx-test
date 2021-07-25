/* eslint-disable unused-imports/no-unused-vars */
import { AjaxMetadata } from "../../../utils/ajax";
import { sleep } from "../../../utils/sleep";
import { StaticDnsApi } from "../../staticDns";
import { StaticDnsApiResult, StaticDnsEditApiType } from "../_types/staticDnsTypes";
import { loggerCreator } from "../../../utils/logger";
import { mockNetworkSleep } from "../../../utils/mockUtils";

const moduleLogger = loggerCreator("__filename");

export class StaticDnsApiMock implements StaticDnsApi {
  async list(metadata: AjaxMetadata): Promise<StaticDnsApiResult> {
    await sleep(mockNetworkSleep);

    return {
      staticDnsResponseList: [
        {
          deliveryServiceId: "5e3c30469877620001b1b25e",
          cdnId: "9e331b22-5d11-4067-9bf4-5f0992bd73fc",
          type: "CNAME_RECORD",
          name: "ctr",
          value: "manifest-router-euw1.http.cdn-i.opencaching.tc-rnd.cqloud.com.",
          ttl: "300",
          dnsRecordId: "64a25b0e-20a8-4f56-b38d-b9d9e0c3c975",
          orgId: "devorg",
        },
        {
          deliveryServiceId: "5e4e863f2e016f0001046c33",
          cdnId: "9b2d89fe-7078-41e1-89c9-077f041ba480",
          type: "A_RECORD",
          name: "Yuval-group-2",
          value: "test",
          ttl: "123",
          dnsRecordId: "b34ac921-aac9-49c0-b511-0a5fd967a4f6",
          orgId: "devorg",
        },
        {
          deliveryServiceId: "5e3c30469877620001b1b25e",
          cdnId: "9e331b22-5d11-4067-9bf4-5f0992bd73fc",
          type: "CNAME_RECORD",
          name: "ctr-2",
          value: "manifest-router-lb-0-euw1-green.oper.opencaching.tc-rnd.cqloud.com.",
          ttl: "3600",
          dnsRecordId: "f9c83674-16d6-41aa-9130-1db4fd681654",
          orgId: "devorg",
        },
      ],
    };
  }

  async update(id: string, entity: StaticDnsEditApiType) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock update, id: " + id);
    moduleLogger.debug(JSON.stringify(entity));
  }

  async create(entity: StaticDnsEditApiType) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock create: ");
    moduleLogger.debug(JSON.stringify(entity));
  }

  async delete(id: string) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock delete: " + id);
  }

  //region [[ Singleton ]]
  protected static _instance: StaticDnsApiMock | undefined;
  static get instance(): StaticDnsApiMock {
    if (!this._instance) {
      this._instance = new StaticDnsApiMock();
    }

    return this._instance;
  }
  //endregion
}

//region [[ Mock config types ]]
interface StaticDnsApiMockConfig {
  sampleText: string;
}
//endregion
