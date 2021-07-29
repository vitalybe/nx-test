import * as _ from "lodash";
import * as React from "react";
import { useMemo, useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { HealthProviderEntity } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/healthProvidersTab/_domain/healthProviderEntity";
import { openQwiltModal } from "common/components/qwiltModal/QwiltModal";
import { ItemsCard } from "common/components/configuration/itemsCard/ItemsCard";
import { HealthProviderEditor } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/healthProvidersTab/healthProviderEditor/HealthProviderEditor";
import { getEditAction, GridValueRenderer, QwiltGridColumnDef } from "common/components/qwiltGrid/QwiltGrid";
import { MonitorsAndRoutersGridUtils } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/_utils/monitorsAndRoutersGridUtils";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const HealthProviderCard = styled(ItemsCard)`
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
  entities: HealthProviderEntity[];

  className?: string;
}

//endregion [[ Props ]]

export const HealthProvidersTab = (props: Props) => {
  const [filter, setFilter] = useState("");

  function openEditor(editedItem: HealthProviderEntity) {
    openQwiltModal((closeModalWithResult) => (
      <HealthProviderEditor editedItem={editedItem} cdnName={props.cdnName} onClose={() => closeModalWithResult()} />
    ));
  }

  const actions = [getEditAction(openEditor)];

  const columns = useMemo<QwiltGridColumnDef<HealthProviderEntity>[]>(
    () => [
      ...MonitorsAndRoutersGridUtils.getAllReadonlyColumns(),
      {
        headerName: "Status",
        renderer: new GridValueRenderer({ valueGetter: (entity) => _.startCase(entity.status) }),
      },
    ],
    []
  );

  return (
    <HealthProviderCard
      title={"DNS Routers"}
      filter={{ onFilter: setFilter, filterValue: filter }}
      className={props.className}>
      <MonitorsAndRoutersGridUtils.MonitorRouterGrid<HealthProviderEntity>
        actions={actions}
        rows={props.entities}
        columns={columns}
        filter={filter}
        disableOverflowTooltip={true}
        gridOptions={{ ...MonitorsAndRoutersGridUtils.healthProviderParentGridOptions }}
      />
    </HealthProviderCard>
  );
};
