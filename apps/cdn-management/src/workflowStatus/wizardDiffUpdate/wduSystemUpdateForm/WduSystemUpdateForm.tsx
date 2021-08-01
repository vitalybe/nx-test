import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { SystemUpdatesForm } from "common/components/_projectSpecific/systemUpdatesManagement/systemUpdatesForm/SystemUpdatesForm";
import { useProvider } from "common/components/providerDataContainer/_providers/useProvider";
import { SystemUpdateFormProvider } from "common/components/_projectSpecific/systemUpdatesManagement/_providers/systemUpdateFormProvider";
import { ProviderDataContainer } from "common/components/providerDataContainer/ProviderDataContainer";
import { SystemUpdateSchemaType } from "common/components/_projectSpecific/systemUpdatesManagement/_domain/systemUpdateSchema";
import { ComponentTypeEnum } from "common/backend/systemEvents/_types/systemEventsTypes";
import {
  SystemUpdateChoiceType,
  UserFlowChoices,
} from "src/workflowStatus/wizardDiffUpdate/wduSystemUpdateForm/userFlowChoices/UserFlowChoices";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const SystemUpdatesFormStyled = styled(SystemUpdatesForm)`
  width: 100%;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  onClose: () => void;
  onNext: (systemUpdateForm: SystemUpdateSchemaType | undefined) => void;

  className?: string;
}

//endregion [[ Props ]]

export const WduSystemUpdateForm = (props: Props) => {
  const [userChoice, setUserChoice] = useState<SystemUpdateChoiceType>("create");

  const { data, metadata } = useProvider((metadata) => SystemUpdateFormProvider.instance.provide(metadata), true, []);

  return (
    <ProviderDataContainer providerMetadata={metadata} className={props.className}>
      {data && (
        <SystemUpdatesFormStyled
          beforeForm={<UserFlowChoices value={userChoice} onChange={(value) => setUserChoice(value)} />}
          forcedComponent={ComponentTypeEnum.DS_UPDATE}
          isShowDsDropdown={true}
          formAdditionalData={data}
          isFormDisabled={userChoice !== "create"}
          affectedQnDeploymentIds={[]}
          existingSystemUpdate={undefined}
          overrideButtons={[
            { label: "Cancel", onClick: props.onClose },
            {
              label: "Next >",
              onClick: (systemUpdateForm) => props.onNext(userChoice === "create" ? systemUpdateForm : undefined),
              canDisabled: true,
            },
          ]}
        />
      )}
    </ProviderDataContainer>
  );
};
