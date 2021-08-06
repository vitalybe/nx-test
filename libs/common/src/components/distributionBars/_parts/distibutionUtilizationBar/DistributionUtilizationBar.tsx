import * as React from "react";
import styled from "styled-components";
import { DistributionPartInfo } from "../../DistributionBars";
import { UtilizationBar } from "../../../utilizationBar/UtilizationBar";
import { CommonColors as Colors } from "../../../../styling/commonColors";
import { UnitKindEnum, unitsFormatter } from "../../../../utils/unitsFormatter";
import { Utils } from "../../../../utils/utils";
import _ from "lodash";

//region [[ Styles ]]

const StyledText = styled.span<{
  color?: string;
  fontSize?: string;
  margin?: string;
  isThin?: boolean;
}>`
  color: ${({ color }) => color || Colors.BLUE_WHALE};
  font-size: ${(props) => props.fontSize || "12px"};
  font-weight: ${(props) => (props.isThin ? 500 : 600)};
  flex: 0 0 auto;
  margin: ${(props) => props.margin || 0};
`;

const RowSection = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  &:last-child {
    margin-left: 6px;
  }
  &:first-child {
    margin-right: auto;
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const DistributionUtilizationBarsView = styled.div`
  width: 100%;
  &:not(:last-of-type) {
    margin-bottom: 9px;
  }
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props extends DistributionPartInfo {
  // bar max width is based on bar value relative to a peak value
  peak?: number;
  // percent value is based on bar value out of a total
  total: number;
  className?: string;
}

//endregion [[ Props ]]
// this component wraps UtilizationBar (used by DsGrid's peak bw renderer) and adds text labels to be used in utilization panel
export const DistributionUtilizationBar = ({
  total,
  peak,
  value,
  unit = UnitKindEnum.COUNT,
  label,
  threshold,
  color,
  childPart,
  ...props
}: Props) => {
  const formattedValue = unitsFormatter.format(value, unit);
  const thresholdFormatted = threshold && unitsFormatter.format(threshold.value, unit);
  const percentOfThreshold = threshold && Utils.calcPercent(value, threshold.value);
  const percentOfTotal = Utils.calcPercent(value, total);
  const childPartFormatted = childPart && unitsFormatter.format(childPart.value, childPart.unit);
  const childPartPercent = childPart && Utils.calcPercent(childPart.value, threshold?.value || value);
  return (
    <DistributionUtilizationBarsView className={props.className}>
      <Row>
        <RowSection>
          <StyledText color={Colors.BLUE_WHALE} margin={"0 4px 0 0"}>
            {_.startCase(label)}
          </StyledText>
          <StyledText color={Colors.BLUE_WHALE}>{percentOfTotal}%</StyledText>
        </RowSection>
        {childPartFormatted && childPartPercent !== undefined && (
          <RowSection>
            <StyledText isThin fontSize={"10px"}>
              {childPartFormatted.getPrettyWithUnit(true)} ({childPartPercent}%)
            </StyledText>
          </RowSection>
        )}
        <RowSection>
          {percentOfThreshold && <StyledText fontSize={"10px"}>({percentOfThreshold}%)</StyledText>}
          {thresholdFormatted ? (
            <>
              <StyledText color={color} margin={"0 0 0 3px"}>
                {thresholdFormatted.unit !== formattedValue.unit
                  ? formattedValue.getPrettyWithUnit(true)
                  : formattedValue.getPretty()}
              </StyledText>
              <StyledText fontSize={"10px"} margin={"0 0 0 3px"}>
                /{thresholdFormatted.getPrettyWithUnit(true)}
              </StyledText>
            </>
          ) : (
            <StyledText color={color}>{formattedValue.getPrettyWithUnit(true)}</StyledText>
          )}
        </RowSection>
      </Row>
      <UtilizationBar
        disableTooltip
        animate
        isLarge
        isAllPattern={props.colorPattern}
        reserved={threshold?.value}
        value={value}
        childPart={childPart}
        relativePeak={peak}
        color={color}
      />
    </DistributionUtilizationBarsView>
  );
};
