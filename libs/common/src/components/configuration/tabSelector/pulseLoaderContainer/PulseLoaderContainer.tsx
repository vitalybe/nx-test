import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../../utils/logger";
import { PulseLoader } from "react-spinners";
import { ReactNode } from "react";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const TabSubtitleLoaderView = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  isLoading: boolean;
  children: ReactNode;

  className?: string;
}

//endregion [[ Props ]]

export const PulseLoaderContainer = ({ isLoading, children, ...props }: Props) => {
  return (
    <TabSubtitleLoaderView className={props.className}>
      {!isLoading ? children : <PulseLoader size={5} />}
    </TabSubtitleLoaderView>
  );
};
