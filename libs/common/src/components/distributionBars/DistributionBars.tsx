import * as React from "react";
import styled from "styled-components";
import * as _ from "lodash";
import { PercentBar } from "../percentBar/PercentBar";
import { UnitKindEnum } from "../../utils/unitsFormatter";
import { DistributionUtilizationBar } from "./_parts/distibutionUtilizationBar/DistributionUtilizationBar";
import { CommonColors } from "../../styling/commonColors";

//region [[ Styles ]]
const Title = styled.span`
  color: ${CommonColors.BLUE_WHALE};
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 24px;
`;
const HorizontalDistributionBarsView = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  width: 100%;
`;

const VerticalDistributionBarsView = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-evenly;
  padding: 0 9px;
  border-bottom: 1px solid rgba(140, 164, 173, 0.23);
  min-height: 130px;
`;

//endregion
export interface DistributionPartInfo {
  key?: string;
  value: number;
  qwiltValue?: number;
  originValue?: number;
  label: string;
  color: string;
  colorPattern?: boolean;
  unit?: UnitKindEnum;
  disabled?: boolean;
  childPart?: Omit<DistributionPartInfo, "childPart">;
  threshold?:
    | {
        value: number;
        label: string;
      }
    | undefined;
}

export interface Props {
  parts: DistributionPartInfo[];
  title?: string;
  isHorizontal?: boolean;
  relativePeak?: number;
  relativeTotal?: number;
  className?: string;
}

export const DistributionBars = ({ parts, title, relativePeak, relativeTotal, ...props }: Props) => {
  const peak = relativePeak ?? _.max(parts.map((part) => part.value));
  const total = relativeTotal ?? _.sumBy(parts, ({ value }) => value) ?? 0;

  return props.isHorizontal ? (
    <HorizontalDistributionBarsView className={props.className}>
      {title && <Title>{title}</Title>}
      {parts.length > 0 &&
        parts.map((part) => <DistributionUtilizationBar {...part} key={part.label} total={total} peak={peak ?? 0} />)}
    </HorizontalDistributionBarsView>
  ) : (
    <VerticalDistributionBarsView className={props.className}>
      {parts.length > 0 &&
        parts.map((part) => <PercentBar {...part} key={part.label} total={total} maxSiblingValue={peak ?? 0} />)}
    </VerticalDistributionBarsView>
  );
};
