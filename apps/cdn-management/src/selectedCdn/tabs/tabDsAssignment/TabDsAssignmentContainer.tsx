import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { TabDsAssignment } from "./TabDsAssignment";
import { DsAssignmentsProvider } from "./_providers/dsAssignmentsProvider";
import { useSelectedCdn } from "../../../_stores/selectedCdnStore";
import { QueryDataContainer } from "@qwilt/common/components/queryDataContainer/QueryDataContainer";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const TabDsAssignmentContainerView = styled(QueryDataContainer)`
  display: flex;
  flex: 1;
  min-height: 0;
` as typeof QueryDataContainer;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  className?: string;
}

//endregion [[ Props ]]

export const TabDsAssignmentContainer = (props: Props) => {
  const cdn = useSelectedCdn();
  const query = DsAssignmentsProvider.instance.prepareQuery(cdn.id, cdn.name).useQuery();

  return (
    <TabDsAssignmentContainerView className={props.className} queryMetadata={query}>
      {(data) => (
        <TabDsAssignment
          assignmentPerDs={data.assignmentPerDs}
          selectedCdn={cdn}
          orphanContainingServicesIds={data.orphanContainingServicesIds}
          deliveryServices={data.deliveryServices}
          allDsAssignments={data.dsAssignmentsMap}
        />
      )}
    </TabDsAssignmentContainerView>
  );
};
