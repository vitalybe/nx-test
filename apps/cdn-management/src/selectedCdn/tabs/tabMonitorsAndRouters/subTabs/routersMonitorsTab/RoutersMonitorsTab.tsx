// NOTE: Delete file when tempFlag_serversTabMoreConfigurations removed
import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import {
  GridReactRenderer,
  GridValueRenderer,
  QwiltGrid,
  QwiltGridColumnDef,
} from "common/components/qwiltGrid/QwiltGrid";
import { ServerEntityStatus } from "src/selectedCdn/tabs/tabMonitorsAndRouters/_domain/server/oldServerEntity";
import { CommonColors } from "common/styling/commonColors";
import Tippy from "@tippy.js/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { CommonStyles } from "common/styling/commonStyles";
import { ItemsCard } from "common/components/configuration/itemsCard/ItemsCard";
import { openConfirmModal } from "common/components/qwiltModal/QwiltModal";
import { ProviderMetadata, useProvider } from "common/components/providerDataContainer/_providers/useProvider";
import { ServersProvider } from "src/selectedCdn/tabs/tabMonitorsAndRouters/_providers/oldServersProvider";
import { ServerType } from "common/backend/trafficRoutersMonitors/_types/trafficRoutersMonitorsTypes";
import { TrafficRoutersMonitorsApi } from "common/backend/trafficRoutersMonitors";
import { ServerTypeIcon } from "src/selectedCdn/tabs/tabMonitorsAndRouters/_parts/ServerTypeIcon";
import { GenericServerEntity } from "src/selectedCdn/tabs/tabMonitorsAndRouters/_domain/server/genericServerEntity";
import { ServerApiUtil } from "src/selectedCdn/tabs/tabMonitorsAndRouters/util/serverApiUtil";
import { ProviderDataContainer } from "common/components/providerDataContainer/ProviderDataContainer";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const HeaderContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Link = styled.a`
  ${CommonStyles.clickableStyle("color", CommonColors.MATISSE)};
  position: absolute;
  right: 0;
  background-color: white;
`;

const GridIcon = styled(ServerTypeIcon)`
  margin-right: 0.3em;
  flex: 0 0 auto;
`;

const StatusCell = styled.div`
  padding-right: 20px;
  margin-right: 20px;
  width: 300px;
`;

const BooleanSelect = styled.select`
  width: 100%;
`;

const MainList = styled(ItemsCard)`
  height: 100%;
  padding-right: 5px;
  padding-left: 5px;
`;

const TableWrapper = styled.div`
  position: relative;
  width: 100%;
  background-color: transparent;
  margin-bottom: 10px;
  height: 100%;
`;

const ProviderDataContainerStyled = styled(ProviderDataContainer)`
  height: 100%;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  serverTypes: string[];
  cdnName: string;

  filter: string;
  onFilterChange: (filter: string) => void;

  className?: string;
}

//endregion [[ Props ]]

export interface ServerStatus {
  online: string;
  offline: string;
}

const statuses: ServerStatus = {
  online: "Online ",
  offline: "Offline",
};

const UNSET_VALUE = "-";

export const RoutersMonitorsTab = ({ cdnName, serverTypes, ...props }: Props) => {
  const { serversList, loadServers, metadata } = useLoadServers(serverTypes, cdnName);

  async function onStatusChange(selectedStatus: ServerEntityStatus, server: GenericServerEntity) {
    const toUpdateStatus = await openConfirmModal(
      `Are you sure want to change status from '${statuses[server.status]}' to '${statuses[selectedStatus]}'?`,
      `Please confirm - ${cdnName}`
    );

    if (toUpdateStatus) {
      await TrafficRoutersMonitorsApi.instance.updateServer(cdnName, server.hostname, selectedStatus);
      loadServers();
    }
  }

  async function onDsRemapCompressEnabledChange(newValue: boolean, server: GenericServerEntity) {
    const toUpdateStatus = await openConfirmModal(
      `Are you sure want to change DsRemapCompressEnabled from '${
        server.groupServerDsRemapConfigEnabled ?? UNSET_VALUE
      }' to '${newValue}'?`,
      `Please confirm - ${cdnName}`
    );

    if (toUpdateStatus) {
      await ServerApiUtil.updateServer(server, "groupServerDsRemapConfigEnabled", newValue, loadServers, cdnName);
    }
  }

  const columns = getGridColumns(serverTypes, onStatusChange, onDsRemapCompressEnabledChange);

  return (
    <ProviderDataContainerStyled providerMetadata={metadata} showChildrenWhileLoading={false}>
      <MainList title={serverTypes[0] + "s"} filter={{ onFilter: props.onFilterChange, filterValue: props.filter }}>
        <TableWrapper>
          <QwiltGrid<GenericServerEntity>
            filter={props.filter}
            rows={serversList ? serversList : []}
            columns={columns}
          />
        </TableWrapper>
      </MainList>
    </ProviderDataContainerStyled>
  );
};

