import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";

const moduleLogger = loggerCreator(__filename);

export type SystemUpdateChoiceType = "create" | "skip";

//region [[ Styles ]]

const UserFlowChoicesView = styled.div`
  display: grid;
  row-gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Choice = styled.div`
  cursor: pointer;
`;

const ChoiceLabel = styled.span`
  margin-left: 0.5rem;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  value: SystemUpdateChoiceType;
  onChange: (value: SystemUpdateChoiceType) => void;

  className?: string;
}

//endregion [[ Props ]]

export const UserFlowChoices = (props: Props) => {
  return (
    <UserFlowChoicesView className={props.className}>
      <Choice onClick={() => props.onChange("skip")}>
        <input type={"radio"} checked={props.value === "skip"} onChange={() => {}} />
        <ChoiceLabel>
          <b>Skip</b> System Update creation
        </ChoiceLabel>
      </Choice>
      <Choice onClick={() => props.onChange("create")}>
        <input type={"radio"} checked={props.value === "create"} onChange={() => {}} />
        <ChoiceLabel>
          <b>Create</b> new System Update
        </ChoiceLabel>
      </Choice>
    </UserFlowChoicesView>
  );
};
