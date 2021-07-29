import * as React from "react";
import { UnitKindEnum, unitsFormatter } from "common/utils/unitsFormatter";
import { CommonDsEntity } from "common/components/_projectSpecific/dsDashboardComponents/_domain/commonDsEntity";
import { CommonColors as Colors } from "common/styling/commonColors";
import { Tooltip } from "common/components/Tooltip";
import styled, { css } from "styled-components";
import { SvgPieChart } from "common/components/_projectSpecific/dsDashboardComponents/dsGrid/_parts/svgPieChart/SvgPieChart";
import { transparentize } from "polished";
import { IconImg } from "common/components/_projectSpecific/dsDashboardComponents/dsGrid/_styles/iconImg";
import { Cell } from "common/components/_projectSpecific/dsDashboardComponents/dsGrid/_styles/cell";
import { GridReactRenderer } from "common/components/qwiltGrid/QwiltGrid";
import { TextTooltip } from "common/components/textTooltip/TextTooltip";

const pieChartIcon = require("common/images/dsDashboardImages/pie-chart.svg");

const SvgPieChartStyled = styled(SvgPieChart)`
  width: 200px;
`;

const ErrorPercentSpn = styled.span<{ color?: string }>`
  color: ${({ color }) => (color ? "white" : "inherit")};
  background-color: ${({ color }) => (color ? transparentize(0.25, color) : "transparent")};
  border: 1px solid ${({ color }) => color || "transparent"};
  border-radius: 2px;
  width: 2.25rem;
  height: 1.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
`;

const textTooltipCustomCss = css`
  font-size: 0.75rem;
`;

export function getErrorCodesCellRenderer(type: "4xx" | "5xx") {
  return new GridReactRenderer<CommonDsEntity>({
    valueGetter: (entity) => {
      return entity.errorCodes?.[type].toString() ?? "";
    },
    reactRender: ({ entity }) => {
      const value = entity.errorCodes?.[type] || 0;
      const formattedValue = unitsFormatter.format(value, UnitKindEnum.PERCENT, 0);
      const color = value < 50 ? Colors.MOUNTAIN_MEADOW : Colors.RADICAL_RED;
      return (
        <Cell align={"center"} justify={"center"}>
          <TextTooltip
            ignoreBoundaries
            textCss={textTooltipCustomCss}
            content={`Percent of ${type} transactions\nfrom overall transactions`}>
            <ErrorPercentSpn color={color}>{value > 0 ? formattedValue.getPrettyWithUnit() : "0%"}</ErrorPercentSpn>
          </TextTooltip>
          {entity.errorCodes?.breakdown && (
            <Tooltip
              ignoreBoundaries
              content={
                <SvgPieChartStyled
                  unitType={UnitKindEnum.PERCENT}
                  parts={[
                    {
                      value: entity.errorCodes?.breakdown?.nonCachedOrigin[type] || 0,
                      color: Colors.TANGERINE_YELLOW,
                      name: "Origin Non Cached",
                    },
                    {
                      value: entity.errorCodes?.breakdown?.cached[type] || 0,
                      color: Colors.DEEP_SKY_BLUE,
                      name: "Origin Cached",
                    },
                    {
                      value: entity.errorCodes?.breakdown?.nonCachedQwilt[type] || 0,
                      color: Colors.MALIBU,
                      name: "Qwilt Non Cached",
                    },
                  ]}
                />
              }>
              <IconImg src={pieChartIcon} alt={"error codes pie chart"} />
            </Tooltip>
          )}
        </Cell>
      );
    },
  });
}
