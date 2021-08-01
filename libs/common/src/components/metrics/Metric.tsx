import * as React from "react";
import { ReactChild } from "react";
import styled from "styled-components";
import { loggerCreator } from "../../utils/logger";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const MetricView = styled.div``;

export const ValueRow = styled.div`
  text-align: center;
`;
export const ValueSuffix = styled.span`
  margin-right: 2px;
  font-weight: 500 !important;
`;

export const Value = styled.span`
  margin-right: 2px;
`;

export const Unit = styled.span``;

export const DescriptionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconContainer = styled.div`
  display: inline-block;
  width: 17px;
  vertical-align: top;
  margin-right: 2px;
`;

export const Description = styled.span`
  max-width: 4.375rem;
  text-align: center;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  value?: string;
  valueAddition?: string; // this will not be bold
  units?: string;
  iconComponent?: ReactChild;
  description: string;

  className?: string;
}

//endregion [[ Props ]]

export const Metric = ({ valueAddition, ...props }: Props) => {
  return (
    <MetricView className={props.className}>
      {props.value && (
        <ValueRow>
          <Value>
            {props.value} {valueAddition && <ValueSuffix>{valueAddition}</ValueSuffix>}
          </Value>
          <Unit>{props.units}</Unit>
        </ValueRow>
      )}
      <DescriptionRow>
        {props.iconComponent && <IconContainer>{props.iconComponent}</IconContainer>}
        <Description>{props.description}</Description>
      </DescriptionRow>
    </MetricView>
  );
};
