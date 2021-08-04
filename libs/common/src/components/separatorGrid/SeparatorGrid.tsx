import * as React from "react";
import { loggerCreator } from "../../utils/logger";
import { QwiltGrid, QwiltGridColumnDef, TreeData } from "../qwiltGrid/QwiltGrid";
import { SeparatorEntity } from "./_domain/separatorEntity";
import { useMemo } from "react";
import { useState } from "react";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { GridOptions, RowNode, SortChangedEvent } from "ag-grid-community";
import { GridClasses, separatorGridStyles } from "./_styles/separatorGridStyles";
import _ from "lodash";
import styled, { FlattenSimpleInterpolation } from "styled-components";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]
const SeparatorGridView = styled.div<{ customStyles: FlattenSimpleInterpolation }>`
  height: 100%;
  ${(props) => props.customStyles}
`;

//endregion [[ Styles ]]

//region [[ Props ]]
export interface Props<T> {
  entities: T[];
  columns: QwiltGridColumnDef<SeparatorEntity<T> | T>[];
  onSortChanged?: (colId: keyof T | undefined) => void;
  treeData?: TreeData<SeparatorEntity<T> | T>;
  filter?: string;
  customSeparationKeys?: (keyof T)[];
  customSorting?: (
    entities: T[],
    sortedColumn: keyof T | undefined,
    columnsWithSeparation: Set<keyof T>
  ) => (SeparatorEntity<T> | T)[];
  sortByDefault?: keyof T;
  gridOptions?: GridOptions;
  theme?: string;
  entityRowHeight?: number;
  separatorRowHeight?: number;
  className?: string;
  customStyles?: FlattenSimpleInterpolation;
}

export const ENTITY_ROW_HEIGHT = 47;
export const SEPARATOR_ROW_HEIGHT = 35;

//endregion [[ Props ]]

export const SeparatorGrid = <T extends object>({
  entityRowHeight = ENTITY_ROW_HEIGHT,
  separatorRowHeight = SEPARATOR_ROW_HEIGHT,
  theme = "material",
  customStyles = separatorGridStyles,
  ...props
}: Props<T>) => {
  type RowItem = SeparatorEntity<T> | T;
  const [sortedColumn, setSortedColumn] = useState<keyof T | undefined>(props.sortByDefault);
  const columnsWithSeparation: Set<keyof T> = useMemo(() => {
    const keys = (props.customSeparationKeys ?? props.entities[0] ? Object.keys(props.entities[0]) : []) as (keyof T)[];
    return new Set(keys);
  }, [props.customSeparationKeys, props.entities]);

  const rows = useMemo(
    () =>
      props.customSorting?.(props.entities, sortedColumn, columnsWithSeparation) ??
      getRowEntitiesSortedByColumn(props.entities, sortedColumn, columnsWithSeparation),
    [columnsWithSeparation, props, sortedColumn]
  );

  const onSortChanged = useMemo(
    () => (event: SortChangedEvent) => {
      const allColumns = event.columnApi.getAllColumns();

      //ag-grid ignores tree column on getAllColumns. noneSorting is used to determine whether the tree column is sorting or not
      let noneSorting = true;
      allColumns.forEach((column) => {
        const colId: keyof T | undefined = column.getColDef().colId as keyof T;
        if (!!colId) {
          if (column.isSorting()) {
            setSortedColumn(colId);
            if (props.onSortChanged) {
              props.onSortChanged(colId);
            }
            noneSorting = false;
          }
        }
      });

      if (noneSorting && props.treeData) {
        const treeColId = props.treeData?.treeColumn.colDefOptions?.colId as keyof T;
        setSortedColumn(treeColId);
        if (props.onSortChanged) {
          props.onSortChanged(treeColId);
        }
      }
    },
    [props]
  );

  const gridOptions = useMemo<GridOptions>(
    () => ({
      getRowHeight: (params: RowNode) => {
        if (params.data instanceof SeparatorEntity) {
          return separatorRowHeight;
        } else {
          return entityRowHeight;
        }
      },
      rowBuffer: 0,
      unSortIcon: true,
      animateRows: true,
      defaultColDef: {
        cellClass: (params: { data: T }) => {
          if (params.data instanceof SeparatorEntity) {
            return GridClasses.SEPARATOR;
          } else {
            return GridClasses.ENTITY;
          }
        },
        resizable: false,
        sortable: true,
      },
      onSortChanged,
      postSort: (rowNodes) => {
        function move(toIndex: number, fromIndex: number) {
          rowNodes.splice(toIndex, 0, rowNodes.splice(fromIndex, 1)[0]);
        }

        // Move separation row (headers) to always be above its group
        for (let i = 1; i < rowNodes.length; i++) {
          if (rowNodes[i].data instanceof SeparatorEntity) {
            const separator = rowNodes[i].data as SeparatorEntity<T>;
            if (separator.children[0] === rowNodes[i - 1].data) {
              move(i - separator.children.length, i);
            }
          }
        }
      },
      sortingOrder: ["asc", "desc"],
      ...props.gridOptions,
    }),
    [entityRowHeight, onSortChanged, props.gridOptions, separatorRowHeight]
  );

  return (
    <SeparatorGridView customStyles={customStyles}>
      <QwiltGrid<RowItem>
        rows={rows}
        columns={props.columns}
        filter={props.filter}
        gridOptions={gridOptions}
        treeData={props.treeData}
        theme={theme}
      />
    </SeparatorGridView>
  );
};

function getRowEntitiesSortedByColumn<T>(
  entities: T[],
  sortedColumn: keyof T | undefined,
  columnsWithSeparation: Set<keyof T>
): (SeparatorEntity<T> | T)[] {
  const rowItems: (SeparatorEntity<T> | T)[] = [];
  if (!sortedColumn) {
    return entities;
  }

  const sortedEntities = _.orderBy(entities, [sortedColumn]);
  if (columnsWithSeparation.has(sortedColumn)) {
    const firstEntity = sortedEntities[0];

    let lastSeparator = new SeparatorEntity<T>({
      value: (firstEntity[sortedColumn] as unknown) as string,
      children: [firstEntity],
    });

    rowItems.push(lastSeparator, firstEntity);

    for (const entity of sortedEntities) {
      if (String(entity[sortedColumn]) !== lastSeparator.value) {
        const newSeparator = new SeparatorEntity<T>({
          value: (entity[sortedColumn] as unknown) as string,
          children: [],
        });
        rowItems.unshift(newSeparator);
        lastSeparator = newSeparator;
      }
      lastSeparator.children.push(entity);
      rowItems.push(entity);
    }
    return rowItems;
  } else {
    return sortedEntities;
  }
}
