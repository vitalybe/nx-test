import * as React from "react";
import styled from "styled-components";
import { PulseLoaderContainer } from "./pulseLoaderContainer/PulseLoaderContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons/faSync";
import { Clickable } from "../clickable/Clickable";
import { useTabRouterTabStore } from "../../tabRouter/_stores/tabRouterTabStore";
import { DateTime } from "luxon";
import { TextTooltip } from "../../textTooltip/TextTooltip";
import { loggerCreator } from "../../../utils/logger";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const TabSelectorView = styled.div`
  min-height: 2.7rem;

  text-align: center;
  display: flex;
  gap: 0.5rem;
  position: relative;
`;

const Content = styled.div``;

const ClickableStyled = styled(Clickable)`
  position: absolute;
  right: -1rem;
`;

const TabInfo = styled.div`
  margin-top: 5px;
  width: 100%;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  title: string;
  isLoading: boolean;
  lastLoadDate: DateTime;

  onRefresh?: () => void;
  subtitle?: React.ReactNode;

  className?: string;
}

//endregion [[ Props ]]

export const TabSelector = (props: Props) => {
  const tabSelectorStore = useTabRouterTabStore();

  return (
    <TabSelectorView className={props.className}>
      <Content>
        <div>{props.title.toUpperCase()}</div>
        {props.subtitle && (
          <PulseLoaderContainer isLoading={props.isLoading}>
            <TabInfo>{props.subtitle}</TabInfo>
          </PulseLoaderContainer>
        )}
      </Content>
      {tabSelectorStore.isSelected && props.onRefresh && (
        <TextTooltip
          disabled={props.isLoading}
          content={
            <div>
              Last refrshed: <b>{props.lastLoadDate.toFormat("D T")}</b>
            </div>
          }
          isEnabled={!props.isLoading}>
          <ClickableStyled isDisabled={props.isLoading} onClick={props.onRefresh}>
            <FontAwesomeIcon spin={props.isLoading} icon={faSync} />
          </ClickableStyled>
        </TextTooltip>
      )}
    </TabSelectorView>
  );
};
