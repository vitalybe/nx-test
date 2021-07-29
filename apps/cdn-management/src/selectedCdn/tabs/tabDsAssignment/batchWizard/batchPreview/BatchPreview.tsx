import * as React from "react";
import { useMemo } from "react";
import styled from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { CommonColors } from "@qwilt/common/styling/commonColors";
import { DsRuleEntity, RuleType } from "../../_domain/dsRuleEntity";
import {
  GridReactRenderer,
  QwiltGrid,
  QwiltGridColumnDef,
  QwiltGridTreeColumnDef,
} from "@qwilt/common/components/qwiltGrid/QwiltGrid";
import { Colors } from "../../../../../_styling/colors";
import { HierarchyUtils } from "@qwilt/common/utils/hierarchyUtils";
import { lighten } from "polished";
import { getAssignmentValue } from "../../cardDsAssignment/CardDsAssignment";
import { useEventCallback } from "@qwilt/common/utils/hooks/useEventCallback";
import { GridReadyEvent } from "ag-grid-community";
import { DsRuleEntityTypeIcon } from "../../DsRuleEntityTypeIcon";

const moduleLogger = loggerCreator("__filename");

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

const Cell = styled.div<{ inherited?: boolean; boldContent?: boolean; highlightWarning?: boolean; selected?: boolean }>`
  color: ${(props) => (props.selected ? "black" : Colors.ALTO)};
  font-style: ${(props) => (props.inherited ? "italic" : "normal")};
  font-weight: ${(props) => (props.boldContent || props.highlightWarning ? "bold" : "normal")};
  display: flex;
  align-items: center;
`;

const DsRuleEntityTypeIconStyled = styled(DsRuleEntityTypeIcon)`
  margin-right: 0.5rem;
  flex: 0 0 auto;
`;
//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  rules: DsRuleEntity[];
  onCancel: () => void;
  onNext: () => void;
  className?: string;
}

//endregion [[ Props ]]

export const BatchPreview = (props: Props) => {
  const selectedEntitiesMap: { [key: string]: number } = {};
  const flatEntities = HierarchyUtils.flatEntitiesHierarchy(props.rules);
  flatEntities.forEach((entity) => {
    if (entity.isSelected) {
      const mapItem = selectedEntitiesMap[entity.ruleType];
      if (!mapItem) {
        selectedEntitiesMap[entity.ruleType] = 1;
      } else {
        selectedEntitiesMap[entity.ruleType] = mapItem + 1;
      }
    }
  });

  const entitiesTitlesArray = Object.keys(selectedEntitiesMap).map((key) => {
    const type = key as RuleType;
    const count = selectedEntitiesMap[key];

    let title = "QN";
    if (type === "network") {
      title = "Network";
    } else if (type === "manifest-router") {
      title = "Router";
    }

    return `${count} ${title + (count > 1 ? "s" : "")}`;
  });
  const columns = useMemo<QwiltGridColumnDef<DsRuleEntity>[]>(() => {
    return [
      {
        headerName: "Assignment",
        renderer: getAssignmentColumnCellRenderer(),
      },
      {
        headerName: "Routing",
        renderer: getRoutingColumnCellRenderer(),
      },
    ];
  }, []);

  const treeColumn = useMemo<QwiltGridTreeColumnDef<DsRuleEntity>>(
    () => ({
      headerName: "Name",
      renderer: new GridReactRenderer<DsRuleEntity>({
        valueGetter: (entity) => entity.name,
        reactRender: ({ entity, value }) => {
          const isRuleValid = entity.isValid ?? true;

          return (
            <Cell highlightWarning={!isRuleValid} selected={entity.isSelected}>
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

  const onGridReady = useEventCallback(({ api }: GridReadyEvent) => {
    api.forEachNode((rowNode) => {
      const entity = rowNode.data as DsRuleEntity;
      const expandState = HierarchyUtils.someEntities(entity?.children ?? [], (entity) => entity.isSelected);
      rowNode.setExpanded(expandState);
    });
    api.refreshCells();
  });

  return (
    <BatchPreviewView className={props.className}>
      <SelectedEntitiesTitle>
        The following items will be updated: <b>{entitiesTitlesArray.join(", ")}</b>
      </SelectedEntitiesTitle>
      <QwiltGrid<DsRuleEntity>
        gridOptions={{
          onGridReady,
        }}
        rows={props.rules}
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
};

function getAssignmentColumnCellRenderer(): GridReactRenderer<DsRuleEntity> {
  return new GridReactRenderer<DsRuleEntity>({
    valueGetter: (entity) => getAssignmentValue(entity),
    reactRender: (props) => {
      const parentData: DsRuleEntity = props.cellRendererProps.node.parent && props.cellRendererProps.node.parent.data;
      const data: DsRuleEntity = props.entity || parentData;
      if (data) {
        const { assignmentRule, parent } = data;
        const { assignmentBlocked, assignment } = assignmentRule;

        const isInherited = (!assignment && parent !== undefined) || !props.entity;

        return (
          <Cell
            boldContent
            highlightWarning={assignmentBlocked}
            inherited={isInherited}
            selected={props.entity.isSelected}>
            {props.value}
          </Cell>
        );
      } else {
        return <Cell />;
      }
    },
  });
}

function getRoutingColumnCellRenderer() {
  return new GridReactRenderer<DsRuleEntity>({
    valueGetter: (entity) => (entity.routingRule?.routingEnabled === undefined ? "Enabled" : "Disabled"),
    reactRender: (props) => {
      const parentData: DsRuleEntity = props.cellRendererProps.node?.parent?.data;
      const data: DsRuleEntity = props.entity || parentData;
      const type: RuleType = (props.entity as DsRuleEntity)?.ruleType;
      if (data) {
        const { routingRule } = data;
        const { routingEnabled } = routingRule;
        const isInherited = !(type === "cache" || type === "manifest-router") || !props.entity;
        return (
          <Cell highlightWarning={!routingEnabled} inherited={isInherited} selected={props.entity.isSelected}>
            {props.value}
          </Cell>
        );
      } else {
        return <Cell />;
      }
    },
  });
}
