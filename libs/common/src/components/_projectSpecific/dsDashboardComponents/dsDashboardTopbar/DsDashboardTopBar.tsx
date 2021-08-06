import * as React from "react";
import { memo, ReactChild } from "react";
import styled from "styled-components";
import { DescriptionRow, Metric, Unit, Value, ValueRow } from "../../../metrics/Metric";
import { CommonColors as Colors } from "../../../../styling/commonColors";
import { UnitNameEnum, UnitsFormatterResult } from "../../../../utils/unitsFormatter";
import { CssAnimations } from "../../../../styling/animations/cssAnimations";

export interface MetricData {
  value?: UnitsFormatterResult;
  description: string;
  iconComponent?: ReactChild;
}

//region [[ Styles ]]

export const DsDashboardMetric = styled(Metric)<{ isLargeUnitFontSize?: boolean; value?: string }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  color: ${Colors.CHATHAMS_BLUE};
  padding: 8px;
  cursor: default;
  min-height: 61px;
  &:focus {
    outline: none;
  }
  ${ValueRow} {
    animation: 1s ease-in forwards ${CssAnimations.FADE_SLIDE_DOWN};
  }
  ${Value} {
    font-size: 1.4rem;
    font-weight: 600;
  }
  ${Unit} {
    font-size: ${(props) => (props.isLargeUnitFontSize ? "1.4rem" : "0.75rem")};
    font-weight: ${(props) => (props.isLargeUnitFontSize ? 600 : 300)};
  }
  ${DescriptionRow} {
    color: ${Colors.GLACIER};
    font-size: 0.625rem;
    text-transform: uppercase;
    font-weight: 300;
    height: 20px;
    opacity: ${(props) => (props.value ? 1 : 0.6)};
    animation: 1s ease-in ${CssAnimations.FADE_SLIDE_IN};
    transition: 1s ease-in;
  }
`;

const Title = styled.span`
  padding: 4px;
  font-size: 1.4rem;
  text-transform: uppercase;
`;

const SubTitle = styled.span`
  padding: 4px;
  font-size: 0.75rem;
  text-transform: uppercase;
`;

const Section = styled.div<{ direction?: string; align?: string; justify?: string }>`
  display: flex;
  flex-direction: ${({ direction }) => direction};
  align-items: ${({ align }) => align};
  justify-content: ${({ justify }) => justify};
`;

const TopBarView = styled.div<{}>`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  width: 100%;
  padding: 24px 24px 0;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  metrics: MetricData[];
  titleComponent?: JSX.Element;
  subTitle?: string;
  additionalMetricsComponent?: JSX.Element;
  rightSectionComponent?: JSX.Element;
  className?: string;
}

//endregion [[ Props ]]

export const DsDashboardTopBar = memo(
  ({ metrics, titleComponent, subTitle, additionalMetricsComponent, rightSectionComponent, ...props }: Props) => {
    return (
      <TopBarView className={props.className}>
        <Section direction={"column"}>
          {titleComponent !== undefined ? titleComponent : <Title>delivery services</Title>}
          {subTitle && <SubTitle>{subTitle}</SubTitle>}
        </Section>

        <Section justify={"center"}>
          {additionalMetricsComponent || null}
          {metrics.map((metric) => (
            <DsDashboardMetric
              isLargeUnitFontSize={metric.value?.unit === UnitNameEnum.PERCENT}
              key={metric.description}
              value={metric.value?.getPretty()}
              units={metric.value?.unit}
              iconComponent={metric.iconComponent}
              description={metric.description}
            />
          ))}
        </Section>

        <Section justify={"flex-end"} align={"center"}>
          {rightSectionComponent || null}
        </Section>
      </TopBarView>
    );
  }
);
