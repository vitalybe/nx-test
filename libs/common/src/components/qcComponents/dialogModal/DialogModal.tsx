import * as React from "react";
import { CSSProperties, ReactNode, useEffect } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { CloseButton } from "common/components/closeButton/CloseButton";
import { CssAnimations } from "common/styling/animations/cssAnimations";
import { SetterRegisterFn, useRegisteredData } from "common/utils/hooks/useRegisterSetter";
import { Shadows } from "common/styling/shadows";
import { CommonColors } from "common/styling/commonColors";
import { QwiltModalStyles } from "common/components/qwiltModal/qwiltModalStyles";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]
const CloseButtonStyled = styled(CloseButton).attrs({ color: CommonColors.NAVY_4 })`
  height: 1rem;
  width: 1rem;
  justify-self: flex-end;
`;

const DialogTitle = styled.span`
  font-size: 0.88rem;
  font-weight: 600;
  color: #2c5e7a;
  justify-self: center;
`;
const HeaderAdditionDiv = styled.div`
  display: flex;
  align-items: center;
`;
const DialogHeader = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr auto 1fr;
  width: 100%;
  padding: 1rem;
  border-bottom: 1px solid #e9e9e9;
`;

const ScrollingContainer = styled.div`
  flex: 1 1 auto;
  overflow-y: auto;
`;

const DialogModalView = styled.div`
  width: fit-content;
  min-width: 25rem;
  max-height: 90vh;
  border-radius: 8px;
  box-shadow: ${Shadows.MODAL_SHADOW};
  background-color: #ffffff;
  color: #21506e;

  display: flex;
  flex-direction: column;
  font-size: 0.875rem;
  transition: 100ms ease-in;
  animation: ${CssAnimations.DROP_DOWN_APPEAR} 400ms ease-in-out;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props<T> {
  closeCallback: () => void;
  register?: SetterRegisterFn<T | undefined>;
  initialData?: T;
  component: (data?: T) => ReactNode;
  headerAddition?: ReactNode;
  title?: string;
  titleGetter?: (data: T) => string;
  overlayBackgroundColor?: string;
  suppressShrink?: boolean;
  suppressBlur?: boolean;
  className?: string;
}

//endregion [[ Props ]]
const refreshActiveModal = () => {
  const activeModals = document.querySelectorAll(`div[id*=${QwiltModalStyles.CONTAINER_ID_PREFIX}]`);
  activeModals.forEach((modalElement) => {
    if (modalElement.id === QwiltModalStyles.CONTAINER_ID_PREFIX + activeModals.length) {
      modalElement.classList.add(QwiltModalStyles.ACTIVE_CLASS);
    } else {
      modalElement.classList.remove(QwiltModalStyles.ACTIVE_CLASS);
    }
  });
};

function setOverlayStyles(styles: CSSProperties) {
  const activeModals = document.querySelectorAll<HTMLElement>(`div[id*=${QwiltModalStyles.CONTAINER_ID_PREFIX}]`);
  activeModals.forEach((modalElement) => {
    if (modalElement.id === QwiltModalStyles.CONTAINER_ID_PREFIX + activeModals.length) {
      const overlayElement = modalElement.querySelector<HTMLElement>(`.${QwiltModalStyles.OVERLAY_COMMON_CLASS}`);
      if (overlayElement) {
        Object.assign(overlayElement.style, styles);
      }
    }
  });
}

export function DialogModal<T>({
  title,
  component,
  register,
  className = "",
  overlayBackgroundColor,
  ...props
}: Props<T>) {
  // connecting to data updates from parent renders
  const data = useRegisteredData(register, props.initialData);

  useEffect(() => {
    setOverlayStyles({ backgroundColor: overlayBackgroundColor ?? "transparent" });
  }, [overlayBackgroundColor]);

  useEffect(() => {
    refreshActiveModal();
    return () => {
      setTimeout(refreshActiveModal);
    };
  }, []);

  const titleText = props.titleGetter && data ? props.titleGetter(data) : title;
  const dialogClassName =
    QwiltModalStyles.DIALOG_CLASS +
    (props.suppressShrink ? ` ${QwiltModalStyles.DIALOG_SUPPRESS_SHRINK}` : "") +
    (props.suppressBlur ? ` ${QwiltModalStyles.DIALOG_SUPPRESS_BLUR}` : "");

  return (
    <DialogModalView className={`${dialogClassName} ${className ?? ""}`}>
      <DialogHeader>
        <HeaderAdditionDiv>{props.headerAddition}</HeaderAdditionDiv>
        {titleText && <DialogTitle>{titleText}</DialogTitle>}
        <CloseButtonStyled onClick={() => props.closeCallback()} />
      </DialogHeader>
      <ScrollingContainer>{component(data)}</ScrollingContainer>
    </DialogModalView>
  );
}
