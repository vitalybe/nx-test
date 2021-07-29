import * as React from "react";
import { useMemo } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import {
  getDeleteAction,
  getEditAction,
  GridReactRenderer,
  GridValueRenderer,
  QwiltGrid,
  QwiltGridColumnDef,
} from "common/components/qwiltGrid/QwiltGrid";
import { ItemsCard } from "common/components/configuration/itemsCard/ItemsCard";
import { HttpRouterGroupEntity } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/httpRouterGroupsTab/_domain/httpRouterGroupEntity";
import { useEventCallback } from "common/utils/hooks/useEventCallback";
import { openConfirmModal, openQwiltModal } from "common/components/qwiltModal/QwiltModal";
import { FallbacksContainer } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/httpRouterGroupsTab/fallbacksContainer/FallbacksContainer";
import { Icons } from "common/styling/icons";
import { HttpRouterGroupsEditor } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/httpRouterGroupsTab/httpRouterGroupsEditor/HttpRouterGroupsEditor";
import { HttpRouterGroupsProvider } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/httpRouterGroupsTab/_providers/httpRouterGroupsProvider";
import { useSelectedCdn } from "src/_stores/selectedCdnStore";
import { QueryDataContainer } from "common/components/queryDataContainer/QueryDataContainer";
import { UseQueryResult } from "react-query/types/react/types";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const ProviderDataContainerStyled = styled(QueryDataContainer)`
  height: 100%;
` as typeof QueryDataContainer;

const MainList = styled(ItemsCard)`
  height: 100%;
  padding-right: 5px;
  padding-left: 5px;
  position: relative;
  width: 100%;
  margin-bottom: 10px;
`;

const HeaderContainer = styled.div`
  position: relative;
`;

const GridIcon = styled.img`
  filter: invert(34%) sepia(60%) saturate(617%) hue-rotate(150deg) brightness(91%) contrast(90%);
  margin-right: 0.3em;
  width: 20px;
`;
//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  cdnId: string;
  cdnName: string;

  filter: string;
  onFilterChange: (filter: string) => void;

  className?: string;
}

//endregion [[ Props ]]

export const HttpRouterGroupsTab = (props: Props) => {
  const cdn = useSelectedCdn();
  const query: UseQueryResult<HttpRouterGroupEntity[]> = HttpRouterGroupsProvider.instance
    .prepareQuery(cdn.id)
    .useQuery();

  const openEditor = (editedItem: HttpRouterGroupEntity | undefined) => {
    openQwiltModal((closeModalWithResult) => (
      <HttpRouterGroupsEditor
        editedItem={editedItem}
        existingGroups={query.data ?? []}
        cdn={cdn}
        onClose={() => closeModalWithResult()}
      />
    ));
  };

  const onDelete = useEventCallback(async (httpRouterGroup: HttpRouterGroupEntity) => {
    await openConfirmModal(`Are you sure want to delete item?`, `Please confirm - ${props.cdnName}`, async () => {
      await HttpRouterGroupsProvider.instance.delete(props.cdnId, httpRouterGroup.id);
    });
  });

  const onEdit = useEventCallback(async (editedEntity: HttpRouterGroupEntity) => {
    openEditor(editedEntity);
  });

  const actions = useMemo(
    () => [
      getEditAction(onEdit),
      getDeleteAction(onDelete, {
        enabledPredicate: (item) => item.isDeletable,
        disabledTooltip: "Can't delete assigned group",
      }),
    ],
    [onDelete, onEdit]
  );

  const columns = useMemo<QwiltGridColumnDef<HttpRouterGroupEntity>[]>(
    () => [
      {
        headerName: "Name",
        renderer: new GridReactRenderer({
          valueGetter: (entity) => entity.name,
          reactRender: ({ value }) => (
            <>
              <HeaderContainer>
                <GridIcon src={Icons.HTTP_ROUTER_GROUP} />
                {value + " "}
              </HeaderContainer>
            </>
          ),
        }),
      },
      {
        headerName: "TTL",
        renderer: new GridValueRenderer({ valueGetter: (entity) => entity.ttl.toString() }),
      },
      {
        headerName: "DNS Name",
        renderer: new GridValueRenderer({ valueGetter: (entity) => entity.dnsName }),
      },
      {
        headerName: "Fallbacks",
        renderer: new GridReactRenderer({
          valueGetter: (entity) => entity.fallbackGroups.flatMap((group) => group.name).join(""),
          reactRender: ({ entity }) => (
            <FallbacksContainer
              fallbackHttpRouterGroupsNames={entity.fallbackGroups.flatMap((fallbackGroup) => fallbackGroup.name)}
            />
          ),
        }),
      },
    ],
    []
  );

  return (
    <ProviderDataContainerStyled queryMetadata={query}>
      {(data) => (
        <MainList
          title={"Http Router Groups"}
          filter={{ onFilter: props.onFilterChange, filterValue: props.filter }}
          onAddButton={() => openEditor(undefined)}>
          <QwiltGrid<HttpRouterGroupEntity>
            filter={props.filter}
            rows={data}
            actions={actions}
            columns={columns}
            gridOptions={{ animateRows: true }}
          />
        </MainList>
      )}
    </ProviderDataContainerStyled>
  );
};
