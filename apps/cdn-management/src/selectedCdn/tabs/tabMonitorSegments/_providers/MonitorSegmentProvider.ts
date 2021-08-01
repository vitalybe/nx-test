import { MonitorSegmentEntity } from "../_domain/MonitorSegmentEntity";
import { MonitorSegmentsApi } from "@qwilt/common/backend/monitorSegments";
import { MonitorSegmentsApiType } from "@qwilt/common/backend/monitorSegments/_types/monitorSegmentsTypes";
import { PrepareQueryResult } from "@qwilt/common/utils/reactQueryUtils/prepareQueryResult";

export class MonitorSegmentProvider {
  private constructor() {}

  prepareQuery(cdnId: string): PrepareQueryResult<MonitorSegmentEntity[]> {
    return new PrepareQueryResult<MonitorSegmentEntity[]>({
      name: "MonitorSegmentProvider.prepareQuery",
      params: [cdnId],
      provide: async (): Promise<MonitorSegmentEntity[]> => {
        return await this.provide(cdnId);
      },
    });
  }

  provide = async (cdnId: string) => {
    const monitorSegmentsResult = await MonitorSegmentsApi.instance.list(cdnId);

    const monitorSegments = monitorSegmentsResult.monitoringSegments;
    return Object.keys(monitorSegments).map((key: string) => {
      const monitorSegment = monitorSegments[key];
      return new MonitorSegmentEntity(
        monitorSegment.monitoringSegmentId,
        monitorSegment.healthCollectorSystemIds ?? []
      );
    });
  };

  update = async (cdnId: string, segment: MonitorSegmentEntity, isEdit: boolean): Promise<void> => {
    const segmentApiType: MonitorSegmentsApiType = {
      monitoringSegmentId: segment.id,
      healthCollectorSystemIds: segment.healthCollectorIds,
    };

    if (isEdit) {
      await MonitorSegmentsApi.instance.update(cdnId, segmentApiType);
    } else {
      await MonitorSegmentsApi.instance.create(cdnId, segmentApiType);
    }

    this.prepareQuery(cdnId).invalidateWithChildren();
  };

  delete = async (cdnId: string, monitorSegmentId: string): Promise<void> => {
    await MonitorSegmentsApi.instance.delete(cdnId, monitorSegmentId);

    this.prepareQuery(cdnId).invalidateWithChildren();
  };

  //region [[ Singleton ]]
  private static _instance: MonitorSegmentProvider | undefined;
  static get instance(): MonitorSegmentProvider {
    if (!this._instance) {
      this._instance = new MonitorSegmentProvider();
    }
    return this._instance;
  }
}
