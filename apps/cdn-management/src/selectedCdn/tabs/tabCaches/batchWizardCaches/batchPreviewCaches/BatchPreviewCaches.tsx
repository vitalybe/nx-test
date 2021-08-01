import * as React from "react";
import { useMemo } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { CachesGridEntity } from "src/selectedCdn/tabs/tabCaches/_domain/cachesGridEntity";
import { CommonColors } from "common/styling/commonColors";
import { lighten } from "polished";
import { HierarchyUtils, SelectionModeEnum } from "common/utils/hierarchyUtils";
import { GridReadyEvent } from "ag-grid-community";
import { useEventCallback } from "common/utils/hooks/useEventCallback";
import {
  GridReactRenderer,
  QwiltGrid,
  QwiltGridColumnDef,
  QwiltGridTreeColumnDef,
} from "common/components/qwiltGrid/QwiltGrid";
import _ from "lodash";
import { Tooltip } from "common/components/Tooltip";
import { InterfacesContainer } from "src/selectedCdn/tabs/tabCaches/cachesGrid/interfacesContainer/InterfacesContainer";
import { Colors } from "src/_styling/colors";
import { CachesGridEntityTypeIcon } from "src/selectedCdn/tabs/tabCaches/_parts/CachesGridEntityTypeIcon";
import { CacheEntity } from "src/_domain/cacheEntity";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const BatchPreviewView = styled.div`
  flex: 1 1 auto;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

const SelectedEntitiesTitle = styled.div`
  margin-bottom: 1em;
`;

const BottomButton = styled.div`
  display: flex;
  margin-top: 1em;
  justify-content: flex-end;
`;

const Button = styled.button`
  width: 100px;
  padding: 0.5em 0;
  margin-left: 1em;
  border-radius: 5px;
  background: ${CommonColors.MATISSE};
  border: 0;
  color: ${CommonColors.MYSTIC_2};
  outline: 0;
  cursor: pointer;

  &:hover {
    background: ${lighten(0.1, CommonColors.MATISSE)};
  }

  &:active {
    background: ${lighten(0.2, CommonColors.MATISSE)};
  }

  &:disabled {
    background-color: ${CommonColors.SILVER_SAND};
    cursor: initial;
  }
`;

const CachesGridEntityTypeIconStyled = styled(CachesGridEntityTypeIcon)`
  margin-right: 0.5rem;
  flex: 0 0 auto;
`;

const Cell = styled.div<{ selected?: boolean }>`
  color: ${(props) => (props.selected ? "black" : Colors.ALTO)};
  display: flex;
  align-items: center;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  selectedEntities: CachesGridEntity[];
  caches: CacheEntity[];
  onCancel: () => void;
  onNext: () => void;
  className?: string;
}

//endregion [[ Props ]]
export const BatchPreviewCaches = (props: Props) => {
  const rows = useMemo(() => props.selectedEntities.map((entity) => HierarchyUtils.getRootParent(entity)), [
    props.selectedEntities,
  ]);

  const onGridReady = useEventCallback(({ api }: GridReadyEvent) => {
    api.forEachNode((rowNode) => {
      const entity = rowNode.data as CachesGridEntity;
      const expandState = HierarchyUtils.someEntities(
        entity?.children ?? [],
        (entity) => entity.isCache && entity.selection === SelectionModeEnum.SELECTED
      );
      rowNode.setExpanded(expandState);
    });
    api.refreshCells();
  });

  const treeColumn = useMemo<QwiltGridTreeColumnDef<CachesGridEntity>>(
    () => ({
      headerName: "Name",
      renderer: new GridReactRenderer<CachesGridEntity>({
        valueGetter: (entity) => entity.name,
        reactRender: ({ entity, value }) => {
          const hasMonitorSegment = !!entity.cache?.monitoringSegmentId;
          return (
            <Cell selected={entity.selection === SelectionModeEnum.SELECTED}>
              <CachesGridEntityTypeIconStyled entity={entity} />
              {`${value} `}
              {entity.isCache ? !hasMonitorSegment && "⚠️" : ""}
            </Cell>
          );
        },
      }),
      colDefOptions: {
        width: 300,
        sort: "asc",
      },
    }),
    []
  );

  const columns = useMemo<QwiltGridColumnDef<CachesGridEntity>[]>(() => {
    return [
      {
        headerName: "System ID",
        renderer: getCommonCellRenderer((entity) => entity.cache?.systemId ?? ""),
      },
      {
        headerName: "Operational Mode",
        renderer: getCommonCellRenderer(
          (entity) => _.upperFirst(entity.cache?.operationalMode?.replace("-", " ")) ?? ""
        ),
      },
      {
        headerName: "Monitor Segment",
        renderer: getCommonCellRenderer((entity) => entity.cache?.monitoringSegmentId ?? "---"),
      },
      {
        headerName: "Interfaces",
        renderer: getInterfacesCellRenderer(),
        colDefOptions: {
          width: 100,
        },
      },
    ];
  }, []);

  const selectedCachesCount = props.caches.length;

  return (
    <BatchPreviewView className={props.className}>
      <SelectedEntitiesTitle>
        The following items will be updated:{" "}
        <b>
          {selectedCachesCount} Cache{selectedCachesCount === 1 ? "" : "s"}
        </b>
      </SelectedEntitiesTitle>
      <QwiltGrid<CachesGridEntity>
        gridOptions={{
          onGridReady,
        }}
        rows={rows}
        columns={columns}
        treeData={{
          treeColumn: treeColumn,
          getChildItems: (entity) => entity.children ?? [],
        }}
      />
      <BottomButton>
        <Button onClick={props.onCancel}>Cancel</Button>
        <Button onClick={props.onNext}>Next {">"}</Button>
      </BottomButton>
    </BatchPreviewView>
  );

  function getCommonCellRenderer(
    valueGetter: (entity: CachesGridEntity) => string
  ): GridReactRenderer<CachesGridEntity> {
    return new GridReactRenderer<CachesGridEntity>({
      valueGetter: valueGetter,
      reactRender: ({ entity }) => (
        <Cell selected={entity.isCacheSelected}>{entity.isCache ? valueGetter(entity) : ""}</Cell>
      ),
    });
  }

  function getInterfacesCellRenderer(): GridReactRenderer<CachesGridEntity> {
    return new GridReactRenderer<CachesGridEntity>({
      valueGetter: (entity) => entity.cache?.interfaces.length.toString() ?? "",
      reactRender: ({ entity }) => {
        const interfacesCount = entity.cache?.interfaces.length;
        return (
          <Tooltip
            content={<InterfacesContainer cache={entity.cache} />}
            disabled={!entity.isCache || interfacesCount === 0}
            placement={"left"}
            arrow={false}
            delay={[300, 1000]}>
            <Cell selected={entity.isCacheSelected}>{interfacesCount ?? ""}</Cell>
          </Tooltip>
        );
      },
    });
  }
};
