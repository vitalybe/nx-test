import * as React from "react";
import styled from "styled-components";
import { CommonColors as Colors } from "common/styling/commonColors";
import { Utils } from "common/utils/utils";
import { UnitKindEnum, unitsFormatter } from "common/utils/unitsFormatter";

//region [[ Styles ]]

const PercentLabel = styled.span`
  font-weight: 900;
  font-size: 28px;
  margin-bottom: 10px;
`;

const PartValueSpn = styled.span<{ color: string }>`
  color: ${({ color }) => color};
  font-size: 16px;
  font-weight: 600;
  flex: 0 0 auto;
  white-space: nowrap;
`;

const ThresholdValueSpn = styled.span`
  color: ${Colors.BLUE_WHALE};
  font-size: 12px;
  font-weight: 600;
  flex: 0 0 auto;
`;

const PercentOfThresholdSpn = styled(ThresholdValueSpn)`
  width: 100%;
  text-align: center;
  margin-top: 4px;
`;
const NoWrapContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-end;
  justify-content: center;
`;

const AdditionalValues = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: column;
`;

const TextValuesView = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  value: number;
  percent: number;
  unit?: UnitKindEnum;
  // configured reserved for example
  thresholdValue?: number;
  // parent value if showing a child part
  containerValue?: number;
  color: string;
  className?: string;
}

//endregion [[ Props ]]

export const TextValues = ({
  value,
  percent,
  unit = UnitKindEnum.COUNT,
  thresholdValue,
  containerValue,
  color,
  ...props
}: Props) => {
  const partValueFormatted = unitsFormatter.format(value, unit);
  const thresholdValueFormatted = thresholdValue && unitsFormatter.format(thresholdValue, unit);
  const percentOfThreshold = thresholdValue && Utils.calcPercent(value, thresholdValue);
  const containerValueFormatted = !!containerValue && unitsFormatter.format(containerValue, unit);
  return (
    <TextValuesView className={props.className}>
      <PercentLabel>{percent}%</PercentLabel>
      {!thresholdValueFormatted ? (
        <PartValueSpn color={color}>
          {!containerValueFormatted || partValueFormatted.unit !== containerValueFormatted.unit
            ? partValueFormatted.getPrettyWithUnit(true)
            : partValueFormatted.getPretty()}
          {containerValueFormatted && "/" + containerValueFormatted.getPrettyWithUnit(true)}
        </PartValueSpn>
      ) : (
        <AdditionalValues>
          <NoWrapContainer>
            <PartValueSpn color={color}>
              {partValueFormatted.unit !== thresholdValueFormatted.unit
                ? partValueFormatted.getPrettyWithUnit(true)
                : partValueFormatted.getPretty()}
            </PartValueSpn>
            <ThresholdValueSpn>/{thresholdValueFormatted.getPrettyWithUnit(true)}</ThresholdValueSpn>
          </NoWrapContainer>
          <PercentOfThresholdSpn>({percentOfThreshold}%)</PercentOfThresholdSpn>
        </AdditionalValues>
      )}
    </TextValuesView>
  );
};
