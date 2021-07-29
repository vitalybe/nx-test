import * as React from "react";
import { ReactChild, ReactNode, RefObject, useEffect } from "react";
import styled, { css } from "styled-components";
import { observer } from "mobx-react-lite";
import { CommonColors } from "common/styling/commonColors";
import { Clickable } from "common/components/configuration/clickable/Clickable";
import { TextTooltip } from "common/components/textTooltip/TextTooltip";
import { ConfigurationStyles } from "common/components/configuration/_styles/configurationStyles";
import { CommonStyles } from "common/styling/commonStyles";
import { OverflowingText } from "common/components/overflowingText/OverflowingText";
import { Checkbox } from "common/components/checkbox/Checkbox";

const ItemWithActionsView = styled.div<{ disabled: boolean; isSelectable: boolean; isSelected: boolean }>`
  display: flex;
  padding: 0.5em 0.6em;
  justify-content: space-between;
  border-radius: 5px;
  ${(props) =>
    CommonStyles.clickableSelectableStyle(
      "background-color",
      CommonColors.HALF_BAKED,
      "rgba(0,0,0,0)",
      props.isSelected,
      {
        isDisabled: props.disabled,
        disabledColor: CommonColors.GRAY_2,
      }
    )};
`;

const HeaderContainer = styled.div`
  display: flex;
  min-width: 0;
  align-items: center;
`;

const TitlesContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 100px;
`;

const MainTitleContainer = styled.div`
  display: flex;
  gap: 5px;
`;

const Title = styled(OverflowingText)<{ isSelected: boolean; color: string }>`
  color: ${(props) => props.color};
  opacity: 1;
  font-weight: ${(props) => (props.isSelected ? "bold" : "normal")};
`;

const Subtitle = styled.span<{ isSelected: boolean; color: string }>`
  color: ${(props) => props.color};
  white-space: nowrap;
  overflow: hidden;

  opacity: 1;
  text-overflow: ellipsis;
  font-size: 12px;

  font-weight: ${(props) => (props.isSelected ? "bold" : "normal")};
`;

const TitleAddition = styled(OverflowingText)<{ isSelected: boolean }>`
  color: ${CommonColors.NEVADA};
  font-weight: ${(props) => (props.isSelected ? "bold" : "normal")};
  font-size: 0.625rem;
`;

const ActionButtonsList = styled.div<{ isSelected: boolean; disabled: boolean }>`
  display: flex;
  align-items: center;
  opacity: ${(props) => (props.isSelected ? "1" : "0.8")};

  ${(props) =>
    !props.disabled &&
    css`
      ${ItemWithActionsView}:hover & {
        opacity: 1;
        transition: opacity 0.5s ease;
      }
    `};
`;

const ActionButton = styled(Clickable)`
  margin-left: 0.5em;

  &:focus {
    outline: none;
  }
`;

const CheckboxStyled = styled(Checkbox)`
  margin-right: 5px;
`;

export interface ActionButtonInterface {
  icon: JSX.Element;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  isDisabled?: boolean;
  isVisible?: boolean;
  disabledTooltip?: string;
  tooltip?: string;
  disableBubbling?: boolean;
}

export interface Props {
  title: string;
  titleAddition?: string;
  subtitle?: string;
  actionButtons?: ActionButtonInterface[];
  icon?: ReactNode;
  disabled?: boolean;
  color?: string;
  childrenBeforeButtons?: ReactChild[] | ReactChild | undefined;
  alwaysShowButtons?: boolean;
  checkbox?: {
    isChecked: boolean;
    isDisabled: boolean;
    onCheck: () => void;
  };

  isSelected?: boolean;
  isSelectable?: boolean;

  onClick?: (event: React.MouseEvent<HTMLElement>) => void;

  className?: string;
}

export const ItemWithActions = observer((props: Props) => {
  const itemRef: RefObject<HTMLDivElement> = React.createRef();

  const actionButtonHandleBubbling = (actionButton: ActionButtonInterface, event: React.MouseEvent<HTMLElement>) => {
    if (actionButton.disableBubbling) {
      event.preventDefault();
      event.stopPropagation();
    }
    actionButton.onClick(event);
  };

  const handleBubbling = (event: React.MouseEvent<HTMLElement>, action?: () => void) => {
    event.preventDefault();
    event.stopPropagation();
    action?.();
  };

  useEffect(() => {
    if (props.isSelected && itemRef.current) {
      itemRef.current.scrollIntoView();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let titleColor = CommonColors.BLACK;
  if (props.disabled) {
    titleColor = ConfigurationStyles.COLOR_SILVER_SAND;
  } else if (props.color) {
    titleColor = props.color;
  }

  return (
    <ItemWithActionsView
      ref={itemRef}
      disabled={!!props.disabled}
      className={props.className}
      isSelectable={!!props.isSelectable}
      isSelected={!!props.isSelected}
      onClick={props.onClick}>
      <HeaderContainer>
        {props.checkbox && (
          <CheckboxStyled
            isDisabled={props.checkbox?.isDisabled}
            isChecked={props.checkbox?.isChecked}
            onClick={(event: React.MouseEvent<HTMLElement>) => handleBubbling(event, props.checkbox?.onCheck)}
          />
        )}
        {props.icon || null}
        <TitlesContainer>
          <MainTitleContainer>
            <Title color={titleColor} isSelected={!!props.isSelected}>
              {props.title}
            </Title>
            {props.titleAddition && (
              <TitleAddition isSelected={!!props.isSelected}>{props.titleAddition}</TitleAddition>
            )}
          </MainTitleContainer>
          {props.subtitle && (
            <Subtitle color={titleColor} isSelected={!!props.isSelected}>
              {props.subtitle}
            </Subtitle>
          )}
        </TitlesContainer>
      </HeaderContainer>
      {props.childrenBeforeButtons}
      {props.actionButtons && (
        <ActionButtonsList disabled={!!props.disabled} isSelected={!!props.isSelected}>
          {props.actionButtons
            ?.filter((actionButton) => !(actionButton?.isVisible === false))
            .map((actionButton, i) => {
              const isButtonDisabled = actionButton.isDisabled || !!props.disabled;
              const tooltipContent = (isButtonDisabled ? actionButton.disabledTooltip : actionButton.tooltip) ?? "";
              return (
                <TextTooltip content={tooltipContent} key={i}>
                  <ActionButton
                    key={i}
                    isDisabled={actionButton.isDisabled || props.disabled}
                    onClick={(event: React.MouseEvent<HTMLElement>) => actionButtonHandleBubbling(actionButton, event)}>
                    {actionButton.icon}
                  </ActionButton>
                </TextTooltip>
              );
            })}
        </ActionButtonsList>
      )}
    </ItemWithActionsView>
  );
});
