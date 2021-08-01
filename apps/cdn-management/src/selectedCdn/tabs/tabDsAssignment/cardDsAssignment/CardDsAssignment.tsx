import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { ItemsCard } from "@qwilt/common/components/configuration/itemsCard/ItemsCard";
import { observer } from "mobx-react-lite";
import {
  getEditAction,
  GridReactRenderer,
  QwiltGrid,
  QwiltGridColumnDef,
  QwiltGridTreeColumnDef,
} from "@qwilt/common/components/qwiltGrid/QwiltGrid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DsRuleEntity } from "../_domain/dsRuleEntity";
import { openQwiltModal } from "@qwilt/common/components/qwiltModal/QwiltModal";
import { EditorDsAssignment } from "../editorDsAssignment/EditorDsAssignment";
import { Colors } from "../../../../_styling/colors";
import { HierarchyUtils, SelectionModeEnum } from "@qwilt/common/utils/hierarchyUtils";
import { CommonColors } from "@qwilt/common/styling/commonColors";
import { Checkbox } from "@qwilt/common/components/checkbox/Checkbox";
import { Tooltip } from "@qwilt/common/components/Tooltip";
import { ColumnApi, GridApi, GridReadyEvent } from "ag-grid-community";
import { useEventCallback } from "@qwilt/common/utils/hooks/useEventCallback";
import { lighten } from "polished";
import { Icons } from "@qwilt/common/styling/icons";
import { TextTooltip } from "@qwilt/common/components/textTooltip/TextTooltip";
import { BatchWizard } from "../batchWizard/BatchWizard";
import { toast } from "react-toastify";
import { FilterWarnToast } from "./filterWarn/FilterWarn";
import { QwiltToggle } from "@qwilt/common/components/configuration/qwiltForm/qwiltToggle/QwiltToggle";
import _ from "lodash";
import { DsRuleEntityTypeIcon } from "../DsRuleEntityTypeIcon";
import { DeliveryServiceEntity } from "../../../../_domain/deliveryServiceEntity";
import { ErrorWithTooltip } from "../_parts/errorWithTooltip/ErrorWithTooltip";
import { MissingAgreemenentError } from "../_parts/missingAgreemenentError/MissingAgreemenentError";
import { SelectedCdnContextProvider, useSelectedCdn } from "../../../../_stores/selectedCdnStore";
import { CdnEntity } from "../../../../_domain/cdnEntity";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const CardDsAssignmentView = styled.div`
  min-height: 0;
  display: flex;
  height: 100%;
  width: 100%;
`;

const DsAssignmentsGridCard = styled(ItemsCard)`
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

const LeftButtonsContainer = styled.div`
  flex: 1;
  display: flex;
  font-size: 14px;
  align-items: center;
`;

const OverrideToggleContainer = styled.div`
  display: flex;
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

const EditorDsAssignmentStyled = styled(EditorDsAssignment)`
  width: 650px;
`;

const Cell = styled.div<{ inherited?: boolean; boldContent?: boolean; highlightWarning?: boolean; selected?: boolean }>`
  color: ${(props) =>
    props.inherited ? (props.selected ? "white" : Colors.ALTO) : props.highlightWarning ? "red" : "black"};
  font-style: ${(props) => (props.inherited ? "italic" : "normal")};
  font-weight: ${(props) => (props.boldContent || props.highlightWarning ? "bold" : "normal")};
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

const MultiSelectionTooltip = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: right;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  background-color: white;
  padding: 8px;
  text-align: left;
`;

const Title = styled.span`
  margin-top: 15px;
`;

const MultiSelectionQn = styled.div`
  display: flex;
  margin-top: 5px;
`;

const CheckboxStyled = styled(Checkbox)`
  margin-right: 0.5em;
`;

const RowSelectionCount = styled.div`
  font-size: 12px;
`;

