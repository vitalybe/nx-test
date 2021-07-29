import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { DeliveryAgreementsProvider } from "./_providers/deliveryAgreementsProvider";
import { ProviderMetadata, useProvider } from "@qwilt/common/components/providerDataContainer/_providers/useProvider";
import { ProviderDataContainer } from "@qwilt/common/components/providerDataContainer/ProviderDataContainer";
import { TabContainer } from "@qwilt/common/components/tabContainer/TabContainer";
import { ItemsCard } from "@qwilt/common/components/configuration/itemsCard/ItemsCard";
import { getEditAction, GridValueRenderer, QwiltGrid, QwiltGridColumnDef } from "@qwilt/common/components/qwiltGrid/QwiltGrid";
import { DeliveryAgreementsGroupEntity } from "./_domain/deliveryAgreementsGroupEntity";
import { openQwiltModal } from "@qwilt/common/components/qwiltModal/QwiltModal";
import { EditorDeliveryAgreement } from "./editorDeliveryAgreement/EditorDeliveryAgreement";
import { useEventCallback } from "@qwilt/common/utils/hooks/useEventCallback";
import { useUrlState } from "@qwilt/common/utils/hooks/useUrlState";
import { ProjectUrlParams } from "./_stores/projectUrlParams";
import { Notifier } from "@qwilt/common/utils/notifications/notifier";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const DeliveryAgreementsDataContainer = styled(ProviderDataContainer)`
  position: relative;
  height: 100%;
  width: 100%;
  max-width: 1200px;
  padding: 2em;
`;

const TabContainerStyled = styled(TabContainer)`
  height: 100%;
`;

const ItemsCardStyled = styled(ItemsCard)`
  height: 100%;
`;

//endregion

export interface Props {
  provider?: DeliveryAgreementsProvider;
  className?: string;
}

export const DeliveryAgreements = (props: Props) => {
  const provider = props.provider || DeliveryAgreementsProvider.instance;

  const { data: deliveryAgreements = [], metadata: providerMetadata, reload } = useProvider(
    (metadata) => provider.provide(metadata),
    false,
    []
  );
  useStartWithOpenEditor(providerMetadata, deliveryAgreements, reload);

  const [filter, setFilter] = useState("");
  const onEditAction = useEventCallback(async (entity: DeliveryAgreementsGroupEntity) => {
    await openEditor(entity, reload);
  })!;
  const columns = useMemo<QwiltGridColumnDef<DeliveryAgreementsGroupEntity>[]>(
    () => [
      { renderer: new GridValueRenderer({ valueGetter: (value) => value.name }), headerName: "Reporting Display Name" },
      {
        headerName: "Content Publisher",
        renderer: new GridValueRenderer({ valueGetter: (value) => value.dsMetadataCpName }),
      },
      {
        headerName: "Networks",
        renderer: new GridValueRenderer({
          valueGetter: (entity: DeliveryAgreementsGroupEntity) =>
            entity.networks.map((network) => network.name).join(", "),
        }),
      },
    ],
    []
  );

  return (
    <DeliveryAgreementsDataContainer
      providerMetadata={providerMetadata}
      showChildrenWhileLoading={false}
      isScrollingContainer
      className={props.className}>
      <TabContainerStyled tabNames={["Delivery Agreements"]} initialTabIndex={0} onTabChange={() => {}}>
        <ItemsCardStyled title={""} filter={{ onFilter: (newFilter) => setFilter(newFilter), filterValue: filter }}>
          <QwiltGrid<DeliveryAgreementsGroupEntity>
            rows={deliveryAgreements}
            columns={columns}
            actions={[getEditAction(onEditAction)]}
            filter={filter}
          />
        </ItemsCardStyled>
      </TabContainerStyled>
    </DeliveryAgreementsDataContainer>
  );
};

function useStartWithOpenEditor(
  providerMetadata: ProviderMetadata,
  deliveryAgreements: DeliveryAgreementsGroupEntity[],
  reload: () => void
) {
  const didEditorOpenRef = useRef(false);
  const [createMode, setCreateMode] = useUrlState(ProjectUrlParams.createMode);
  const [urlNetworkId, setUrlNetworkId] = useUrlState(ProjectUrlParams.networkId);
  const [urlDsMetadataId, setUrlDsMetadataId] = useUrlState(ProjectUrlParams.dsMetadataId);

  useEffect(() => {
    (async () => {
      if (!providerMetadata.isLoading && !didEditorOpenRef.current && !!createMode) {
        didEditorOpenRef.current = true;
        setCreateMode("");
        setUrlDsMetadataId("");
        setUrlNetworkId("");

        const foundDa = deliveryAgreements.find((da) => da.dsMetadataId === urlDsMetadataId);
        if (foundDa) {
          const networkId = parseInt(urlNetworkId ?? "");
          await openEditor(foundDa, reload, networkId);
        } else {
          Notifier.warn("Failed to find the requested Delivery Service Metadata: " + urlDsMetadataId);
        }
      }
    })();
  }, [
    createMode,
    deliveryAgreements,
    providerMetadata.isLoading,
    reload,
    setCreateMode,
    setUrlDsMetadataId,
    setUrlNetworkId,
    urlDsMetadataId,
    urlNetworkId,
  ]);
}

async function openEditor(entity: DeliveryAgreementsGroupEntity, reload: () => void, preselectedNetworkId?: number) {
  const toReload = await openQwiltModal((closeModalWithResult) => (
    <EditorDeliveryAgreement
      entity={entity}
      preselectedNetworkId={preselectedNetworkId}
      onModalClose={(didModifications) => closeModalWithResult(didModifications)}
    />
  ));

  if (toReload === true) {
    await reload();
  }
}
