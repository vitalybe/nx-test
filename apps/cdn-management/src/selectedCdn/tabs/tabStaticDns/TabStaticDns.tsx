import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { StaticDnsEntity } from "./_domain/staticDnsEntity";
import { EditorStaticDns } from "./editorStaticDns/EditorStaticDns";
import { DeliveryServiceEntity } from "../../../_domain/deliveryServiceEntity";
import { ItemWithActions } from "@qwilt/common/components/configuration/itemWithActions/ItemWithActions";
import { ItemsCard } from "@qwilt/common/components/configuration/itemsCard/ItemsCard";
import {
  getDeleteAction,
  getEditAction,
  GridReactRenderer,
  GridValueRenderer,
  QwiltGrid,
  QwiltGridColumnDef,
} from "@qwilt/common/components/qwiltGrid/QwiltGrid";
import { CommonColors } from "@qwilt/common/styling/commonColors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "@qwilt/common/styling/icons";
import { useEventCallback } from "@qwilt/common/utils/hooks/useEventCallback";
import { openConfirmModal, openQwiltModal } from "@qwilt/common/components/qwiltModal/QwiltModal";
import { ProjectUrlStore } from "../../../_stores/projectUrlStore";
import { DeliveryServiceIcon } from "@qwilt/common/components/_projectSpecific/management/deliveryServiceIcon/DeliveryServiceIcon";
import { ProjectUrlParams } from "../../../_stores/projectUrlParams";
import { useUrlState } from "@qwilt/common/utils/hooks/useUrlState";
import { Utils } from "@qwilt/common/utils/utils";
import * as _ from "lodash";
import { useSelectedCdn } from "../../../_stores/selectedCdnStore";
import { StaticDnsProvider } from "./_providers/staticDnsProvider";

const TabStaticDnsView = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
`;

const DeliveryServicesCard = styled(ItemsCard)`
  margin-right: 1em;
  width: 300px;
`;

const RecordsList = styled(ItemsCard)`
  height: 100%;
  width: 100%;
  padding-right: 5px;
  padding-left: 5px;
`;

const Record = styled.div``;

const GridIcon = styled(FontAwesomeIcon)`
  margin-right: 0.3em;
`;

const TableWrapper = styled.div`
  position: relative;
  width: 100%;
  background-color: transparent;
  overflow: hidden;
  flex: 1;
`;

//endregion [[ Styles ]]

//region [[ Props ]]
export interface Props {
  deliveryServices: DeliveryServiceEntity[];
  staticDnsRecords: StaticDnsEntity[];

  className?: string;
}
//endregion [[ Props ]]

export interface Column {
  field: string;
  name: string;
}

//region [[ Functions ]]
function useSelectedDs(deliveryServiceEntities: DeliveryServiceEntity[]) {
  const [selectedDs, setSelectedDs] = useState<DeliveryServiceEntity | undefined>(undefined);

  useEffect(() => {
    const urlDsId = ProjectUrlStore.getInstance().getParam(ProjectUrlParams.selectedDs);
    const urlDs = urlDsId !== undefined ? deliveryServiceEntities.find((ds) => ds.id === urlDsId) : undefined;

    if (urlDs) {
      setSelectedDs(urlDs);
    } else if (deliveryServiceEntities.length > 0) {
      setSelectedDs(deliveryServiceEntities[0]);
    }
  }, [deliveryServiceEntities]);

  return { selectedDs, setSelectedDs };
}

//endregion [[ Functions ]]

export const TabStaticDns = React.memo(({ ...props }: Props) => {
  const [dsFilter, setDsFilter] = useUrlState(ProjectUrlParams.filter1);
  const [recordFilter, setRecordFilter] = useUrlState(ProjectUrlParams.filter2);

  const cdn = useSelectedCdn();
  const { selectedDs, setSelectedDs } = useSelectedDs(props.deliveryServices);
  const shownRecords = props.staticDnsRecords.filter((record: StaticDnsEntity) => {
    return record.cdnId === cdn.id && record["deliveryServiceId"] === selectedDs?.id;
  });

  const columns = useMemo<QwiltGridColumnDef<StaticDnsEntity>[]>(() => {
    return [
      {
        headerName: "Hostname",
        width: 300,
        renderer: new GridReactRenderer({
          valueGetter: (entity) => entity.name,
          reactRender: ({ value }) => (
            <>
              <Record>
                <GridIcon icon={Icons.DNS_RECORD} color={CommonColors.NAVY_8} /> {value}
              </Record>
            </>
          ),
        }),
      },
      { renderer: new GridValueRenderer({ valueGetter: (entity) => entity.type }), headerName: "Type" },
      { renderer: new GridValueRenderer({ valueGetter: (entity) => entity.ttl }), headerName: "TTL" },
      { renderer: new GridValueRenderer({ valueGetter: (entity) => entity.value }), headerName: "Value" },
      { renderer: new GridValueRenderer({ valueGetter: (entity) => entity.orgId }), headerName: "Org ID" },
    ];
  }, []);

  const openEditor = (staticDns: StaticDnsEntity | undefined) => {
    if (selectedDs) {
      openQwiltModal((closeModalWithResult) => (
        <EditorStaticDns
          editedStaticDns={staticDns}
          onClose={() => closeModalWithResult()}
          cdn={cdn}
          deliveryServiceId={selectedDs.id}
        />
      ));
    }
  };

  const onDelete = useEventCallback(async (staticDns: StaticDnsEntity) => {
    await openConfirmModal(
      `Are you sure want to delete "${staticDns.name}"?`,
      `Please confirm - ${cdn.name}`,
      async () => {
        await StaticDnsProvider.instance.delete(staticDns);
      }
    );
  });

  const onSelectDs = (deliveryService: DeliveryServiceEntity) => {
    ProjectUrlStore.getInstance().setParam(ProjectUrlParams.selectedDs, deliveryService.id);
    setSelectedDs(deliveryService);
  };

  return (
    <TabStaticDnsView className={props.className}>
      <DeliveryServicesCard
        title={"Delivery Service"}
        filter={{ onFilter: (filter) => setDsFilter(filter), filterValue: dsFilter ?? "" }}>
        {props.deliveryServices.length === 0 && <div>⚠️ No delivery services available</div>}
        {filterDs(props.deliveryServices, dsFilter ?? "").map((deliveryService) => (
          <ItemWithActions
            title={deliveryService.name}
            key={deliveryService.id}
            icon={<DeliveryServiceIcon isActive={deliveryService.isActive} />}
            isSelected={selectedDs === deliveryService}
            isSelectable={true}
            onClick={() => onSelectDs(deliveryService)}
          />
        ))}
      </DeliveryServicesCard>
      <RecordsList
        title={"Records"}
        onAddButton={() => openEditor(undefined)}
        filter={{ onFilter: (filter) => setRecordFilter(filter), filterValue: recordFilter ?? "" }}>
        <TableWrapper>
          <QwiltGrid<StaticDnsEntity>
            rows={shownRecords}
            columns={columns}
            actions={[getEditAction(openEditor), getDeleteAction(onDelete)]}
            filter={recordFilter}
          />
        </TableWrapper>
      </RecordsList>
    </TabStaticDnsView>
  );
});

function filterDs(deliveryServices: DeliveryServiceEntity[], filter: string) {
  const filtered = deliveryServices.filter((ds) => Utils.includesCaseInsensitive(ds.name, filter));
  return _.orderBy(filtered, (ds) => ds.name);
}
