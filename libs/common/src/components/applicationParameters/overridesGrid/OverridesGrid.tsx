import * as React from "react";
import { loggerCreator } from "../../../utils/logger";
import { GridReactRenderer, QwiltGrid, QwiltGridColumnDef } from "../../qwiltGrid/QwiltGrid";
import { useMemo } from "react";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import styled from "styled-components";
import { ParamsGridStyles } from "../paramsGridContainer/paramsGrid/paramsGridStyles";
import { GridOptions } from "ag-grid-community/dist/lib/entities/gridOptions";
import { UrlStore } from "../../../stores/urlStore/urlStore";
import { useState } from "react";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Clickable } from "../../configuration/clickable/Clickable";
import { OverridesGridInput } from "./overridesGridInput/OverridesGridInput";
import { TextTooltip } from "../../textTooltip/TextTooltip";
import { openQwiltModal } from "../../qwiltModal/QwiltModal";
import { OverrideEditor } from "./overrideEditor/OverrideEditor";
import { useDisposable } from "mobx-react-lite";
import { reaction } from "mobx";
import { useEventCallback } from "../../../utils/hooks/useEventCallback";
import { QcButton } from "../../qcComponents/_styled/qcButton/QcButton";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const ParamsGridView = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 3rem auto;
  grid-template-columns: auto;
  ${ParamsGridStyles.CSS};
`;

const TobBarButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const Cell = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  height: 4rem;
`;

const DeleteOutlinedStyled = styled(DeleteOutlined)`
  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const PlusCircleOutlinedStyled = styled(PlusCircleOutlined)`
  svg {
    width: 0.875rem;
    height: 0.875rem;
  }
`;

const QcButtonStyled = styled(QcButton)`
  display: flex;
  align-items: center;
  gap: 5px;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  filter: string;
  className?: string;
}

export interface OverridesGridItem {
  param: string;
}

//endregion [[ Props ]]

export const OverridesGrid = (props: Props) => {
  const [paramValueMap] = useUrlOverridesState();

  const rows = useMemo(() => getRows(paramValueMap, props.filter), [paramValueMap, props.filter]);

  const deleteParam = (param: string) => {
    //setParam with a valid string value to override useUrlState shouldRemoveEmpty = false
    UrlStore.getInstance().setParam(param, " ");
    UrlStore.getInstance().removeParam(param);
  };

  const addParam = () => {
    openQwiltModal((closeModalWithResult) => <OverrideEditor onClose={closeModalWithResult} />);
  };

  const columns: QwiltGridColumnDef<OverridesGridItem>[] = [
    {
      headerName: "Parameter",
      renderer: new GridReactRenderer({
        valueGetter: (item) => item.param,
        reactRender: ({ entity }) => (
          <Cell>
            <i>{entity.param}</i>
          </Cell>
        ),
      }),
      colDefOptions: {
        sort: "asc",
        width: 350,
      },
    },
    {
      headerName: "Value",
      renderer: new GridReactRenderer({
        valueGetter: (item) => paramValueMap.get(item.param) ?? "",
        reactRender: ({ entity }) => (
          <Cell>
            <OverridesGridInput param={entity.param} />
          </Cell>
        ),
      }),
    },
    {
      headerName: "Actions",
      renderer: new GridReactRenderer({
        valueGetter: () => "",
        reactRender: ({ entity }) => (
          <Cell>
            <TextTooltip content={"Remove Override"} placement={"top"} distance={3}>
              <Clickable onClick={() => deleteParam(entity.param)}>
                <DeleteOutlinedStyled />
              </Clickable>
            </TextTooltip>
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
      <TobBarButtons>
        <QcButtonStyled onClick={addParam}>
          Add Override
          <PlusCircleOutlinedStyled />
        </QcButtonStyled>
      </TobBarButtons>
      <QwiltGrid<OverridesGridItem>
        rows={rows}
        columns={columns}
        theme={"material"}
        filter={""}
        gridOptions={gridOptions}
      />
    </ParamsGridView>
  );
};

function getRows(paramValueMap: Map<string, string>, filter: string): OverridesGridItem[] {
  let items: OverridesGridItem[] = Array.from(paramValueMap).map(([param]) => ({
    param,
  }));

  if (filter) {
    items = items.filter((item) => paramValueMap.get(item.param)?.includes(filter) || item.param.includes(filter));
  }

  return items;
}

type HookReturnType<T> = [T, (value: T) => void];

function useUrlOverridesState(): HookReturnType<Map<string, string>> {
  const [map, setMap] = useState<Map<string, string>>(UrlStore.getInstance().getApiOverrideParams());

  useDisposable(() => reaction(() => UrlStore.getInstance().getApiOverrideParams(), setMap));

  const setValueCallback = useEventCallback((map: Map<string, string>) => {
    map?.forEach(([key, value]) => {
      if (value) {
        UrlStore.getInstance().setParam(key, value);
      } else {
        UrlStore.getInstance().removeParam(key);
      }
    });
  });

  return [map, setValueCallback];
}
