import { CommonDsEntity } from "../../_domain/commonDsEntity";
import { UnitKindEnum, unitsFormatter } from "../../../../../utils/unitsFormatter";
import { Cell } from "../_styles/cell";
import { UtilizationBar } from "../../../../utilizationBar/UtilizationBar";
import * as React from "react";
import styled from "styled-components";
import { GridReactRenderer, ReactRendererProps } from "../../../../qwiltGrid/QwiltGrid";

const UnitSpn = styled.span`
  font-weight: 500;
  font-size: 0.625rem;
`;

const ValueSpn = styled.span`
  font-weight: 600;
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

export function getBandwidthCellRenderer() {
  return new GridReactRenderer({
    valueGetter: (entity) => entity.peakBandwidth?.toString() ?? "0",
    reactRender: (props: ReactRendererProps<CommonDsEntity>) => {
      const entity = props.entity;
      const value = entity.peakBandwidth ?? 0;
      const formattedValue = unitsFormatter.format(value, UnitKindEnum.TRAFFIC);
      const relativePeak: number | undefined = getRelativePeak(entity);
      const reserved = entity.reservedBandwidth;
      const formattedPercent = reserved && unitsFormatter.format((value / reserved) * 100, UnitKindEnum.PERCENT);

      return (
        <Cell direction={"column"} align={"flex-start"} justify={"center"} lineHeight={"normal"}>
          <Row>
            <ValueSpn>
              {formattedValue.getPretty()} <UnitSpn>{formattedValue.unit}</UnitSpn>
            </ValueSpn>
            {formattedPercent && <ValueSpn>({formattedPercent.getPrettyWithUnit()})</ValueSpn>}
          </Row>
          <UtilizationBar color={entity.themeColor} value={value} relativePeak={relativePeak} reserved={reserved} />
        </Cell>
      );
    },
  });
}

function getRelativePeak(entity: CommonDsEntity): number | undefined {
  if (entity.parent) {
    return getRelativePeak(entity.parent);
  }
  return Math.max(entity.reservedBandwidth || -1, entity.peakBandwidth || -1);
}
