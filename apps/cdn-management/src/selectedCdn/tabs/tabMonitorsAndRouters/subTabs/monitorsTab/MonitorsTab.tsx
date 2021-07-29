import * as _ from "lodash";
import * as React from "react";
import { useMemo, useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { MonitorEntity } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/monitorsTab/_domain/monitorEntity";
import { openQwiltModal } from "common/components/qwiltModal/QwiltModal";
import { ItemsCard } from "common/components/configuration/itemsCard/ItemsCard";
import { MonitorEditor } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/monitorsTab/monitorEditor/MonitorEditor";
import { getEditAction, GridValueRenderer, QwiltGridColumnDef } from "common/components/qwiltGrid/QwiltGrid";
import { MonitorsAndRoutersGridUtils } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/_utils/monitorsAndRoutersGridUtils";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const MonitorCard = styled(ItemsCard)`
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
  entities: MonitorEntity[];

  className?: string;
}

//endregion [[ Props ]]

export const MonitorsTab = (props: Props) => {
  const [filter, setFilter] = useState("");

  function openEditor(editedItem: MonitorEntity) {
    openQwiltModal((closeModalWithResult) => (
      <MonitorEditor cdnName={props.cdnName} editedItem={editedItem} onClose={() => closeModalWithResult()} />
    ));
  }

  const actions = [getEditAction(openEditor)];

  const columns = useMemo<QwiltGridColumnDef<MonitorEntity>[]>(
    () => [
      ...MonitorsAndRoutersGridUtils.getAllReadonlyColumns(),
      {
        headerName: "Segment ID",
        renderer: new GridValueRenderer({ valueGetter: (entity) => entity.segmentId }),
      },
      {
        headerName: "Status",
        renderer: new GridValueRenderer({ valueGetter: (entity) => _.startCase(entity.status) }),
      },
    ],
    []
  );

  return (
    <MonitorCard
      title={"DNS Routers"}
      filter={{ onFilter: setFilter, filterValue: filter }}
      className={props.className}>
      <MonitorsAndRoutersGridUtils.MonitorRouterGrid<MonitorEntity>
        actions={actions}
        rows={props.entities}
        columns={columns}
        filter={filter}
        disableOverflowTooltip={true}
        gridOptions={{ ...MonitorsAndRoutersGridUtils.healthProviderParentGridOptions }}
      />
    </MonitorCard>
  );
};
