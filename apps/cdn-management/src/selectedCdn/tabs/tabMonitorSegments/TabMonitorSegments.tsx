import * as React from "react";
import { useMemo } from "react";
import styled from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import {
  getDeleteAction,
  getEditAction,
  GridReactRenderer,
  QwiltGrid,
  QwiltGridColumnDef,
} from "@qwilt/common/components/qwiltGrid/QwiltGrid";
import { ItemsCard } from "@qwilt/common/components/configuration/itemsCard/ItemsCard";
import { useEventCallback } from "@qwilt/common/utils/hooks/useEventCallback";
import { openConfirmModal, openQwiltModal } from "@qwilt/common/components/qwiltModal/QwiltModal";
import { CommonColors } from "@qwilt/common/styling/commonColors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "@qwilt/common/styling/icons";
import { MonitorSegmentProvider } from "./_providers/MonitorSegmentProvider";
import { MonitorSegmentEntity } from "./_domain/MonitorSegmentEntity";
import { FallbacksContainer } from "./fallbacksContainer/FallbacksContainer";
import { useUrlState } from "@qwilt/common/utils/hooks/useUrlState";
import { ProjectUrlParams } from "../../../_stores/projectUrlParams";
import { MonitorSegmentsEditorContainer } from "./monitorSegmentsEditor/monitorSegmentsEditorContainer";
import { useSelectedCdn } from "../../../_stores/selectedCdnStore";
import { QueryDataContainer } from "@qwilt/common/components/queryDataContainer/QueryDataContainer";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const QueryDataContainerStyled = styled(QueryDataContainer)`
  height: 100%;
` as typeof QueryDataContainer;

const MainList = styled(ItemsCard)`
  height: 100%;
  padding-right: 5px;
  padding-left: 5px;
  position: relative;
  width: 100%;
  margin-bottom: 10px;
`;

const HeaderContainer = styled.div`
  position: relative;
`;

const GridIcon = styled(FontAwesomeIcon)`
  margin-right: 0.3em;
`;
//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  className?: string;
}

//endregion [[ Props ]]

export const TabMonitorSegments = (props: Props) => {
  const [filter, setFilter] = useUrlState(ProjectUrlParams.filter1);
  const cdn = useSelectedCdn();
  const queryResult = MonitorSegmentProvider.instance.prepareQuery(cdn.id).useQuery();

  const openEditor = (editedItem: MonitorSegmentEntity | undefined) => {
    openQwiltModal((closeModalWithResult) => (
      <MonitorSegmentsEditorContainer editedItem={editedItem} onClose={() => closeModalWithResult()} cdn={cdn} />
    ));
  };

  const onDelete = useEventCallback(async (entity: MonitorSegmentEntity) => {
    await openConfirmModal(`Are you sure want to delete item?`, `Please confirm - ${cdn.name}`, async () => {
      await MonitorSegmentProvider.instance.delete(cdn.id, entity.id);
    });
  });

  const onEdit = useEventCallback(async (editedEntity: MonitorSegmentEntity) => {
    openEditor(editedEntity);
  });

  const actions = useMemo(() => [getEditAction(onEdit), getDeleteAction(onDelete)], [onDelete, onEdit]);

  const columns = useMemo<QwiltGridColumnDef<MonitorSegmentEntity>[]>(
    () => [
      {
        headerName: "ID",
        renderer: new GridReactRenderer({
          valueGetter: (entity) => entity.id,
          reactRender: ({ value }) => (
            <>
              <HeaderContainer>
                <GridIcon icon={Icons.HTTP_ROUTER} color={CommonColors.NAVY_8} />
                {value + " "}
              </HeaderContainer>
            </>
          ),
        }),
      },
      {
        headerName: "Health Collectors",
        renderer: new GridReactRenderer({
          valueGetter: (entity) => entity.healthCollectorIds.join(","),
          reactRender: ({ entity }) => <FallbacksContainer fallbackIds={entity.healthCollectorIds} />,
        }),
      },
    ],
    []
  );

  const onFilter = (filter: string) => {
    setFilter(filter);
  };

  return (
    <QueryDataContainerStyled queryMetadata={queryResult}>
      {(data) => (
        <MainList
          title={"Monitor Segments"}
          filter={{ onFilter: onFilter, filterValue: filter ?? "" }}
          onAddButton={() => openEditor(undefined)}>
          <QwiltGrid<MonitorSegmentEntity>
            filter={filter}
            rows={data}
            actions={actions}
            columns={columns}
            gridOptions={{ animateRows: true }}
          />
        </MainList>
      )}
    </QueryDataContainerStyled>
  );
};
