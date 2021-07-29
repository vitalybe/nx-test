import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { CachesGridEntity } from "src/selectedCdn/tabs/tabCaches/_domain/cachesGridEntity";
import { ItemsCard } from "common/components/configuration/itemsCard/ItemsCard";
import { CommonColors } from "common/styling/commonColors";
import { lighten } from "polished";
import { openConfirmModal, openQwiltModal } from "common/components/qwiltModal/QwiltModal";
import { Icons } from "common/styling/icons";
import { TextTooltip } from "common/components/textTooltip/TextTooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HierarchyUtils, SelectionModeEnum } from "common/utils/hierarchyUtils";
import { ColumnApi, GridApi, GridReadyEvent } from "ag-grid-community";
import { useEventCallback } from "common/utils/hooks/useEventCallback";
import {
  ActionData,
  getDeleteAction,
  getEditAction,
  GridReactRenderer,
  QwiltGrid,
  QwiltGridColumnDef,
  QwiltGridTreeColumnDef,
} from "common/components/qwiltGrid/QwiltGrid";
import { Checkbox } from "common/components/checkbox/Checkbox";
import { ConfigurationStyles } from "common/components/configuration/_styles/configurationStyles";
import _ from "lodash";
import { FilterWarnToast } from "src/selectedCdn/tabs/tabDsAssignment/cardDsAssignment/filterWarn/FilterWarn";
import { toast } from "react-toastify";
import { CdnsApi } from "common/backend/cdns";
import { Notifier } from "common/utils/notifications/notifier";
import { Tooltip } from "common/components/Tooltip";
import { InterfacesContainer } from "src/selectedCdn/tabs/tabCaches/cachesGrid/interfacesContainer/InterfacesContainer";
import { BatchWizardCaches } from "src/selectedCdn/tabs/tabCaches/batchWizardCaches/BatchWizardCaches";
import { CachesGridEntityTypeIcon } from "src/selectedCdn/tabs/tabCaches/_parts/CachesGridEntityTypeIcon";
import { useMutation } from "react-query";
import { CachesProvider } from "src/_providers/cachesProvider";
import { CacheEntity } from "src/_domain/cacheEntity";
import { SelectedCdnContextProvider, useSelectedCdn } from "src/_stores/selectedCdnStore";
import { CdnEntity } from "src/_domain/cdnEntity";
import { EditorCacheContainer } from "src/selectedCdn/tabs/tabCaches/editorCache/EditorCacheContainer";
import { CacheGroupEntity } from "src/_domain/cacheGroupEntity";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const CachesGridView = styled.div`
  min-height: 0;
  display: flex;
  flex: 1 1 auto;
`;

const CachesGridCard = styled(ItemsCard)`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  padding: 0;
  .ag-theme-qwilt-configuration {
    .ag-row-hover {
      background-color: rgba(219, 243, 255, 1);
    }
    .ag-row-selected {
      background-color: rgba(117, 216, 255, 0.8);
    }
  }
`;

const TopBar = styled.div`
  display: flex;
  margin-bottom: 5px;
`;

const RightButtonsContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

const BatchButtonContainer = styled.div``;

const BatchButton = styled.button`
  width: 100px;
  padding: 0.5em 0;
  margin-left: 1em;
  border-radius: 5px;
  background: ${CommonColors.MATISSE};
  border: 0;
  color: ${CommonColors.MYSTIC_2};
  outline: 0;
  cursor: pointer;
  font-size: 14px;

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

const Icon = styled(FontAwesomeIcon)`
  margin-right: 0.5em;
`;
const CachesGridEntityTypeIconStyled = styled(CachesGridEntityTypeIcon)<{ opacity: number }>`
  margin-right: 0.5rem;
  flex: 0 0 auto;
  opacity: ${({ opacity }) => opacity};
`;

const Cell = styled.div<{ isDisabled?: boolean; selected?: boolean }>`
  color: ${(props) =>
    props.isDisabled ? (props.selected ? "#818586" : ConfigurationStyles.COLOR_SILVER_SAND) : "black"};
  display: flex;
  align-items: center;
