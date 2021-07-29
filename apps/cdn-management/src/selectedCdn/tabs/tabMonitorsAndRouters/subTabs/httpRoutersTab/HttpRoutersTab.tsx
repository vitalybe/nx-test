import * as _ from "lodash";
import * as React from "react";
import { useMemo, useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { HttpRouterEntity } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/httpRoutersTab/_domain/httpRouterEntity";
import { openQwiltModal } from "common/components/qwiltModal/QwiltModal";
import { ItemsCard } from "common/components/configuration/itemsCard/ItemsCard";
import { HttpRouterEditor } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/httpRoutersTab/httpRouterEditor/HttpRouterEditor";
import { getEditAction, GridValueRenderer, QwiltGridColumnDef } from "common/components/qwiltGrid/QwiltGrid";
import { MonitorsAndRoutersGridUtils } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/_utils/monitorsAndRoutersGridUtils";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const HttpRouterCard = styled(ItemsCard)`
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
  entities: HttpRouterEntity[];

  className?: string;
}

//endregion [[ Props ]]

export const HttpRoutersTab = (props: Props) => {
  const [filter, setFilter] = useState("");

  function openEditor(editedItem: HttpRouterEntity) {
    openQwiltModal((closeModalWithResult) => (
      <HttpRouterEditor editedItem={editedItem} cdnName={props.cdnName} onClose={() => closeModalWithResult()} />
    ));
  }

  const actions = [getEditAction(openEditor)];

  const columns = useMemo<QwiltGridColumnDef<HttpRouterEntity>[]>(
    () => [
      ...MonitorsAndRoutersGridUtils.attachHealthProviderExpander(
        "Hostname",
        MonitorsAndRoutersGridUtils.getAllReadonlyColumns()
      ),
      {
        headerName: "Health Providers",
        renderer: new GridValueRenderer({ valueGetter: (entity) => entity.healthProviders.length.toString() }),
      },
      {
        headerName: "HTTP Router Group Name",
        renderer: new GridValueRenderer({ valueGetter: (entity) => entity.httpRouterGroupName }),
      },
      {
        headerName: "Status",
        renderer: new GridValueRenderer({ valueGetter: (entity) => _.startCase(entity.status) }),
      },
    ],
    []
  );

  return (
    <HttpRouterCard
      title={"DNS Routers"}
      filter={{ onFilter: setFilter, filterValue: filter }}
      className={props.className}>
      <MonitorsAndRoutersGridUtils.MonitorRouterGrid<HttpRouterEntity>
        actions={actions}
        rows={props.entities}
        columns={columns}
        filter={filter}
        disableOverflowTooltip={true}
        gridOptions={{ ...MonitorsAndRoutersGridUtils.healthProviderParentGridOptions }}
      />
    </HttpRouterCard>
  );
};
