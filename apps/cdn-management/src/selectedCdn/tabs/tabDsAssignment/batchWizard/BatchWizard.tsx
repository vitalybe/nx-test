import * as React from "react";
import { useMemo, useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { DsRuleEntity } from "../_domain/dsRuleEntity";
import { BatchPreview } from "./batchPreview/BatchPreview";
import { BatchForm } from "./batchForm/BatchForm";
import { BatchUpdate } from "./batchUpdate/BatchUpdate";
import { ConfigurationStyles } from "@qwilt/common/components/configuration/_styles/configurationStyles";
import { SmallTitle } from "@qwilt/common/components/configuration/_styles/configurationCommon";
import _ from "lodash";
import { HierarchyUtils } from "@qwilt/common/utils/hierarchyUtils";
import { DeliveryServiceEntity } from "../../../../_domain/deliveryServiceEntity";
import { DsAssignmentFormData } from "../_domain/dsAssignmentFormData";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const BatchWizardView = styled.div<{ padding?: boolean }>`
  padding: ${(props) => (props.padding ? "20px" : "0px")};
  position: relative;
  display: flex;
  width: 50vw;
  min-height: 50vh;
  background: ${ConfigurationStyles.COLOR_BACKGROUND};
  box-shadow: ${ConfigurationStyles.SHADOW};
`;

const Title = styled(SmallTitle)`
  width: fit-content;
  margin-bottom: 0.5em;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  deliveryService: DeliveryServiceEntity;
  rules: DsRuleEntity[];
  onClose: () => void;

  className?: string;
}

//endregion [[ Props ]]

type StepType = "preview" | "form" | "update";

interface StepData {
  step: StepType;
  data?: DsAssignmentFormData | undefined;
}

export const BatchWizard = (props: Props) => {
  const [stepData, setStepData] = useState<StepData>({ step: "preview", data: undefined });
  const isFormStep = stepData.step === "form";

  const filteredRules = useMemo(
    () => props.rules.filter((rule) => HierarchyUtils.someEntities([rule], (entity) => entity.isSelected)),
    [props.rules]
  );

  const selectedEntities = HierarchyUtils.flatEntitiesHierarchy(props.rules).filter((entity) => entity.isSelected);

  return (
    <BatchWizardView className={props.className} padding={!isFormStep}>
      {!isFormStep && (
        <TitleContainer>
          <Title>Batch Editor - {_.upperFirst(stepData.step)}</Title>
        </TitleContainer>
      )}
      {
        {
          preview: (
            <BatchPreview rules={filteredRules} onCancel={props.onClose} onNext={() => setStepData({ step: "form" })} />
          ),
          form: (
            <BatchForm
              deliveryService={props.deliveryService}
              onCancel={props.onClose}
              onBack={() => setStepData({ step: "preview", data: undefined })}
              onNext={(dsAssignmentsRulesType: DsAssignmentFormData) =>
                setStepData({ step: "update", data: dsAssignmentsRulesType })
              }
            />
          ),
          update: <BatchUpdate rules={selectedEntities} globalAssignments={stepData.data} onClose={props.onClose} />,
        }[stepData.step]
      }
    </BatchWizardView>
  );
};
