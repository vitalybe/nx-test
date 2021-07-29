import * as React from "react";
import { MutableRefObject, ReactElement, useRef, useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { ItemsCard } from "@qwilt/common/components/configuration/itemsCard/ItemsCard";
import { WorkflowEntity } from "../_domain/workflowEntity";
import {
  GridReactRenderer,
  GridValueRenderer,
  Props as QwiltGridProps,
  QwiltGrid,
  QwiltGridColumnDef,
} from "@qwilt/common/components/qwiltGrid/QwiltGrid";
import { StepMetadataEntity } from "../_domain/stepMetadataEntity";
import { StepEntity } from "../_domain/stepEntity";
import { StepGridCell } from "./stepGridCell/StepGridCell";
import { CellFocusedEvent, RowClickedEvent } from "ag-grid-community";
import { QwiltInput } from "@qwilt/common/components/configuration/qwiltForm/qwiltInput/QwiltInput";
import { Button } from "@qwilt/common/components/configuration/button/Button";
import { TextTooltip } from "@qwilt/common/components/textTooltip/TextTooltip";
import { Utils } from "../_util/utils";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const HistoryGridView = styled(ItemsCard)``;

const QwiltGridStyled = (styled(QwiltGrid)`
  .ag-react-container {
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  .steps-header-group {
    background-color: #c0d6dd;
  }
` as unknown) as <T extends {}>(props: QwiltGridProps<T>) => ReactElement;

const QwiltInputStyled = styled(QwiltInput)`
  margin-top: 5px;
`;

const CloseButton = styled(Button)`
  margin-top: 10px;
  align-self: flex-end;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  workflows: WorkflowEntity[];
  steps: StepMetadataEntity[];
  cdnName: string;

  onClose: () => void;

  className?: string;
}

//endregion [[ Props ]]

export const HistoryGrid = (props: Props) => {
  const [filter, setFilter] = useState("");
  const selectedWorkflowRef = useRef<WorkflowEntity | undefined>(undefined);

  const rows = props.workflows;
  const columns = useColumnDefinition(props.steps, selectedWorkflowRef);

  let isEnabledRowClickedHandler = true;
  function onRowClicked(event: RowClickedEvent) {
    if (isEnabledRowClickedHandler) {
      return;
    }

    selectedWorkflowRef.current = event.data as WorkflowEntity;
    event.api.refreshCells({ force: true });
  }

  function onCellFocused(event: CellFocusedEvent) {
    const groupName = event.column?.getParent().getColGroupDef().headerName;
    // @ts-ignore
    const gridOptions = event.api.gridOptionsWrapper.gridOptions;
    if (groupName === STEPS_GROUP_HEADER) {
      gridOptions.suppressRowClickSelection = true;
      isEnabledRowClickedHandler = true;
    } else {
      gridOptions.suppressRowClickSelection = false;
      isEnabledRowClickedHandler = false;
    }
  }

  return (
    <HistoryGridView className={props.className} title={`All Workflows - ${props.cdnName}`}>
      <QwiltGridStyled<WorkflowEntity>
        filter={filter}
        rows={rows}
        columns={columns}
        gridOptions={{
          rowSelection: "single",
          onRowClicked: onRowClicked,
          onCellFocused: onCellFocused,
        }}
      />
      <QwiltInputStyled label={"Filter"} value={filter} onChange={setFilter} />
      <CloseButton onClick={props.onClose}>Close</CloseButton>
    </HistoryGridView>
  );
};

//region [[ Functions ]]
const STEPS_GROUP_HEADER = "Steps";

function useColumnDefinition(
  steps: StepMetadataEntity[],
  selectedWorkflowRef: MutableRefObject<WorkflowEntity | undefined>
): QwiltGridColumnDef<WorkflowEntity>[] {
  return [
    {
      headerName: "ID",
      renderer: new GridReactRenderer({
        valueGetter: (entity) => entity.id,
        reactRender: ({ entity }) => (
          <TextTooltip content={entity.id} delay={300}>
            <div>{Utils.shortenId(entity.id)}</div>
          </TextTooltip>
        ),
      }),
    },
    {
      headerName: "User",
      renderer: new GridValueRenderer({ valueGetter: (entity) => entity.user }),
    },
    {
      headerName: "State",
      renderer: new GridValueRenderer({ valueGetter: (entity) => entity.state.toString() }),
    },
    {
      headerName: "Start Time",
      renderer: new GridValueRenderer({ valueGetter: (entity) => entity.startTime.toFormat("D T") }),
      sortValueGetter: (entity) => entity.startTime.valueOf(),
      colDefOptions: { sort: "desc" },
    },
    {
      headerName: "End Time",
      renderer: new GridValueRenderer({ valueGetter: (entity) => entity.endTime?.toFormat("D T") ?? "" }),
      sortValueGetter: (entity) => entity.endTime?.valueOf() ?? 0,
    },
    {
      headerName: STEPS_GROUP_HEADER,
      renderer: undefined,
      colDefOptions: { headerClass: "steps-header-group" },
      children: steps.map((step) => ({
        headerName: step.name,
        renderer: getStepCellRenderer(step, selectedWorkflowRef),
        colDefOptions: { headerClass: "steps-header-group" },
      })),
    },
  ];
}

function findWorkflowStep(workflow: WorkflowEntity, cellStep: StepMetadataEntity): StepEntity | undefined {
  return workflow.steps.find((workflowStep) => workflowStep.stepId === cellStep.id);
}

function getStepCellRenderer(
  cellStep: StepMetadataEntity,
  selectedWorkflow: MutableRefObject<WorkflowEntity | undefined>
) {
  return new GridReactRenderer<WorkflowEntity>({
    valueGetter: (entity) => findWorkflowStep(entity, cellStep)?.state.toString() ?? "",
    reactRender: (props) => {
      const workflowStep = findWorkflowStep(props.entity, cellStep);
      if (workflowStep) {
        return <StepGridCell workflow={props.entity} step={workflowStep} comparedWorkflow={selectedWorkflow.current} />;
      } else {
        // Backend returns information only for steps that started
        return <div />;
      }
    },
  });
}
//endregion [[ Functions ]]
