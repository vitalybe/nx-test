import * as React from "react";
import { useMemo, useState } from "react";
import styled, { css } from "styled-components";
import _ from "lodash";
import { CachesGridEntity, CachesGridEntityType } from "src/selectedCdn/tabs/tabCaches/_domain/cachesGridEntity";
import { SelectionModeEnum } from "common/utils/hierarchyUtils";
import { CachesGrid } from "src/selectedCdn/tabs/tabCaches/cachesGrid/CachesGrid";
import { ItemsCard } from "common/components/configuration/itemsCard/ItemsCard";
import { darken } from "polished";
import { CommonColors } from "common/styling/commonColors";
import { QnsGrid } from "src/selectedCdn/tabs/tabCaches/qnsGrid/QnsGrid";
import { CacheIcon, UnassignedQnIcon } from "common/components/configuration/configurationIcons";
import { CacheEntity } from "src/_domain/cacheEntity";
import { CdnEntity } from "src/_domain/cdnEntity";
import { useSelectedCdn } from "src/_stores/selectedCdnStore";
import { QnEntity } from "src/_domain/qnEntity";
import { DeploymentEntity } from "common/domain/qwiltDeployment/deploymentEntity";
import { CacheGroupEntity } from "src/_domain/cacheGroupEntity";

//region [[Styles]]
const TabCachesView = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  height: 100%;
`;

const TypeOptions = styled(ItemsCard)`
  height: auto;
  display: flex;
  margin-bottom: 10px;
`;

const TypesContainer = styled.div`
  display: flex;
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TypeButton = styled.div<{ selected: boolean }>`
  background-color: ${(props) => (props.selected ? darken(0.2, CommonColors.GRAY_4) : "none")};
  padding: 5px;
  border-radius: 5px;
  margin-bottom: 5px;
  margin-right: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  .icon {
    margin-right: 0.5em;
  }
  ${(props) =>
    !props.selected &&
    css`
      &:hover {
        background-color: ${darken(0.1, CommonColors.GRAY_2)};
        transition: background-color 0.5s ease;
      }
    `}
`;
//endregion

export interface Props {
  caches: CacheEntity[];
  cacheGroups: CacheGroupEntity[];
  availableQns: QnEntity[];
  networks: DeploymentEntity[];

  className?: string;
}

export const TabCaches = (props: Props) => {
  const [displayedGrid, setDisplayedGrid] = useState<GridTypeEnum>(GridTypeEnum.CACHE);
  const cdn = useSelectedCdn();
  const cachesGridEntities = useMemo(() => createCachesGridEntities(cdn, props.caches), [cdn, props.caches]);

  const qns = sortCacheItems(props.availableQns);

  return (
    <TabCachesView className={props.className}>
      <TypeOptions title={"Type"}>
        <Content>
          <TypesContainer>
            <TypeButton
              selected={displayedGrid === GridTypeEnum.CACHE}
              onClick={() => setDisplayedGrid(GridTypeEnum.CACHE)}>
              <CacheIcon className={"icon"} />
              Caches ({props.caches.length} item{props.caches.length !== 1 ? "s" : ""})
            </TypeButton>
            <TypeButton selected={displayedGrid === GridTypeEnum.QN} onClick={() => setDisplayedGrid(GridTypeEnum.QN)}>
              <UnassignedQnIcon className={"icon"} />
              Unassigned QNs ({qns.length} item{qns.length !== 1 ? "s" : ""})
            </TypeButton>
          </TypesContainer>
        </Content>
      </TypeOptions>
      {displayedGrid === GridTypeEnum.CACHE && (
        <CachesGrid entities={cachesGridEntities} cacheGroups={props.cacheGroups} />
      )}
      {displayedGrid === GridTypeEnum.QN && <QnsGrid entities={qns} networks={props.networks} />}
    </TabCachesView>
  );
};

//region [[Utils]]
enum GridTypeEnum {
  CACHE = "cache",
  QN = "qn",
}

function sortCacheItems(caches: QnEntity[]): QnEntity[] {
  const cachesSortedBySupportName = _.orderBy(
    caches.filter((cache) => cache.supportName),
    ["supportName"]
  );
  const cachesSortedBySystemId = _.orderBy(
    caches.filter((cache) => !cache.supportName),
    ["systemId"]
  );

  return [...cachesSortedBySupportName, ...cachesSortedBySystemId];
}

function createCachesGridEntities(cdn: CdnEntity, caches: CacheEntity[]): CachesGridEntity[] {
  const networksMap: { [key: number]: CachesGridEntity } = {};
  const groupsMap: { [key: string]: CachesGridEntity } = {};

  caches.forEach((cache) => {
    if (cache.network && cache.group) {
      if (!networksMap[cache.network.id]) {
        networksMap[cache.network.id] = new CachesGridEntity({
          id: cache.network.id.toString(),
          name: cache.network.name ?? "N/A",
          selection: SelectionModeEnum.NOT_SELECTED,
          type: CachesGridEntityType.NETWORK,
          children: [],
        });
      }

      if (!groupsMap[cache.group.id]) {
        const group = new CachesGridEntity({
          id: cache.group.id,
          name: cache.group.name ?? "N/A",
          selection: SelectionModeEnum.NOT_SELECTED,
          type: CachesGridEntityType.CACHE_GROUP,
          children: [],
          parent: networksMap[cache.network.id],
        });

        groupsMap[cache.group.id] = group;
        networksMap[cache.network.id]?.children?.push(group);
      }

      const cacheInGrid = new CachesGridEntity({
        id: cache.id,
        name: cache.name,
        selection: SelectionModeEnum.NOT_SELECTED,
        type: CachesGridEntityType.CACHE,
        cache: cache,
        parent: groupsMap[cache.group.id],
      });

      groupsMap[cache.group.id]?.children?.push(cacheInGrid);
    }
  });

  return Object.values(networksMap);
}
//endregion
