import * as _ from "lodash";
import * as React from "react";
import { useMemo, useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { HealthCollectorEntity } from "./_domain/healthCollectorEntity";
import { openQwiltModal } from "@qwilt/common/components/qwiltModal/QwiltModal";
import { ItemsCard } from "@qwilt/common/components/configuration/itemsCard/ItemsCard";
import { HealthCollectorEditor } from "./healthCollectorEditor/HealthCollectorEditor";
import { getEditAction, GridValueRenderer, QwiltGridColumnDef } from "@qwilt/common/components/qwiltGrid/QwiltGrid";
import { MonitorsAndRoutersGridUtils } from "../_utils/monitorsAndRoutersGridUtils";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const HealthCollectorCard = styled(ItemsCard)`
  height: 100%;

  // sub-grid
  .ag-row-level-1 > .ag-react-container {
    padding: 1rem;
    height: 100%;
  }
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  cdnName: string;
  entities: HealthCollectorEntity[];

  className?: string;
}

//endregion [[ Props ]]

export const HealthCollectorsTab = (props: Props) => {
  const [filter, setFilter] = useState("");

  function openEditor(editedItem: HealthCollectorEntity) {
    openQwiltModal((closeModalWithResult) => (
      <HealthCollectorEditor editedItem={editedItem} cdnName={props.cdnName} onClose={() => closeModalWithResult()} />
    ));
  }

  const actions = [getEditAction(openEditor)];

  const columns = useMemo<QwiltGridColumnDef<HealthCollectorEntity>[]>(
    () => [
      ...MonitorsAndRoutersGridUtils.getAllReadonlyColumns(),
      {
        headerName: "Health Collector Region",
        renderer: new GridValueRenderer({ valueGetter: (entity) => entity.healthCollectorRegion }),
      },
      {
        headerName: "Status",
        renderer: new GridValueRenderer({ valueGetter: (entity) => _.startCase(entity.status) }),
      },
    ],
    []
  );

  return (
    <HealthCollectorCard
      title={"DNS Routers"}
      filter={{ onFilter: setFilter, filterValue: filter }}
      className={props.className}>
      <MonitorsAndRoutersGridUtils.MonitorRouterGrid<HealthCollectorEntity>
        actions={actions}
        rows={props.entities}
        columns={columns}
        filter={filter}
        disableOverflowTooltip={true}
        gridOptions={{ ...MonitorsAndRoutersGridUtils.healthProviderParentGridOptions }}
      />
    </HealthCollectorCard>
  );
};
