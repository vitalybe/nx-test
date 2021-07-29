import { DnsSegmentEntity } from "../_domain/DnsSegmentEntity";
import { DnsSegmentsApi } from "@qwilt/common/backend/dnsSegments";
import { DnsSegmentsApiType } from "@qwilt/common/backend/dnsSegments/_types/dnsSegmentsTypes";
import { PrepareQueryResult } from "@qwilt/common/utils/reactQueryUtils/prepareQueryResult";

export class DnsSegmentProvider {
  private constructor() {}

  prepareQuery(cdnId: string): PrepareQueryResult<DnsSegmentEntity[]> {
    return new PrepareQueryResult<DnsSegmentEntity[]>({
      name: "DnsSegmentProvider.prepareQuery",
      // NOTE: remove if there are no arguments
      // eslint-disable-next-line prefer-rest-params
      params: [...arguments],
      provide: async () => {
        return await this.provide(cdnId);
      },
    });
  }

  provide = async (cdnId: string): Promise<DnsSegmentEntity[]> => {
    const resp = await DnsSegmentsApi.instance.list(cdnId);
    const dnsSegments = resp.dnsRoutingSegments;
    return Object.keys(dnsSegments).map((key: string) => {
      const dnsSegment = dnsSegments[key];
      return new DnsSegmentEntity(dnsSegment["dnsRoutingSegmentId"], dnsSegment["subDomain"]);
    });
  };

  update = async (cdnId: string, segmentId: string, subDomain: string, edit: boolean): Promise<void> => {
    const dnsSegmentApi: DnsSegmentsApiType = {
      dnsRoutingSegmentId: segmentId,
      subDomain: subDomain,
    };

    if (edit) {
      await DnsSegmentsApi.instance.update(cdnId, dnsSegmentApi);
    } else {
      await DnsSegmentsApi.instance.create(cdnId, dnsSegmentApi);
    }

    this.prepareQuery(cdnId).invalidateWithChildren();
  };

  delete = async (cdnId: string, dnsSegmentId: string): Promise<void> => {
    await DnsSegmentsApi.instance.delete(cdnId, dnsSegmentId);

    this.prepareQuery(cdnId).invalidateWithChildren();
  };

  //region [[ Singleton ]]
  private static _instance: DnsSegmentProvider | undefined;
  static get instance(): DnsSegmentProvider {
    if (!this._instance) {
      this._instance = new DnsSegmentProvider();
    }
    return this._instance;
  }
}
