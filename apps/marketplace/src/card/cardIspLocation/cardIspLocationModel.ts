import { mockUtils } from "common/utils/mockUtils";
import { MarketplaceStore } from "src/_stores/marketplaceStore";
import { CardMoreDetailsContainerModel } from "src/card/_parts/cardMoreDetailsContainer/cardMoreDetailsContainerModel";
import { promisedComputed } from "computed-async-mobx";
import { computed, observable } from "mobx";
import { MarketplaceEntityGeo } from "src/_domain/marketplaceEntity/marketplaceEntityGeo";
import { MarketplaceEntityIsp } from "src/_domain/marketplaceEntity/marketplaceEntityIsp";
import { qoeChartValuesProvider } from "src/card/cardIspLocation/_providers/qoeChartValuesProvider";
import { StoreStatus } from "common/stores/_models/storeStatus";
import { Snippets } from "common/utils/snippets";
import { Notifier } from "common/utils/notifications/notifier";

const qoeValuesCache: Map<string, number[]> = new Map();

export class CardIspLocationModel {
  constructor(
    private marketplaceEntity: MarketplaceEntityGeo | MarketplaceEntityIsp,
    private marketplace: MarketplaceStore
  ) {}

  readonly cardMoreDetailsContainer = new CardMoreDetailsContainerModel(this.marketplaceEntity, this.marketplace);
  private qoeValuesCache: number[] | undefined;

  @observable
  status: StoreStatus = new StoreStatus();

  private qoeValuesObservable = promisedComputed(undefined, async () => {
    try {
      return await qoeChartValuesProvider.provide(this.marketplaceEntity.id, this.marketplace.lastMonthQoeTimeConfig);
    } catch (e) {
      this.status.setError(Snippets.FETCH_DATA_FAIL);
      Notifier.error(Snippets.FETCH_DATA_FAIL, e);
    }
  });

  @computed
  get qoeValues(): number[] | undefined {
    let qoeValues = qoeValuesCache.get(this.marketplaceEntity.id);
    if (!qoeValues) {
      qoeValues = this.qoeValuesObservable.get();

      if (qoeValues) {
        qoeValuesCache.set(this.marketplaceEntity.id, qoeValues);
      }
    }

    return qoeValues;
  }

  static createMock(modelOverrides?: Partial<CardIspLocationModel>) {
    return mockUtils.createMockObject<CardIspLocationModel>({
      cardMoreDetailsContainer: CardMoreDetailsContainerModel.createMock(),
      qoeValues: [Math.pow(10, 6), Math.pow(10, 7), Math.pow(10, 8)],
      status: StoreStatus.createMock(),
      ...modelOverrides,
    });
  }
}
