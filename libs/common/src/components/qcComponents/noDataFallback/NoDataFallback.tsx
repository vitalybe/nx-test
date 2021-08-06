import * as React from "react";
import styled from "styled-components";
import { CommonColors as Colors } from "../../../styling/commonColors";

const noDataIcon = require("../../../images/no-data-cloud.svg");

//region [[ Styles ]]

const NoDataSpn = styled.span`
  font-size: 0.75rem;
  color: ${Colors.GREY_CHATEAU};
`;

const NoDataLabel = styled(NoDataSpn)`
  margin: 0.75rem auto 0.25rem;
  font-size: 1rem;
  font-weight: 600;
  text-transform: capitalize;
`;

const NoDataFallbackView = styled.div<{}>`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Img = styled.img<{ size?: string }>`
  height: ${(props) => props.size ?? ""};
  width: ${(props) => props.size ?? ""};
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  label?: string;
  message?: string;
  size?: string;
  className?: string;
}

//endregion [[ Props ]]

export const NoDataFallback = ({ label = "no data", message, ...props }: Props) => {
  return (
    <NoDataFallbackView className={props.className}>
      <Img src={noDataIcon} alt={"no data"} size={props.size} />
      <NoDataLabel>{label}</NoDataLabel>
      {message && <NoDataSpn>{message}</NoDataSpn>}
    </NoDataFallbackView>
  );
};
