import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../../../../utils/logger";
import { CommonColors } from "../../../../../../styling/commonColors";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]
const HorizontalDashedLine = styled.div`
  height: 1px;
  width: 24px;
  border-bottom: 1px dashed ${CommonColors.SHERPA_BLUE};
  margin-right: 16px;
  margin-top: 4px;
`;

const VerticalDashedLine = styled.div`
  height: 24px;
  width: 1px;
  border-right: 1px dashed ${CommonColors.SHERPA_BLUE};
  margin-right: 16px;
`;

const VerticalSolidLine = styled.div`
  height: 24px;
  width: 1px;
  border-right: 1px solid ${CommonColors.SHERPA_BLUE};
  margin-right: 16px;
`;

const PrintLegendSpn = styled.span`
  max-width: 120px;
  margin-right: 24px;
  font-size: 12px;
  color: ${CommonColors.ARAPAWA};
  line-height: 1.3;
`;

const PrintLegendItem = styled.div`
  display: flex;
  align-items: flex-start;
`;

const OverallRevenuePrintLegendView = styled.div`
  display: flex;
  align-items: flex-start;
  margin-left: auto;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  isSingleProject: boolean;
  className?: string;
}

//endregion [[ Props ]]

export const OverallRevenuePrintLegend = (props: Props) => {
  return (
    <OverallRevenuePrintLegendView className={props.className}>
      {props.isSingleProject && (
        <>
          <PrintLegendItem>
            <HorizontalDashedLine />
            <PrintLegendSpn>{`Revenue threshold for completion of Financing Phase`}</PrintLegendSpn>
          </PrintLegendItem>
          <PrintLegendItem>
            <VerticalDashedLine />
            <PrintLegendSpn>{"Expected completion of Financing Phase"}</PrintLegendSpn>
          </PrintLegendItem>
        </>
      )}
      <PrintLegendItem>
        <VerticalSolidLine />
        <PrintLegendSpn>{"Current date"}</PrintLegendSpn>
      </PrintLegendItem>
    </OverallRevenuePrintLegendView>
  );
};
