import * as React from "react";
import { useEffect } from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../utils/logger";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const RedirectToVersionView = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  versionHref: string;
  className?: string;
}

//endregion [[ Props ]]

//region [[ Functions ]]
//endregion [[ Functions ]]

export const RedirectToVersion = ({ ...props }: Props) => {
  useEffect(() => {
    setTimeout(() => (location.href = props.versionHref), 1000);
  }, [props.versionHref]);

  return (
    <RedirectToVersionView className={props.className}>
      <div>Redirecting to: {props.versionHref}</div>
    </RedirectToVersionView>
  );
};
