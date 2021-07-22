import * as React from "react";
import { useMemo, useState } from "react";
import { loggerCreator } from "../../../../utils/logger";
import { ParamsMetadataType } from "../../_types/paramsMetadataTypes";
import { GridReactRenderer, QwiltGrid, QwiltGridColumnDef } from "../../../qwiltGrid/QwiltGrid";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import styled from "styled-components";
import { ParamsGridStyles } from "./paramsGridStyles";
import { GridOptions } from "ag-grid-community/dist/lib/entities/gridOptions";
import { ParamsGridInput } from "./paramsGridInput/ParamsGridInput";
import { PushpinFilled } from "@ant-design/icons";
import { devToolsStore } from "../../../devTools/_stores/devToolsStore";
import { TextTooltip } from "../../../textTooltip/TextTooltip";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const ParamsGridView = styled.div`
  width: 100%;
  height: 100%;
  ${ParamsGridStyles.CSS};
`;

const Cell = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  height: 4rem;
`;

const IconPlaceHolder = styled.div`
  width: 0.875rem;
  height: 0.875rem;
  display: flex;
  align-items: center;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  items: ParamsGridItem[];
  paramsValueMap: Map<string, string>;
  filter: string;
  className?: string;
}

export interface ParamsGridItem extends ParamsMetadataType {
  param: string;
  isCommon: boolean;
}

//endregion [[ Props ]]

export const ParamsGrid = (props: Props) => {
  const [paramValueMap, setParamValueMap] = useState<Map<string, string>>(props.paramsValueMap);

  const rows = useMemo(() => filterRows(props.items, paramValueMap, props.filter), [
    paramValueMap,
    props.filter,
    props.items,
  ]);

  const updateItemValue = (param: string, value: string) => {
    const newMap = new Map<string, string>(paramValueMap);
    newMap.set(param, value);
    setParamValueMap(newMap);
  };

  const env = devToolsStore.environment;

  const columns: QwiltGridColumnDef<ParamsGridItem>[] = [
    {
      headerName: "Parameter",
      renderer: new GridReactRenderer({
        valueGetter: (item) => item.param,
        reactRender: ({ entity }) => {
          const isPersistent = entity?.persistentEnvs?.some((stickyEnv) => stickyEnv === env);
          return (
            <Cell>
              <TextTooltip content={`Persistent on '${env}' environment`} disabled={!isPersistent}>
                <IconPlaceHolder>{isPersistent && <PushpinFilled />}</IconPlaceHolder>
              </TextTooltip>
              <i>{entity.param}</i>
            </Cell>
          );
        },
      }),
      colDefOptions: {
        width: 250,
        pinned: true,
      },
    },
    {
      headerName: "Description",
      renderer: new GridReactRenderer({
        valueGetter: (item) => item.description,
        reactRender: ({ entity }) => <Cell>{entity.description}</Cell>,
      }),
      colDefOptions: {},
    },
    {
      headerName: "Type",
      renderer: new GridReactRenderer({
        valueGetter: (item) => `${item.isCommon}`,
        reactRender: ({ entity }) => <Cell>{entity.isCommon ? "Common" : "Project Specific"}</Cell>,
      }),
      colDefOptions: {},
    },
    {
      headerName: "Value",
      renderer: new GridReactRenderer({
        valueGetter: () => "",
        reactRender: ({ entity }) => (
          <Cell>
            <ParamsGridInput item={entity} onChange={updateItemValue} />
          </Cell>
        ),
      }),
      colDefOptions: {
        sortable: false,
        maxWidth: 250,
        minWidth: 150,
      },
    },
  ];

  const gridOptions: GridOptions = {
    rowHeight: 63,
    animateRows: true,
    defaultColDef: {
      suppressMovable: true,
      sortable: true,
    },
  };

  return (
    <ParamsGridView>
      <QwiltGrid<ParamsGridItem>
        rows={rows}
        columns={columns}
        theme={"material"}
        filter={""}
        gridOptions={gridOptions}
      />
    </ParamsGridView>
  );
};

function filterRows(items: ParamsGridItem[], paramValueMap: Map<string, string>, filter: string): ParamsGridItem[] {
  let filteredItems = items;

  if (filter) {
    filteredItems = filteredItems.filter((item) =>
      Object.values(item).some(
        (value) => paramValueMap.get(item.param)?.includes(filter) || value?.toString().includes(filter)
      )
    );
  }

  return filteredItems;
}
