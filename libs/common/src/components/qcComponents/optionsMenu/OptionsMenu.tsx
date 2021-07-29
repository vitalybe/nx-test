import * as React from "react";
import styled from "styled-components";
import { darken, transparentize } from "polished";
import { Tooltip, useTooltip } from "../../Tooltip";
import { Placement } from "tippy.js";
import { loggerCreator } from "common/utils/logger";
import { CommonColors } from "common/styling/commonColors";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]
const OptionItem = styled.div`
  width: 100%;
  transition: 200ms linear;
  text-align: start;
  padding: 0.75rem 1rem;
  cursor: pointer;

  &:hover {
    background-color: ${transparentize(0.97, CommonColors.NAVY_2)};
  }
`;
const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  border-right: 6px;
  width: 210px;
`;
const MenuIconDot = styled.div`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  transition: 200ms linear;
  &:not(:last-child) {
    margin-bottom: 2px;
  }
`;
const MenuIconView = styled.div<{ isHighlighted?: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 0 6px;
  margin: 0;
  cursor: pointer;
  width: fit-content;

  opacity: ${(props) => (props.isHighlighted ? "1 !important" : 0)};

  &:focus {
    outline: none;
  }
  ${MenuIconDot} {
    background-color: ${(props) => (props.isHighlighted ? CommonColors.ROYAL_BLUE : CommonColors.SILVER)};
  }

  &:hover {
    ${MenuIconDot} {
      background-color: ${(props) =>
        props.isHighlighted ? CommonColors.ROYAL_BLUE : darken(0.3, CommonColors.SILVER)};
    }
  }
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface MenuOptionMetadata {
  label: string;
  callback: () => void;
}

export interface Props {
  options: MenuOptionMetadata[];
  menuPlacement?: Placement;

  className?: string;
}

//endregion [[ Props ]]
const handleBubbling = (e: React.MouseEvent) => {
  e.stopPropagation();
};

export const OptionsMenu = ({ menuPlacement = "bottom-end", ...props }: Props) => {
  const { hide, isOpen, tooltipController } = useTooltip();

  return (
    <Tooltip
      trigger={"click"}
      hideOnClick={true}
      arrow={false}
      interactive={true}
      placement={menuPlacement}
      multiple={false}
      tooltipController={tooltipController}
      ignoreBoundaries
      content={
        <OptionsList onClick={handleBubbling}>
          {props.options.map(({ label, callback }) => (
            <OptionItem
              key={label}
              onClick={() => {
                callback();
                hide();
              }}>
              {label}
            </OptionItem>
          ))}
        </OptionsList>
      }>
      <MenuIconView isHighlighted={isOpen} className={props.className}>
        <MenuIconDot />
        <MenuIconDot />
        <MenuIconDot />
      </MenuIconView>
    </Tooltip>
  );
};
