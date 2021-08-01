import * as _ from "lodash";
import * as React from "react";
import { useMemo } from "react";
import styled from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { ItemsCard } from "@qwilt/common/components/configuration/itemsCard/ItemsCard";
import {
  getDeleteAction,
  getEditAction,
  GridReactRenderer,
  GridValueRenderer,
  QwiltGrid,
  QwiltGridColumnDef,
  QwiltGridTreeColumnDef,
} from "@qwilt/common/components/qwiltGrid/QwiltGrid";
import { useEventCallback } from "@qwilt/common/utils/hooks/useEventCallback";
import { openConfirmModal, openQwiltModal } from "@qwilt/common/components/qwiltModal/QwiltModal";

import { FallbacksContainer } from "./fallbacksContainer/FallbacksContainer";
import { GridOptions, RowNode } from "ag-grid-community";
import { SimpleTextFloatingFilter } from "@qwilt/common/components/qwiltGrid/simpleTextFloatingFilter/SimpleTextFloatingFilter";
import { CdnsApi } from "@qwilt/common/backend/cdns";
import { Notifier } from "@qwilt/common/utils/notifications/notifier";
import { useUrlState } from "@qwilt/common/utils/hooks/useUrlState";
import { ProjectUrlParams } from "../../../_stores/projectUrlParams";
import { CacheGroupIcon } from "@qwilt/common/components/configuration/configurationIcons";
import { ProjectUrlStore } from "../../../_stores/projectUrlStore";
import { Utils } from "@qwilt/common/utils/utils";
import { CacheGroupEntity } from "../../../_domain/cacheGroupEntity";
import { EditorCacheGroupContainer } from "./editorCacheGroup/editorCacheGroupContainer";
import { useMutation } from "react-query";
import { CachesProvider } from "../../../_providers/cachesProvider";
import { CacheGroupsProvider } from "../../../_providers/cacheGroupsProvider";
import { useSelectedCdn } from "../../../_stores/selectedCdnStore";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const QwiltGridStyled = styled(QwiltGrid)`
  .ag-cell-wrapper.ag-row-group {
    align-items: center;
  }

  .ag-react-container {
    display: grid;
    align-content: center;
    height: 100%;
  }
` as typeof QwiltGrid;

const DeliveryUnitGroupsGridView = styled(ItemsCard)`
  height: 100%;
`;

const Cell = styled.div`
  display: flex;
  align-items: center;
  grid-gap: 0.5rem;
`;

