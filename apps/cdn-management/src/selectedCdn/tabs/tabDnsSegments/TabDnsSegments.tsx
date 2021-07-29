import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { ItemsCard } from "common/components/configuration/itemsCard/ItemsCard";
import { DnsSegmentEntity } from "src/selectedCdn/tabs/tabDnsSegments/_domain/DnsSegmentEntity";
import { ItemWithActions } from "common/components/configuration/itemWithActions/ItemWithActions";
import { EditorDnsSegment } from "src/selectedCdn/tabs/tabDnsSegments/editorDnsSegment/EditorDnsSegment";
import { openConfirmModal, openQwiltModal } from "common/components/qwiltModal/QwiltModal";
import { DnsSegmentProvider } from "src/selectedCdn/tabs/tabDnsSegments/_providers/DnsSegmentProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "common/styling/icons";
import { Utils } from "common/utils/utils";
import { useUrlState } from "common/utils/hooks/useUrlState";
import { ProjectUrlParams } from "src/_stores/projectUrlParams";
import { DnsRouterIcon } from "common/components/configuration/configurationIcons";
import { useSelectedCdn } from "src/_stores/selectedCdnStore";
import { QueryDataContainer } from "common/components/queryDataContainer/QueryDataContainer";

//region [[ Styles ]]

const TabDnsSegmentsView = styled.div`
  height: 100%;
`;

const QueryDataContainerStyled = styled(QueryDataContainer)`
  height: 100%;
` as typeof QueryDataContainer;

const SegmentsCard = styled(ItemsCard)`
  height: 100%;
  width: 400px;
`;

const DnsRouterIconStyled = styled(DnsRouterIcon)`
  margin-right: 0.5rem;
  width: 1.25rem;
  height: 1.25rem;
`;
//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  className?: string;
}

//endregion [[ Props ]]

export const TabDnsSegments = React.memo(({ ...props }: Props) => {
  const [filter, setFilter] = useUrlState(ProjectUrlParams.filter1);
  const cdn = useSelectedCdn();
  const [selectedSegment, setSelectedSegment] = useState<DnsSegmentEntity | undefined>(undefined);
  const queryResult = DnsSegmentProvider.instance.prepareQuery(cdn.id).useQuery();

  const deleteSegment = async (deletedSegment: DnsSegmentEntity) => {
    const toDelete = await openConfirmModal(
      `Are you sure want to delete segment '${deletedSegment.id}'?`,
      `Please confirm - ${cdn.name}`
    );

    if (toDelete) {
      await DnsSegmentProvider.instance.delete(cdn.id, deletedSegment.id);
    }
  };

  const editSegment = async (editedSegment: DnsSegmentEntity | undefined) => {
    await openQwiltModal((closeModalWithResult) => (
      <EditorDnsSegment
        cdn={cdn}
        edit={!!editedSegment}
        dnsSegment={editedSegment ?? DnsSegmentEntity.createEmpty()}
        onClose={() => {
          closeModalWithResult(undefined);
        }}
      />
    ));
  };

  return (
    <TabDnsSegmentsView className={props.className}>
      <QueryDataContainerStyled queryMetadata={queryResult}>
        {(segments) => (
          <SegmentsCard
            title={"Segments"}
            onAddButton={() => editSegment(undefined)}
            filter={{ onFilter: (filter) => setFilter(filter), filterValue: filter ?? "" }}>
            {segments
              .filter((segment) => Utils.includesCaseInsensitive(segment.id, filter ?? ""))
              .map((segment) => (
                <ItemWithActions
                  title={segment.id}
                  key={segment.id}
                  icon={<DnsRouterIconStyled />}
                  isSelected={segment === selectedSegment}
                  isSelectable={true}
                  onClick={() => setSelectedSegment(segment)}
                  actionButtons={[
                    { icon: <FontAwesomeIcon icon={Icons.EDIT} />, onClick: () => editSegment(segment) },
                    { icon: <FontAwesomeIcon icon={Icons.DELETE} />, onClick: () => deleteSegment(segment) },
                  ]}
                />
              ))}
          </SegmentsCard>
        )}
      </QueryDataContainerStyled>
    </TabDnsSegmentsView>
  );
});
