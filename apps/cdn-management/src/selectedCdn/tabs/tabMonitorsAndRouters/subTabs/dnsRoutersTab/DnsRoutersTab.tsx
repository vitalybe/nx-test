import * as _ from "lodash";
import * as React from "react";
import { useMemo, useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { DnsRouterEntity } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/dnsRoutersTab/_domain/dnsRouterEntity";
import { openQwiltModal } from "common/components/qwiltModal/QwiltModal";
import { ItemsCard } from "common/components/configuration/itemsCard/ItemsCard";
import { DnsRouterEditor } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/dnsRoutersTab/dnsRouterEditor/DnsRouterEditor";
import { getEditAction, GridValueRenderer, QwiltGridColumnDef } from "common/components/qwiltGrid/QwiltGrid";
import { MonitorsAndRoutersGridUtils } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/_utils/monitorsAndRoutersGridUtils";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const DnsRouterCard = styled(ItemsCard)`
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
  entities: DnsRouterEntity[];

  className?: string;
}

//endregion [[ Props ]]

export const DnsRoutersTab = (props: Props) => {
  const [filter, setFilter] = useState("");

  function openEditor(editedItem: DnsRouterEntity) {
    openQwiltModal((closeModalWithResult) => (
      <DnsRouterEditor editedItem={editedItem} cdnName={props.cdnName} onClose={() => closeModalWithResult()} />
    ));
  }

  const actions = [getEditAction(openEditor)];

  const columns = useMemo<QwiltGridColumnDef<DnsRouterEntity>[]>(
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
        headerName: "DNS Routing Segment ID",
        renderer: new GridValueRenderer({ valueGetter: (entity) => entity.dnsRoutingSegmentId }),
      },
      {
        headerName: "Status",
        renderer: new GridValueRenderer({ valueGetter: (entity) => _.startCase(entity.status) }),
      },
    ],
    []
  );

  return (
    <DnsRouterCard
      title={"DNS Routers"}
      filter={{ onFilter: setFilter, filterValue: filter }}
      className={props.className}>
      <MonitorsAndRoutersGridUtils.MonitorRouterGrid<DnsRouterEntity>
        actions={actions}
        rows={props.entities}
        columns={columns}
        filter={filter}
        disableOverflowTooltip={true}
        gridOptions={{ ...MonitorsAndRoutersGridUtils.healthProviderParentGridOptions }}
      />
    </DnsRouterCard>
  );
};