`;

const RowSelectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RowSelectionCell = styled.div`
  display: flex;
  padding-top: 5px;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const CheckboxStyled = styled(Checkbox)`
  margin-right: 0.5em;
`;

const RowSelectionCount = styled.div`
  font-size: 12px;
`;
//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  entities: CachesGridEntity[];
  cacheGroups: CacheGroupEntity[];

  className?: string;
}

//endregion [[ Props ]]

const HEADER_HEIGHT = 43;

export const CachesGrid = (props: Props) => {
  const gridApiRef = useRef<GridApi | undefined>();
  const columnApiRef = useRef<ColumnApi | undefined>();
  const cdn = useSelectedCdn();
  const deleteMutation = useMutation<void, Error, CacheEntity>(
    async (cache) => {
      await CdnsApi.instance.deliveryUnitsDelete(cdn.id, cache.id);
    },
    {
      onSuccess: () => {
        CachesProvider.instance.prepareQuery(cdn.id).invalidateWithChildren();
      },
      onError: (e) => Notifier.error("Delete failed: " + e.message, e),
    }
  );

  const rows = useMemo(() => props.entities, [props.entities]);

  const [filter, setFilter] = useState<string>("");
  const [appliedFilter, setAppliedFilter] = useState("");
  const [isShownFilterWarn, setIsShownFilterWarn] = useState<boolean>(false);
  const [selectedEntities, setSelectedEntities] = useState<CachesGridEntity[]>([]);

  const hasSomeSelected = selectedEntities.length > 0;

  const onGridReady = useEventCallback(({ api, columnApi }: GridReadyEvent) => {
    gridApiRef.current = api;
    columnApiRef.current = columnApi;
  });

  const refreshGrid = () => {
    if (gridApiRef.current) {
      gridApiRef.current.forEachNode((node) => {
        const entity = node.data as CachesGridEntity;
        node.setSelected(entity.isCacheSelected);
      });

      gridApiRef.current.refreshCells();
      gridApiRef.current.refreshHeader();
    }
  };

  const rowSelectionHeaderClick = useCallback(
    (selectionMode: SelectionModeEnum) => {
      const newSelectionMode = selectionMode !== SelectionModeEnum.SELECTED;
      const data = gridApiRef.current ? getGridApiData(gridApiRef.current) : rows;
      data.forEach((rootRow) => HierarchyUtils.toggleSelectionMutate(data, rootRow.id, newSelectionMode));

      setSelectedEntities(getHasSomeSelected(rows));

      refreshGrid();
    },
    [rows]
  );

  const onCellSelected = useCallback(
    (entity: CachesGridEntity, selectionMode: SelectionModeEnum) => {
      const newSelectionMode = selectionMode !== SelectionModeEnum.SELECTED;
      HierarchyUtils.toggleSelectionMutate([HierarchyUtils.getRootParent(entity)], entity.id, newSelectionMode);

      setSelectedEntities(getHasSomeSelected(rows));

      refreshGrid();
    },
    [rows]
  );

  const onFilter = (filter: string) => {
    setFilter(filter);
  };

  async function editCache(cache: CacheEntity, isViewMode: boolean = false) {
    await openQwiltModal((closeModalWithResult) => (
      <SelectedCdnContextProvider value={cdn}>
        <EditorCacheContainer cache={cache} onClose={() => closeModalWithResult()} isEdit={true} isView={isViewMode} />
      </SelectedCdnContextProvider>
    ));
  }

  async function deleteCache(cdn: CdnEntity, cacheInGrid: CachesGridEntity) {
    const toDelete = await openConfirmModal(
      `Are you sure you want to delete "${cacheInGrid.name}" ?`,
      `Please confirm - ${cdn.name}`
    );
    const cache = cacheInGrid.cache;
    if (toDelete && cache) {
      try {
        if (cache.group) {
          deleteMutation.mutate(cache);
        }
      } catch (e) {
        Notifier.warn("Operation failed", e);
      }
    }
  }

  const treeColumn = useMemo<QwiltGridTreeColumnDef<CachesGridEntity>>(
    () => ({
      headerName: "Name",
      renderer: new GridReactRenderer<CachesGridEntity>({
        valueGetter: ({ name }) => name,
        reactRender: ({ entity, value }) => {
          let childrenDetails = "";
          const hasMonitorSegment = !!entity.cache?.monitoringSegmentId;
          const totalChildren = entity.children?.length;
          if (totalChildren !== undefined) {
            const onlineChildren = HierarchyUtils.getLeafEntities([entity], (entity) => entity.isOnline).length;
            childrenDetails = `(${onlineChildren}/${totalChildren})`;
          }
          return (
            <Cell
              isDisabled={entity.isCache && !entity.isOnline}
              selected={entity.selection === SelectionModeEnum.SELECTED}>
              <CachesGridEntityTypeIconStyled entity={entity} opacity={entity.isCache && !entity.isOnline ? 0.5 : 1} />
              {`${value} `}
              {entity.isCache ? !hasMonitorSegment && "⚠️" : ""} {childrenDetails}
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
      {
        headerName: "Row Selection",
        headerRenderer: () => {
          const { selectionCount, selectionMode } = inferHierarchySelectionMode(
            gridApiRef.current ? getGridApiData(gridApiRef.current) : rows
          );

          return (
            <RowSelectionHeader>
              <CheckboxStyled
                isPartialCheck={selectionMode === SelectionModeEnum.PARTIAL}
                isChecked={selectionMode === SelectionModeEnum.SELECTED}
                onClick={() => rowSelectionHeaderClick(selectionMode)}
                borderColor={CommonColors.HALF_BAKED}
                checkColor={CommonColors.NAVY_8}
              />
              <RowSelectionCount>{selectionCount} selected</RowSelectionCount>
            </RowSelectionHeader>
          );
        },
        renderer: getRowSelectionCellRenderer(onCellSelected),
        colDefOptions: {
          maxWidth: 70,
          pinned: true,
        },
      },
    ];
  }, [onCellSelected, rowSelectionHeaderClick, rows]);

  useEffect(() => {
    if (filter && hasSomeSelected && filter !== appliedFilter) {
      if (!isShownFilterWarn) {
        setIsShownFilterWarn(true);
        FilterWarnToast({
          onOk: () => {
            setAppliedFilter(filter);
            dismissToast();
            rowSelectionHeaderClick(SelectionModeEnum.SELECTED);
          },
          onCancel: () => {
            dismissToast();
            setFilter(appliedFilter);
          },
        });
      }
    } else {
      setAppliedFilter(filter);
    }
  }, [appliedFilter, filter, hasSomeSelected, isShownFilterWarn, rowSelectionHeaderClick]);

  const dismissToast = () => {
    setIsShownFilterWarn(false);
    toast.dismiss();
  };

  const allowBatchOperation = rows.length > 0 && hasSomeSelected;

  const actions: ActionData<CachesGridEntity>[] = [
    {
      icon: Icons.VIEW,
      visiblePredicate: (entity) => entity.isCache,
      label: "View",
      callback: (entity) => (entity.cache ? editCache(entity.cache, true) : undefined),
    },
    getEditAction((entity) => (entity.cache ? editCache(entity.cache) : undefined), {
      visiblePredicate: (entity) => entity.isCache,
    }),
    getDeleteAction((entity) => deleteCache(cdn, entity), { visiblePredicate: (entity) => entity.isCache }),
  ];

  return (
    <CachesGridView className={props.className}>
      <CachesGridCard
        title={"Caches"}
        filter={{
          onFilter,
          filterValue: filter,
        }}>
        <TopBar>
          <RightButtonsContainer>
            <BatchButtonContainer>
              <TextTooltip
                content={"No entities selected"}
                disabled={allowBatchOperation}
                placement={"left"}
                distance={1}>
                <BatchButtonContainer>
                  <BatchButton
                    onClick={() => {
                      return openQwiltModal((closeModalWithResult) => (
                        <BatchWizardCaches
                          selectedEntities={selectedEntities}
                          cacheGroups={props.cacheGroups}
                          cdnId={cdn.id ?? ""}
                          onDone={() => {
                            closeModalWithResult();
                          }}
                          onCancel={() => closeModalWithResult()}
                        />
                      ));
                    }}
                    disabled={!allowBatchOperation}>
                    <Icon icon={Icons.BATCH} />
                    Batch Edit
                  </BatchButton>
                </BatchButtonContainer>
              </TextTooltip>
            </BatchButtonContainer>
          </RightButtonsContainer>
        </TopBar>
        <QwiltGrid<CachesGridEntity>
          gridOptions={{
            animateRows: true,
            headerHeight: HEADER_HEIGHT,
            onGridReady,
            rowSelection: "multiple",
            suppressRowClickSelection: true,
          }}
          filter={appliedFilter}
          rows={rows}
          treeData={{
            treeColumn: treeColumn,
            getChildItems: (entity) => entity.children ?? [],
          }}
          columns={columns}
          actions={actions}
        />
      </CachesGridCard>
    </CachesGridView>
  );
};

//region [[Utils]]
function inferHierarchySelectionMode(
  entities: CachesGridEntity[],
  selectableCount = HierarchyUtils.countLeafEntities(entities)
): {
  selectionCount: number;
  selectionMode: SelectionModeEnum;
  selectedEntities: CachesGridEntity[];
} {
  let selectionCount = 0;
  let selectionMode: SelectionModeEnum = SelectionModeEnum.NOT_SELECTED;
  let selectedEntities: CachesGridEntity[] = [];

  if (entities.length > 0) {
    selectedEntities = HierarchyUtils.getLeafEntities(entities, (entity) => entity.isCacheSelected);

    selectionCount = selectedEntities.length;

    if (selectionCount === selectableCount) {
      selectionMode = SelectionModeEnum.SELECTED;
    } else if (selectionCount > 0) {
      selectionMode = SelectionModeEnum.PARTIAL;
    }
  }

  return { selectionCount, selectionMode, selectedEntities };
}

function getGridApiData(gridApi: GridApi): CachesGridEntity[] {
  return gridApi
    .getRenderedNodes()
    .filter((node) => node.level === 0)
    .flatMap((node) => node.data as CachesGridEntity);
}

function getHasSomeSelected(entities: CachesGridEntity[]): CachesGridEntity[] {
  return HierarchyUtils.getLeafEntities(entities, (entity) => {
    return entity.isCacheSelected;
  });
}

function getCommonCellRenderer(valueGetter: (entity: CachesGridEntity) => string): GridReactRenderer<CachesGridEntity> {
  return new GridReactRenderer<CachesGridEntity>({
    valueGetter: valueGetter,
    reactRender: ({ entity }) => (
      <Cell isDisabled={entity.isCache && !entity.isOnline} selected={entity.selection === SelectionModeEnum.SELECTED}>
        {entity.isCache ? valueGetter(entity) : ""}
      </Cell>
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
          <Cell
            isDisabled={entity.isCache && !entity.isOnline}
            selected={entity.selection === SelectionModeEnum.SELECTED}>
            {interfacesCount ?? ""}
          </Cell>
        </Tooltip>
      );
    },
  });
}

function getRowSelectionCellRenderer(
  onCellSelected: (entity: CachesGridEntity, selectionMode: SelectionModeEnum) => void
) {
  return new GridReactRenderer<CachesGridEntity>({
    valueGetter: (entity) => entity.selection,
    reactRender: ({ entity }) => {
      return (
        <RowSelectionCell>
          <CheckboxStyled
            isPartialCheck={entity.selection === SelectionModeEnum.PARTIAL}
            isChecked={entity.selection === SelectionModeEnum.SELECTED}
            onClick={() => onCellSelected(entity, entity.selection)}
            borderColor={CommonColors.HALF_BAKED}
            checkColor={CommonColors.NAVY_8}
          />
        </RowSelectionCell>
      );
    },
  });
}
//endregion
