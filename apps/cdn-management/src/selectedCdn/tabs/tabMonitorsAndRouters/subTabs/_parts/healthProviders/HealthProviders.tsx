import * as React from "react";
import { useMemo } from "react";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { GridValueRenderer, QwiltGrid, QwiltGridColumnDef } from "@qwilt/common/components/qwiltGrid/QwiltGrid";
import styled from "styled-components";
import { HealthProviderEntity } from "../../../_domain/healthProvider/healthProviderEntity";
import { ConfigurationStyles } from "@qwilt/common/components/configuration/_styles/configurationStyles";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const QwiltGridStyled = styled(QwiltGrid)`
  .ag-root {
    .ag-header {
      background-color: ${ConfigurationStyles.COLOR_SUB_GRID_HEADERS};
    }
  }
` as typeof QwiltGrid;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  entities: HealthProviderEntity[];

  className?: string;
}

//endregion [[ Props ]]

export const HealthProviders = (props: Props) => {
  const columns = useMemo<QwiltGridColumnDef<HealthProviderEntity>[]>(
    () => [
      { headerName: "Health Provider", renderer: new GridValueRenderer({ valueGetter: (e) => e.hostname }) },
      { headerName: "Priority", renderer: new GridValueRenderer({ valueGetter: (e) => e.priority.toString() }) },
    ],
    []
  );

  return <QwiltGridStyled<HealthProviderEntity> rows={props.entities} columns={columns} />;
};
