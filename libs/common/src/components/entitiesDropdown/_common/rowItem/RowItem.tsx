import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../../utils/logger";
import { ColoredCircle } from "../../../styled/ColoredCircle";
import { ImageWithFallback } from "../../../imageWithFallback/ImageWithFallback";
import { SelectionModeEnum } from "../../../../utils/hierarchyUtils";
import { DropdownEntity } from "../../_domain/dropdownEntity";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const RowItemView = styled.div<{ selection?: SelectionModeEnum }>`
  display: flex;
  align-items: center;
  margin-bottom: 1px;
  font-weight: ${(props) => (props.selection === SelectionModeEnum.SELECTED ? 600 : 500)};
  flex: 1 1 auto;
  // min-width being set is necessary for truncated flex children
  // https://css-tricks.com/flexbox-truncated-text/#the-solution-is-min-width-0-on-the-flex-child
  min-width: 0;
`;

const ImageIcon = styled(ImageWithFallback)`
  text-align: center;
  width: 1rem;
  margin-right: 0.5em;
`;

const Title = styled.div`
  flex: 1 1 auto;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const StatusText = styled.span`
  margin-left: auto;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  entity: DropdownEntity;
  // appears at the right, can be used as a sub value / status / children count
  statusText?: string;
  // will cause a colored circle to appear instead of icon (will override icon)
  color?: string;
  className?: string;
}

//endregion [[ Props ]]
export const RowItem = ({ entity: { label, selection, icon }, color, statusText, ...props }: Props) => {
  return (
    <RowItemView selection={selection} className={props.className}>
      {color && <ColoredCircle color={color} />}
      {icon() && <ImageIcon imagePath={icon()?.toString() || ""} fallbackElement={<span>...</span>} />}
      <Title>{label}</Title>
      {statusText && <StatusText>{statusText}</StatusText>}
    </RowItemView>
  );
};
