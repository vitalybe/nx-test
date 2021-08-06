import * as React from "react";
import styled from "styled-components";
import { CommonColors as Colors } from "../../../styling/commonColors";
import { ReservedThreshold } from "../_parts/ReservedThreshold";
import { UnitKindEnum, unitsFormatter } from "../../../utils/unitsFormatter";
import { ColoredDiv } from "../../styled/ColoredDiv";

//region [[ Styles ]]

const Title = styled.span`
  font-size: 14px;
`;

const ValueSpn = styled.span<{ fontSize?: string; isBold?: boolean; gap?: string }>`
  font-size: ${(props) => props.fontSize || "12px"};
  font-weight: ${(props) => (props.isBold ? 600 : 500)};
  flex: 1 1 auto;
  &:not(:last-child) {
    margin-right: ${(props) => props.gap || "12px"};
  }
`;

const ValuesPair = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Label = styled.span``;

const Square = styled(ColoredDiv)`
  position: relative;
  display: flex;
  align-items: center;
  background-color: ${(props) => props.color};
  width: 10px;
  height: 10px;
  border-radius: 2px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  margin: 6px 0;
  align-items: center;
  justify-content: space-between;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 19px 3fr 100px;
  margin: 6px 0;
  align-items: center;
`;

const UtilizationTooltipView = styled.div<{ width: string }>`
  text-transform: capitalize;
  padding: 16px;
  width: ${(props) => props.width};
  text-align: start;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  color: string;
  value: number;
  reserved?: number;
  maxCapacity?: number;
  className?: string;
}

//endregion [[ Props ]]

export const UtilizationTooltip = ({ color, value, reserved, maxCapacity, ...props }: Props) => {
  return (
    <UtilizationTooltipView className={props.className} width={reserved || maxCapacity ? "300px" : "150px"}>
      <Header>
        <Title>total{maxCapacity && <b>/max</b>}</Title>
        <ValuesPair>
          <ValueSpn fontSize={"14px"} gap={"8px"}>
            {getFormatted(value, undefined, maxCapacity === undefined)}
            {maxCapacity && <b>/{getFormatted(maxCapacity)}</b>}
          </ValueSpn>
          {maxCapacity && (
            <ValueSpn isBold fontSize={"14px"}>
              {getFormatted((value / maxCapacity) * 100, UnitKindEnum.PERCENT)}
            </ValueSpn>
          )}
        </ValuesPair>
      </Header>
      {reserved && (
        <Content>
          <Row>
            <Square color={Colors.PATTENS_BLUE}>
              <ReservedThreshold reservedPercent={100} />
            </Square>
            <Label>configured reserved</Label>
            <ValueSpn>{getFormatted(reserved)}</ValueSpn>
          </Row>
          <Row>
            <Square color={color} />
            <Label>reserved</Label>
            <ValuesPair>
              <ValueSpn>{getFormatted(Math.min(value, reserved))}</ValueSpn>
              <ValueSpn isBold>{getFormatted(Math.min((value / reserved) * 100, 100), UnitKindEnum.PERCENT)}</ValueSpn>
            </ValuesPair>
          </Row>
          {value > reserved && (
            <Row>
              <Square color={color} isPattern />
              <Label>non - reserved</Label>
              <ValuesPair>
                <ValueSpn>{getFormatted(value - reserved)}</ValueSpn>
                <ValueSpn isBold>{getFormatted(((value - reserved) / reserved) * 100, UnitKindEnum.PERCENT)}</ValueSpn>
              </ValuesPair>
            </Row>
          )}
        </Content>
      )}
    </UtilizationTooltipView>
  );
};

function getFormatted(value: number, unit = UnitKindEnum.TRAFFIC, showUnit = true) {
  return showUnit
    ? unitsFormatter.format(value, unit).getPrettyWithUnit()
    : unitsFormatter.format(value, unit).getPretty();
}
