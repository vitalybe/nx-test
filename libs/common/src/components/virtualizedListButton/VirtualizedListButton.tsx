import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { UnitKindEnum } from "common/utils/unitsFormatter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListAlt } from "@fortawesome/free-regular-svg-icons";
import { Tooltip } from "common/components/Tooltip";
import { CommonColors } from "common/styling/commonColors";
import {
  ListItem as VirtualizedListItem,
  Row as OthersListRow,
  VirtualizedListPopup,
} from "common/components/virtualizedListButton/_parts/VirtualizedListPopup";
import { useEventCallback } from "common/utils/hooks/useEventCallback";
import { CurrencyUnitEnum } from "common/components/_projectSpecific/monetization/_utils/currencyUtils";

// region [[ Styles ]]
const VirtualizedListPopupStyled = styled(VirtualizedListPopup)`
  width: 15.625rem;
  height: 12.5rem;
  ${OthersListRow} {
    padding: 0.5rem 0.75rem;
  }
`;

const ClickableListIcon = styled(FontAwesomeIcon).attrs({ icon: faListAlt })`
  cursor: pointer;
  margin-left: 0.25rem;
  color: ${CommonColors.NERO};
  height: 1.25rem !important;
  width: 1.25rem !important;
  padding: 0.25rem !important;
  border-radius: 50%;
  opacity: 0.7;
  transform: rotateY(180deg);
  transition: 200ms ease-out;
  &:hover {
    color: ${CommonColors.BLACK_PEARL};
    background-color: ${CommonColors.PATTENS_BLUE};
  }
  &.list-open {
    color: white;
    background-color: ${CommonColors.ROYAL_BLUE};
    opacity: 1;
  }
  &:focus {
    outline: none;
  }
`;
// endregion

//region [[ Props ]]
export interface Props {
  title: string;
  relativeTotal: number;
  currency?: CurrencyUnitEnum;
  unit?: UnitKindEnum;
  data: VirtualizedListItem[];
  className?: string;
}
//endregion

export function VirtualizedListButton({ ...props }: Props) {
  const [isListOpen, setIsListOpen] = useState(false);
  const onListShowCallback = useEventCallback(() => {
    setIsListOpen(true);
  });
  const onListHideCallback = useEventCallback(() => {
    setIsListOpen(false);
  });

  return (
    <Tooltip
      trigger={"click"}
      arrow={false}
      hideOnClick
      onShow={onListShowCallback}
      onHide={onListHideCallback}
      content={
        <VirtualizedListPopupStyled
          title={props.title}
          relativeTotal={props.relativeTotal}
          currency={props.currency}
          unit={props.unit ?? UnitKindEnum.COUNT}
          childrenData={props.data}
        />
      }>
      <ClickableListIcon className={`${isListOpen ? "list-open" : ""} ${props.className}`} />
    </Tooltip>
  );
}