function useLoadServers(
  types: string[],
  cdnName: string
): {
  loadServers: () => void;
  serversList: GenericServerEntity[] | undefined;
  metadata: ProviderMetadata;
} {
  const { data, metadata, reload: loadServers } = useProvider(
    async () => {
      return await ServersProvider.instance.provide(cdnName);
    },
    false,
    [cdnName]
  );

  let serversList: GenericServerEntity[] = [];
  if (data) {
    serversList = data.filter((server) => types.includes(server.type));
  }

  return { serversList, loadServers, metadata };
}

function getGridColumns(
  serverTypes: string[],
  onStatusChange: (selectedStatus: ServerEntityStatus, server: GenericServerEntity) => Promise<void>,
  onDsRemapCompressEnabledChange: (newValue: boolean, server: GenericServerEntity) => Promise<void>
) {
  const isHttpRouter = serverTypes.includes(ServerType.HTTP_ROUTER);
  const isDnsRouter = serverTypes.includes(ServerType.DNS_ROUTER);
  const isHealthCollector = serverTypes.includes(ServerType.HEALTH_COLLECTOR);

  const columns: QwiltGridColumnDef<GenericServerEntity>[] = [
    {
      headerName: "Hostname",
      renderer: new GridReactRenderer({
        valueGetter: (entity) => entity.hostname,
        reactRender: ({ entity }) => (
          <>
            <HeaderContainer>
              <GridIcon type={entity.type} />
              {entity.hostname + " "}
              {entity.type === ServerType.MONITOR && (
                <Tippy content={"Open in new tab"}>
                  <Link target={"_blank"} href={`http://${entity.hostname}.${entity.domain}`}>
                    <FontAwesomeIcon icon={faExternalLinkAlt} />
                  </Link>
                </Tippy>
              )}
            </HeaderContainer>
          </>
        ),
      }),
    },
    { renderer: new GridValueRenderer({ valueGetter: (entity) => entity.systemId }), headerName: "System Id" },
    { renderer: new GridValueRenderer({ valueGetter: (entity) => entity.type }), headerName: "Type" },
    { renderer: new GridValueRenderer({ valueGetter: (entity) => entity.domain }), headerName: "Domain" },
    { renderer: new GridValueRenderer({ valueGetter: (entity) => entity.ipv4Address }), headerName: "ipv4 Address" },
    { renderer: new GridValueRenderer({ valueGetter: (entity) => entity.ipv6Address }), headerName: "ipv6 Address" },
    { renderer: new GridValueRenderer({ valueGetter: (entity) => entity.tcpPort.toString() }), headerName: "TCP Port" },
    {
      renderer: new GridValueRenderer({ valueGetter: (entity) => entity.httpsPort.toString() }),
      headerName: "HTTPS Port",
    },
  ];

  if (isHealthCollector) {
    columns.push({
      renderer: new GridValueRenderer({ valueGetter: (entity) => entity.healthCollectorRegion ?? "" }),
      headerName: "DB Region",
    });
  } else if (isHttpRouter) {
    columns.push({
      renderer: new GridValueRenderer({ valueGetter: (entity) => entity.groupName }),
      headerName: "Group",
    });
  } else {
    columns.push({
      renderer: new GridValueRenderer({ valueGetter: (entity: GenericServerEntity) => entity.segmentId }),
      headerName: "Segment",
    });
  }

  if (isHttpRouter || isDnsRouter) {
    columns.push({
      renderer: new GridReactRenderer({
        reactRender: ({ entity }) => (
          <BooleanSelect
            onChange={async (event) => {
              await onDsRemapCompressEnabledChange(event.target.value.toLowerCase() === "true", entity);
            }}
            value={entity.groupServerDsRemapConfigEnabled?.toString() ?? UNSET_VALUE}>
            {[UNSET_VALUE, "true", "false"].map((value: string) => (
              <option value={value} key={value} disabled={value === UNSET_VALUE}>
                {value}
              </option>
            ))}
          </BooleanSelect>
        ),
        valueGetter: (entity) => entity.status,
      }),
      headerName: "DsRemapCompressEnabled",
      colDefOptions: { width: 100 },
    });
  }

  columns.push({
    headerName: "Status",
    colDefOptions: { width: 160 },
    renderer: new GridReactRenderer({
      reactRender: ({ entity }) => (
        <StatusCell>
          <select
            onChange={async (event) => {
              await onStatusChange(event.target.value as ServerEntityStatus, entity);
            }}
            value={entity.status}>
            {Object.keys(statuses).map((key: string) => (
              <option value={key} key={key}>
                {statuses[key as ServerEntityStatus]}
              </option>
            ))}
          </select>
        </StatusCell>
      ),
      valueGetter: (entity) => entity.status,
    }),
  });

  return columns;
}
