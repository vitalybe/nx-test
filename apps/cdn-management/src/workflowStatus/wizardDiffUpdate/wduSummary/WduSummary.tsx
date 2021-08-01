import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { SmallTitle } from "common/components/configuration/_styles/configurationCommon";
import { ConfigurationStyles } from "common/components/configuration/_styles/configurationStyles";
import { Button } from "common/components/configuration/button/Button";
import { TextTooltip } from "common/components/textTooltip/TextTooltip";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const WduSummaryView = styled.div`
  background: ${ConfigurationStyles.COLOR_BACKGROUND};
  box-shadow: ${ConfigurationStyles.SHADOW};
  position: relative;

  width: 100%;
  height: 100%;

  display: grid;
  flex-direction: row;
  grid-template-rows: 1fr auto;

  padding: 0.5rem 1rem;
`;

const Title = styled(SmallTitle)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 2em;
  padding-left: 1em;
  padding-top: 5px;
  z-index: 2;
  background: ${ConfigurationStyles.COLOR_BACKGROUND};
`;

const Content = styled.div`
  margin-top: 2rem;
`;
const ButtonsFooter = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  justify-items: left;
  column-gap: 1rem;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  isSystemUpdateCreated: boolean;

  onClose: () => void;
  onFinish: () => void;

  className?: string;
}

//endregion [[ Props ]]

export const WduSummary = (props: Props) => {
  return (
    <WduSummaryView className={props.className}>
      <Title>Summary</Title>
      <Content>
        <div>
          Click <b>Continue Workflow</b> to proceed:
          <ul>
            <li>CDN changes will be applied</li>
            {props.isSystemUpdateCreated ? (
              <li>Create a System Update</li>
            ) : (
              <li>
                System Update will <b>not</b> be created
              </li>
            )}
          </ul>
        </div>
      </Content>
      <ButtonsFooter>
        <TextTooltip content={"Workflow will remain in pending state"}>
          <Button onClick={props.onClose}>Close Dialog</Button>
        </TextTooltip>
        <Button onClick={props.onFinish}>Continue Workflow</Button>
      </ButtonsFooter>
    </WduSummaryView>
  );
};
