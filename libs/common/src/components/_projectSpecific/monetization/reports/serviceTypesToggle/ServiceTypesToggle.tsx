import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { MetadataServiceTypeEnum } from "../../../../../backend/deliveryServices/_types/deliveryServiceMetadataTypes";
import { DsServiceTypeIconRenderer } from "common/components/svg/serviceTypes/dsServiceTypeIconRenderer/DsServiceTypeIconRenderer";
import { CommonColors } from "common/styling/commonColors";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const ServiceTypeIconStyled = styled(DsServiceTypeIconRenderer)`
  cursor: pointer;
  width: 1.75rem;
  height: 1.75rem;
`;
const ServiceTypesToggleView = styled.div`
  width: fit-content;
  display: grid;
  grid-auto-flow: column;
  grid-gap: 0.75rem;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  selectedTypes: MetadataServiceTypeEnum[];
  pickTypes?: MetadataServiceTypeEnum[];
  onChange?: (types: MetadataServiceTypeEnum[]) => void;
  className?: string;
}

//endregion [[ Props ]]

export const ServiceTypesToggle = ({ onChange, selectedTypes, pickTypes, ...props }: Props) => {
  const onToggle = (type: MetadataServiceTypeEnum) => {
    if (selectedTypes.includes(type)) {
      onChange?.(selectedTypes?.filter((t) => t !== type));
    } else {
      onChange?.([...selectedTypes, type]);
    }
  };
  return (
    <ServiceTypesToggleView className={props.className}>
      {Object.values(MetadataServiceTypeEnum)
        .filter((type) => !pickTypes || pickTypes.includes(type))
        .map((type) => {
          const isSelected = selectedTypes.includes(type);
          return (
            <ServiceTypeIconStyled
              key={type}
              type={type}
              hasTooltip
              onClick={() => onToggle(type)}
              color={isSelected ? CommonColors.ROYAL_BLUE : "transparent"}
              innerColor={isSelected ? "white" : CommonColors.ROYAL_BLUE}
            />
          );
        })}
    </ServiceTypesToggleView>
  );
};
