import * as React from "react";
import { useMemo, useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { ItemsCard } from "common/components/configuration/itemsCard/ItemsCard";
import { ActionData, GridReactRenderer, QwiltGrid, QwiltGridColumnDef } from "common/components/qwiltGrid/QwiltGrid";
import { Notifier } from "common/utils/notifications/notifier";
import { CacheOperationalModeApiEnum } from "common/backend/cdns/_types/deliveryUnitApiType";
import { openQwiltModal } from "common/components/qwiltModal/QwiltModal";
import { QnPlugIcon, UnassignedQnIcon } from "common/components/configuration/configurationIcons";
import { SelectedCdnContextProvider, useSelectedCdn } from "src/_stores/selectedCdnStore";
import { QnEntity } from "src/_domain/qnEntity";
import { CacheEntity } from "src/_domain/cacheEntity";
import { DeploymentEntity } from "common/domain/qwiltDeployment/deploymentEntity";
import { NameWithId } from "common/domain/nameWithId";
import { EditorCacheContainer } from "src/selectedCdn/tabs/tabCaches/editorCache/EditorCacheContainer";
import { defaultHealthProfile } from "src/_domain/defaultHealthProfile";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const CachesGridView = styled.div`
  min-height: 0;
  display: flex;
  flex: 1 1 auto;
`;

const CachesGridCard = styled(ItemsCard)`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  padding: 0;
`;

const Cell = styled.div`
  display: flex;
  align-items: center;
`;

const UnassignedQnIconStyled = styled(UnassignedQnIcon)`
  margin-right: 0.5em;
`;

const QnPlugIconStyled = styled(QnPlugIcon)`
  flex: 0 0 auto;
`;
//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  entities: QnEntity[];
  networks: DeploymentEntity[];

  className?: string;
}

//endregion [[ Props ]]
export const QnsGrid = (props: Props) => {
  const cdn = useSelectedCdn();
  const rows = useMemo(() => props.entities, [props.entities]);
  const [filter, setFilter] = useState<string>("");
  const onFilter = (filter: string) => {
    setFilter(filter);
  };

  const convertToDeliveryUnit = async (cache: QnEntity) => {
    const network = getCacheNetwork(cache, props.networks);

    if (!network) {
      return;
    }

    const newCache = new CacheEntity({
      id: "",
      name: cache.systemId + "-cache",
      network: new NameWithId<number>({ id: network.id, name: network.name }),
      group: undefined,
      systemId: cache.systemId,
      cacheHashId: "",
      monitoringSegmentId: "",
      operationalMode: CacheOperationalModeApiEnum.OFFLINE,
      interfaces: cache.interfaces.map((cacheInterface) => ({
        cacheInterface: cacheInterface,
        routingName: "",
        isEnabled: false,
        hashCount: null,
        hashCountOffset: null,
        hashId: null,
      })),
      healthProfile: defaultHealthProfile,
    });

    await openQwiltModal((closeModalWithResult) => (
      <SelectedCdnContextProvider value={cdn}>
        <EditorCacheContainer cache={newCache} onClose={() => closeModalWithResult()} isEdit={false} />
      </SelectedCdnContextProvider>
    ));
  };

  const getCacheNetwork = (cache: QnEntity, networks: DeploymentEntity[]): DeploymentEntity | undefined => {
    let network: DeploymentEntity | undefined;

    if (cache.networkId) {
      network = networks.find((network) => network.id === cache.networkId);
      if (!network) {
        Notifier.warn("Network with ID was not found: " + cache.networkId);
      }
    } else {
      Notifier.warn("QN has no configured Network");
    }

    return network;
  };

  const columns = useMemo<QwiltGridColumnDef<QnEntity>[]>(() => {
    return [
      {
        headerName: "Name",
        renderer: new GridReactRenderer<QnEntity>({
          valueGetter: (entity) => entity.displayName,
          reactRender: ({ entity }) => (
            <Cell>
              <UnassignedQnIconStyled />
              {entity.displayName}
            </Cell>
          ),
        }),
      },
      {
        headerName: "System ID",
        renderer: new GridReactRenderer<QnEntity>({
          valueGetter: (entity) => entity.systemId,
          reactRender: ({ entity }) => <Cell>{entity.systemId}</Cell>,
        }),
      },
    ];
  }, []);

  const actions: ActionData<QnEntity>[] = [
    {
      iconComponent: <QnPlugIconStyled />,
      label: "Assign QN",
      callback: (entity) => convertToDeliveryUnit(entity),
    },
  ];

  return (
    <CachesGridView className={props.className}>
      <CachesGridCard
        title={"Unassigned QNs"}
        filter={{
          onFilter,
          filterValue: filter,
        }}>
        <QwiltGrid<QnEntity>
          gridOptions={{
            animateRows: true,
          }}
          filter={filter}
          rows={rows}
          columns={columns}
          actions={actions}
        />
      </CachesGridCard>
    </CachesGridView>
  );
};
