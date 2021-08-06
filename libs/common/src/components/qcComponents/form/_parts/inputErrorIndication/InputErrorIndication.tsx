import * as React from "react";
import { useContext } from "react";
import styled from "styled-components";
import { CommonColors } from "../../../../../styling/commonColors";
import { CssAnimations } from "../../../../../styling/animations/cssAnimations";
import { Tooltip } from "../../../../Tooltip";
import { GlobalFontContext } from "../../../../GlobalFontProvider";
import { ErrorIndication } from "../../../errorIndication/ErrorIndication";

//region [[ Styles ]]
const ErrorTooltipContent = styled.div`
  padding: 0.5rem;
  background-color: ${CommonColors.RADICAL_RED};
  color: white;
  font-weight: 600;
  font-size: 0.75rem;
`;

export const ErrorIndicationIconAbsolute = styled(ErrorIndication)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0.5rem;
  animation: ${CssAnimations.SLIDE_DOWN} 600ms ease-in-out forwards;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  message: string;
  className?: string;
}

//endregion [[ Props ]]

export const InputErrorIndication = (props: Props) => {
  const font = useContext(GlobalFontContext);

  return (
    <Tooltip
      arrow={false}
      placement={"bottom-end"}
      distance={font.remToPixels(1.25)}
      content={<ErrorTooltipContent>{props.message}</ErrorTooltipContent>}>
      <ErrorIndicationIconAbsolute className={props.className} />
    </Tooltip>
  );
};