const Icon = styled(FontAwesomeIcon)`
  margin-right: 0.5em;
`;
const DsRuleEntityTypeIconStyled = styled(DsRuleEntityTypeIcon)`
  margin-right: 0.5rem;
  flex: 0 0 auto;
`;

const TooltipContainer = styled.div`
  padding: 0.5rem;
`;

const ErrorWithTooltipStyled = styled(ErrorWithTooltip)`
  margin-left: 0.5rem;
`;

//endregion [[ Styles ]]

export interface Props {
  dsName: string;
  deliveryService: DeliveryServiceEntity;
  rules: DsRuleEntity[];
  className?: string;
}

const HEADER_HEIGHT = 43;

export const CardDsAssignment = observer(({ deliveryService, ...props }: Props) => {
  const gridApiRef = useRef<GridApi | undefined>();
  const columnApiRef = useRef<ColumnApi | undefined>();
  const cdn = useSelectedCdn();

  const [isFilterByOverrides, setIsFilterByOverrides] = useState<boolean>(false);
  const rows = useMemo(() => getRows(_.cloneDeep(props.rules), isFilterByOverrides), [
    props.rules,
    isFilterByOverrides,
  ]);

  const [filter, setFilter] = useState("");
  const [appliedFilter, setAppliedFilter] = useState("");
  const [hasSomeSelected, setHasSomeSelected] = useState<boolean>(inferHierarchySelectionMode(rows).selectionCount > 0);
  const [isShownFilterWarn, setIsShownFilterWarn] = useState<boolean>(false);

  const onGridReady = useEventCallback(({ api, columnApi }: GridReadyEvent) => {
    gridApiRef.current = api;
    columnApiRef.current = columnApi;
  });

  const refreshGrid = () => {
    if (gridApiRef.current) {
      gridApiRef.current.forEachNode((node) => {
        const entity = node.data as DsRuleEntity;
        node.setSelected(entity.isSelected);
      });
      gridApiRef.current.refreshCells();
      gridApiRef.current.refreshHeader();
    }
  };

  const rowSelectionHeaderClick = useCallback(
    (selectionMode: SelectionModeEnum) => {
      const newSelectionMode = selectionMode !== SelectionModeEnum.SELECTED;
      const data = gridApiRef.current ? getGridApiData(gridApiRef.current) : rows;
      data.forEach((rootRow) => {
        HierarchyUtils.toggleSelectionMutate(data, rootRow.id, newSelectionMode);
        rootRow.selfSelection = newSelectionMode ? SelectionModeEnum.SELECTED : SelectionModeEnum.NOT_SELECTED;
      });

      setHasSomeSelected(newSelectionMode);

      refreshGrid();
    },
    [rows]
  );

  const onCellSelected = useCallback(
    (entity: DsRuleEntity) => {
      if (entity.ruleType === "network") {
        entity.selfSelection =
          entity.selfSelection === SelectionModeEnum.SELECTED
            ? SelectionModeEnum.NOT_SELECTED
            : SelectionModeEnum.SELECTED;
        entity.selection = inferHierarchySelectionMode([entity]).selectionMode;
      } else {
        entity.selection =
          entity.selection === SelectionModeEnum.SELECTED ? SelectionModeEnum.NOT_SELECTED : SelectionModeEnum.SELECTED;
        const rootParent = HierarchyUtils.getRootParent(entity);
        rootParent.selection = inferHierarchySelectionMode([rootParent]).selectionMode;
      }

      setHasSomeSelected(getHasSomeSelected(rows));

      refreshGrid();
    },
    [rows]
  );

  const onMultiCellsSelected = useCallback(
    (entity: DsRuleEntity, selectionMode: SelectionModeEnum) => {
      const newSelectionMode = selectionMode !== SelectionModeEnum.SELECTED;
      HierarchyUtils.toggleSelectionMutate([entity], entity.id, newSelectionMode);
      entity.selfSelection = newSelectionMode ? SelectionModeEnum.SELECTED : SelectionModeEnum.NOT_SELECTED;

      setHasSomeSelected(getHasSomeSelected(rows));

      refreshGrid();
    },
    [rows]
  );

  const columns = useMemo<QwiltGridColumnDef<DsRuleEntity>[]>(() => {
    const rowSelectionColumn: QwiltGridColumnDef<DsRuleEntity> = {
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
      renderer: getRowSelectionCellRenderer(onCellSelected, onMultiCellsSelected),
      colDefOptions: {
        maxWidth: 70,
        pinned: true,
      },
    };

    const commonColumns = [
      {
        headerName: "System ID",
        renderer: getSystemIdColumnCellRenderer(),
      },
      {
        headerName: "Assignment",
        renderer: getAssignmentColumnCellRenderer(),
      },
      {
        headerName: "Routing",
        renderer: getRoutingColumnCellRenderer(),
      },
    ];

    return [...commonColumns, rowSelectionColumn];
  }, [onCellSelected, onMultiCellsSelected, rowSelectionHeaderClick, rows]);

  const treeColumn = useMemo<QwiltGridTreeColumnDef<DsRuleEntity>>(
    () => ({
      headerName: "Name",
      renderer: new GridReactRenderer<DsRuleEntity>({
        valueGetter: (entity) => entity.name,
        reactRender: ({ entity, value }) => {
          const isRuleValid = entity.isValid ?? true;

          return (
            <Cell highlightWarning={!isRuleValid}>
              <DsRuleEntityTypeIconStyled type={entity.ruleType} /> {`${value} `}{" "}
              {!isRuleValid && `${entity.invalidAlert}`}
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

  const onFilter = (filter: string) => {
    setFilter(filter);
  };

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

  return (
    <CardDsAssignmentView>
      <DsAssignmentsGridCard
        title={"Assignments - " + props.dsName}
        filter={{
          onFilter,
          filterValue: filter,
        }}>
        <TopBar>
          <LeftButtonsContainer>
            <OverrideToggleContainer>
              <QwiltToggle
                label={"Filter by overrides"}
                checked={isFilterByOverrides}
                onChange={() => {
                  if (hasSomeSelected) {
                    FilterWarnToast({
                      onOk: () => {
                        setIsFilterByOverrides((currentValue) => !currentValue);
                        rowSelectionHeaderClick(SelectionModeEnum.SELECTED);
                        dismissToast();
                      },
                      onCancel: () => {
                        dismissToast();
                      },
                    });
                  } else {
                    setIsFilterByOverrides((currentValue) => !currentValue);
                  }
                }}
              />
            </OverrideToggleContainer>
          </LeftButtonsContainer>
          <RightButtonsContainer>
            <TextTooltip
              content={"No assignments selected"}
              disabled={allowBatchOperation}
              placement={"left"}
              distance={1}>
              <BatchButtonContainer>
                <BatchButton
                  onClick={() =>
                    openQwiltModal((closeModalWithResult) => (
                      <SelectedCdnContextProvider value={cdn}>
                        <BatchWizard
                          deliveryService={deliveryService}
                          rules={rows}
                          onClose={() => {
                            closeModalWithResult();
                          }}
                        />
                      </SelectedCdnContextProvider>
                    ))
                  }
                  disabled={!allowBatchOperation}>
                  <Icon icon={Icons.BATCH} />
                  Batch Edit
                </BatchButton>
              </BatchButtonContainer>
            </TextTooltip>
          </RightButtonsContainer>
        </TopBar>
        <QwiltGrid<DsRuleEntity>
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
          actions={[
            getEditAction((entity) => editAssignment(entity, deliveryService, cdn), {
              visiblePredicate: (entity) => entity.isNotCacheGroup,
              enabledPredicate: (entity) => !entity.isInCacheGroupMid,
              disabledTooltip: "Can't edit assignments of caches in Mid group",
            }),
          ]}
        />
      </DsAssignmentsGridCard>
    </CardDsAssignmentView>
  );
});

//region [[ Functions ]]

async function editAssignment(dsRuleEntity: DsRuleEntity, deliveryService: DeliveryServiceEntity, cdn: CdnEntity) {
  await openQwiltModal((closeModalWithResult) => (
    <SelectedCdnContextProvider value={cdn}>
      <EditorDsAssignmentStyled
        deliveryService={deliveryService}
        dsRuleEntity={dsRuleEntity}
        onClose={() => closeModalWithResult()}
      />
    </SelectedCdnContextProvider>
  ));
}

function GridTooltip(props: { content: React.ReactElement<unknown>; children: React.ReactElement<unknown> }) {
  return (
    <Tooltip content={<TooltipContainer>{props.content}</TooltipContainer>} delay={1000} placement={"left"}>
      {props.children}
    </Tooltip>
  );
}

function getSystemIdColumnCellRenderer(): GridReactRenderer<DsRuleEntity> {
  return new GridReactRenderer<DsRuleEntity>({
    valueGetter: (entity) => entity.systemId ?? "",
    reactRender: (props) => {
      return <Cell>{props.entity.systemId ?? ""}</Cell>;
    },
  });
}

function getAssignmentColumnCellRenderer(): GridReactRenderer<DsRuleEntity> {
  return new GridReactRenderer<DsRuleEntity>({
    valueGetter: (entity) => getAssignmentValue(entity),
    reactRender: ({ entity, value }) => {
      if (entity) {
        const { assignmentRule, parent } = entity;
        const { assignmentBlocked, assignment } = assignmentRule;

        const isInherited = !assignment && parent !== undefined;

        return (
          <GridTooltip
            content={
              <>
                <b>Rule ID:</b> {entity.assignmentRule.ruleId || "N/A"}
              </>
            }>
            <Cell boldContent highlightWarning={assignmentBlocked} inherited={isInherited} selected={entity.isSelected}>
              {value}
              <ErrorWithTooltipStyled
                errorsContent={
                  entity.missingAgreementLink
                    ? [
                        <MissingAgreemenentError
                          key={`${entity.missingAgreementLink.networkId}_${entity.missingAgreementLink.dsMetadataId}_${entity.id}`}
                          missingAgreementLink={entity.missingAgreementLink}
                        />,
                      ]
                    : []
                }
              />
            </Cell>
          </GridTooltip>
        );
      } else {
        return <Cell />;
      }
    },
  });
}

function getRoutingColumnCellRenderer() {
  return new GridReactRenderer<DsRuleEntity>({
    valueGetter: (entity) => (entity.routingRule.routingEnabled ? "Enabled" : "Disabled"),
    reactRender: (props) => {
      const parentData: DsRuleEntity = props.cellRendererProps.node?.parent?.data;
      const data: DsRuleEntity = props.entity || parentData;
      if (data) {
        const { routingRule } = data;
        const { routingEnabled } = routingRule;
        const isRoutingRuleExist = !!props.entity.routingRule.ruleId;
        return (
          <GridTooltip
            content={
              <>
                <b>Rule ID:</b> {props.entity.routingRule.ruleId || "N/A"}
              </>
            }>
            <Cell
              highlightWarning={isRoutingRuleExist && !routingEnabled}
              inherited={!isRoutingRuleExist}
              selected={props.entity.isSelected}>
              {props.value}
            </Cell>
          </GridTooltip>
        );
      } else {
        return <Cell />;
      }
    },
  });
}

function getRowSelectionCellRenderer(
  onCellSelected: (entity: DsRuleEntity) => void,
  onMultiCellsSelected: (entity: DsRuleEntity, selectionMode: SelectionModeEnum) => void
) {
  return new GridReactRenderer<DsRuleEntity>({
    valueGetter: (entity) => entity.selectionMode + entity.selection,
    reactRender: ({ entity }) => {
      if (entity.isNotCacheGroup) {
        const { selectionMode } = inferHierarchySelectionMode([entity]);

        const isNetwork = entity.ruleType === "network";

        return (
          <RowSelectionCell>
            <Tooltip
              content={
                <MultiSelectionTooltip>
                  <span>
                    Only <b>{entity.name}</b> entities will be selected.
                  </span>
                  <Title>Selected child entities:</Title>
                  <MultiSelectionQn>
                    <CheckboxStyled
                      isPartialCheck={entity.selection === SelectionModeEnum.PARTIAL}
                      isChecked={entity.selection === SelectionModeEnum.SELECTED}
                      onClick={() => onMultiCellsSelected(entity, selectionMode)}
                      borderColor={CommonColors.HALF_BAKED}
                      checkColor={CommonColors.NAVY_8}
                    />
                    QNs
                  </MultiSelectionQn>
                </MultiSelectionTooltip>
              }
              disabled={!isNetwork}
              delay={[500, 250]}>
              <CheckboxStyled
                isPartialCheck={entity.selectionMode === SelectionModeEnum.PARTIAL}
                isChecked={entity.selectionMode === SelectionModeEnum.SELECTED}
                onClick={() => onCellSelected(entity)}
                borderColor={CommonColors.HALF_BAKED}
                checkColor={CommonColors.NAVY_8}
              />
            </Tooltip>
          </RowSelectionCell>
        );
      } else {
        return <Cell />;
      }
    },
  });
}

function getRows(rules: DsRuleEntity[], isFilterByOverride: boolean): DsRuleEntity[] {
  return rules.filter((entity) => filterRows(entity, isFilterByOverride));
}

function filterRows(entity: DsRuleEntity, isFilterByOverride?: boolean): DsRuleEntity | undefined {
  entity.children = entity.children?.filter((child) => filterRows(child, isFilterByOverride));
  const isOverride = !!entity.assignmentRule.assignment || !entity.routingRule.routingEnabled;
  if (!isFilterByOverride || entity.hasChildren || isOverride) {
    return entity;
  }
}

export function getAssignmentValue(rowItem: DsRuleEntity): string {
  const parentRule = rowItem?.parent;

  let value = rowItem?.assignmentRule?.assignment;

  const isParentCacheGroupMid = rowItem.parent?.ruleType === "cache-group-both";
  if (!value && isParentCacheGroupMid) {
    value = "Computed";
  }

  if (!value) {
    value = parentRule?.assignmentRule.assignment;
  }
  if (!value) {
    value = parentRule?.parent?.assignmentRule?.assignment;
  }
  if (!value) {
    value = "---";
  }

  return value;
}

function inferHierarchySelectionMode(
  entities: DsRuleEntity[]
): {
  selectionCount: number;
  selectableCount: number;
  selectionMode: SelectionModeEnum;
} {
  let selectionCount = 0;
  let selectableCount = 0;
  let selectionMode: SelectionModeEnum = SelectionModeEnum.NOT_SELECTED;

  if (entities.length > 0) {
    const flatHierarchyEntities = HierarchyUtils.flatEntitiesHierarchy(entities);
    flatHierarchyEntities.forEach((entity) => {
      if (entity.isNotCacheGroup) {
        selectableCount += 1;
        if (entity.isSelected) {
          selectionCount += 1;
        }
      }
    });

    if (selectionCount === selectableCount) {
      selectionMode = SelectionModeEnum.SELECTED;
    } else if (selectionCount > 0) {
      selectionMode = SelectionModeEnum.PARTIAL;
    }
  }

  return { selectionCount, selectableCount, selectionMode };
}

function getHasSomeSelected(entities: DsRuleEntity[]): boolean {
  return HierarchyUtils.someEntities(entities, (entity) => {
    return entity.isSelected;
  });
}

function getGridApiData(gridApi: GridApi): DsRuleEntity[] {
  return gridApi
    .getRenderedNodes()
    .filter((node) => node.level === 0)
    .flatMap((node) => node.data as DsRuleEntity);
}
//endregion [[ Functions ]]