const CacheGroupIconStyled = styled(CacheGroupIcon)`
  flex: 0 0 auto;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  cacheGroups: CacheGroupEntity[];

  className?: string;
}

//endregion [[ Props ]]

export interface CacheGroupContainer {
  name: string;
  children: CacheGroupContainer[] | CacheGroupEntity[];
}

type CacheGroupRowType = CacheGroupEntity | CacheGroupContainer;

export const CacheGroupGrid = (props: Props) => {
  const [filter = "" as string, setFilter] = useUrlState(ProjectUrlParams.filter1);
  const cdn = useSelectedCdn();

  const deleteMutation = useMutation<void, Error, CacheGroupEntity>(
    async (item) => {
      const caches = await CachesProvider.instance.prepareQuery(cdn.id).fetchQuery();
      const cacheFromGroup = caches.find((cache) => cache.group?.id === item.id);
      if (cacheFromGroup) {
        throw new Error(`Failed to delete - Found a cache in the group: ${cacheFromGroup.systemId}`);
      }

      await CdnsApi.instance.deliveryUnitGroupsDelete(cdn.id, item.id);
    },
    {
      onSuccess: () => {
        CacheGroupsProvider.instance.prepareQuery(cdn.id).invalidateWithChildren();
      },
      onError: (e) => Notifier.error("Delete failed: " + e.message, e),
    }
  );

  const openEditor = async (editedItem: CacheGroupRowType | undefined) => {
    await openQwiltModal((closeModalWithResult) => {
      const editedCacheGroup = editedItem instanceof CacheGroupEntity ? editedItem : undefined;
      return (
        <EditorCacheGroupContainer editedEntity={editedCacheGroup} cdn={cdn} onClose={() => closeModalWithResult()} />
      );
    });
  };

  const onDelete = useEventCallback(async (item: CacheGroupRowType) => {
    if (item instanceof CacheGroupEntity) {
      const toDelete = await openConfirmModal(
        `Are you sure want to delete this Cache Group: '${item.name}'?`,
        `Please confirm - ${cdn.name}`
      );

      if (toDelete) {
        // NOTE: Might fail on validations
        deleteMutation.mutate(item);
      }
    }
  });

  const actions = [
    getEditAction<CacheGroupRowType>(openEditor, {
      visiblePredicate: (e) => e instanceof CacheGroupEntity,
    }),
    getDeleteAction<CacheGroupRowType>(onDelete, {
      visiblePredicate: (e) => e instanceof CacheGroupEntity,
    }),
  ];

  const rows = getDugsTreeHierarchy(props.cacheGroups);

  const isTempFlagDispersion = ProjectUrlStore.getInstance().getBooleanParam(
    ProjectUrlParams.tempFlag_cacheGroupDispersion
  );
  const columns: QwiltGridColumnDef<CacheGroupEntity | CacheGroupContainer>[] = [
    {
      headerName: "Type",
      renderer: new GridValueRenderer({
        valueGetter: (e) => (e instanceof CacheGroupEntity ? _.startCase(e.type) : ""),
      }),
    },
    {
      headerName: "Latitude",
      renderer: new GridValueRenderer({
        valueGetter: (e) => (e instanceof CacheGroupEntity ? e.latitude.toString() : ""),
      }),
    },
    {
      headerName: "Longitude",
      renderer: new GridValueRenderer({
        valueGetter: (e) => (e instanceof CacheGroupEntity ? e.longitude.toString() : ""),
      }),
    },
    {
      headerName: "ID",
      renderer: new GridValueRenderer({ valueGetter: (e) => (e instanceof CacheGroupEntity ? e.id : "") }),
      colDefOptions: {
        hide: true,
      },
    },
    isTempFlagDispersion
      ? {
          headerName: "Dispersion",
          renderer: new GridValueRenderer({
            valueGetter: (e) => (e instanceof CacheGroupEntity ? e.dispersion?.toString() ?? "N/A" : ""),
          }),
        }
      : undefined,
    isTempFlagDispersion
      ? {
          headerName: "Dispersion Method",
          renderer: new GridValueRenderer({
            valueGetter: (e) => (e instanceof CacheGroupEntity ? _.startCase(e.dispersionCalculationMethod) : ""),
          }),
        }
      : undefined,
    {
      headerName: "Fallbacks",
      renderer: new GridReactRenderer({
        valueGetter: (entity) =>
          entity instanceof CacheGroupEntity
            ? entity.fallbackCacheGroups.map((fallback) => fallback.name).join(" -> ")
            : "",
        reactRender: ({ entity: item }) => {
          if (item instanceof CacheGroupEntity) {
            return <FallbacksContainer fallbackDeliveryUnitGroups={item.fallbackCacheGroups} onClick={openEditor} />;
          } else {
            return <div />;
          }
        },
      }),
    },
  ].filter(Utils.isTruthy);

  const treeColumn = useMemo<QwiltGridTreeColumnDef<CacheGroupRowType>>(
    () => ({
      headerName: "Name",
      renderer: new GridReactRenderer<CacheGroupRowType>({
        valueGetter: (entity) => entity.name,
        reactRender: ({ entity }) => (
          <Cell>
            {entity instanceof CacheGroupEntity && <CacheGroupIconStyled />}
            {entity.name}
          </Cell>
        ),
      }),
      colDefOptions: {
        width: 350,
        sort: "asc",
        filter: "agTextColumnFilter",
        floatingFilterComponent: "simpleTextFloatingFilter",
        filterParams: {
          init: "Filter",
          filterOptions: ["contains", "notContains"],
          valueGetter: (params: RowNode) => {
            if ((params.parent as RowNode).id === "ROOT_NODE_ID") {
              return null;
            } else {
              return params.data.name;
            }
          },
        },
      },
    }),
    []
  );

  const gridOptions: GridOptions = {
    getRowStyle: (params: { data: CacheGroupRowType }) => {
      if (!(params.data instanceof CacheGroupEntity)) {
        return {
          background: "#b4d4e0",
        };
      }
    },
    floatingFilter: true,
    animateRows: true,
    frameworkComponents: { simpleTextFloatingFilter: SimpleTextFloatingFilter },
    rowHeight: 45,
  };

  return (
    <DeliveryUnitGroupsGridView
      title={"Cache Groups"}
      onAddButton={() => openEditor(undefined)}
      filter={{ onFilter: setFilter, filterValue: filter ?? "" }}
      className={props.className}>
      <QwiltGridStyled<CacheGroupRowType>
        actions={actions}
        rows={rows}
        columns={columns}
        treeData={{
          treeColumn,
          getChildItems: (dug) => (dug instanceof CacheGroupEntity ? dug.childrenCacheGroups : dug.children || []),
        }}
        filter={filter}
        gridOptions={gridOptions}
      />
    </DeliveryUnitGroupsGridView>
  );
};

function getDugsTreeHierarchy(dugList: CacheGroupEntity[]): CacheGroupContainer[] {
  return Object.values(
    _.chain(dugList)
      .filter((dug) => !dug.parentCacheGroup) // avoid showing children groups that would show up anyway
      .groupBy((dug) => dug.network?.name ?? "Network N/A")
      .map((dugs, networkName) => ({
        name: networkName,
        children: Object.values(
          _.chain(dugs)
            .groupBy((dug) => (dug.type === "edge" ? "Non-Tiered Cache Groups" : "Tiered Cache Groups"))
            .map((dugs, tierTitle) => ({ name: tierTitle, children: dugs }))
            .value()
        ),
      }))
      .value()
  );
}
