import { TopBarSearchGroup } from "src/topBar/topBarSearch/_models/topBarSearchGroup";
import * as _ from "lodash";
import { TopBarSearchOptionModel } from "src/topBar/topBarSearch/_parts/topBarSearchOption/topBarSearchOptionModel";
import { action, computed } from "mobx";
import { mockUtils } from "common/utils/mockUtils";
import { MarketplaceStore } from "src/_stores/marketplaceStore";
import { ApiGeoEntityType } from "common/backend/geoDeployment/geoDeploymentTypes";

export class TopBarSearchModel {
  constructor(private marketplace: MarketplaceStore) {}

  @computed
  get searchGroupsModel(): TopBarSearchGroup[] {
    const groupByResult = _.groupBy(this.marketplace.marketplaceEntities.entities, entity => entity.type);
    const groups: TopBarSearchGroup[] = Object.keys(groupByResult).map(groupName => {
      let entities = groupByResult[groupName];
      if (groupName === ApiGeoEntityType.ISP) {
        entities = _.orderBy(entities, entity => !!entity.geoParent);
      }

      const options = entities.map(entity => {
        return new TopBarSearchOptionModel(entity);
      });
      return new TopBarSearchGroup(groupName, options);
    });

    return groups;
  }

  @action
  selectSearchOption = (id: string) => {
    this.marketplace.moreDetailsCardId = id;
  };

  static createMock() {
    TopBarSearchOptionModel.createMock();
    return mockUtils.createMockObject<TopBarSearchModel>({
      searchGroupsModel: [
        new TopBarSearchGroup("countries", [
          TopBarSearchOptionModel.createMock(),
          TopBarSearchOptionModel.createMock(),
          TopBarSearchOptionModel.createMock(),
        ]),
        new TopBarSearchGroup("isps", [TopBarSearchOptionModel.createMock(), TopBarSearchOptionModel.createMock()]),
      ],
      selectSearchOption: mockUtils.mockAction("selectSearchOption"),
    });
  }
}
