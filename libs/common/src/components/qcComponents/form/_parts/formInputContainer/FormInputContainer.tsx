import * as React from "react";
import { forwardRef, ReactNode } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { InputErrorIndication } from "common/components/qcComponents/form/_parts/inputErrorIndication/InputErrorIndication";
import { HelpIcon } from "common/components/svg/helpIcon/HelpIcon";
import { Tooltip } from "common/components/Tooltip";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]
const PrefixSpn = styled.span`
  position: absolute;
  left: 0.5rem;
  bottom: 0.8rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: default;
`;

export const FormInputLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
`;

const HelpTextContainer = styled.div`
  max-width: 15rem;
  padding: 0.5rem;
  font-size: 0.75rem;
`;
const HelpIconStyled = styled(HelpIcon)`
  opacity: 0.5;
  margin-left: 0.5rem;
  transition: 100ms;
  width: 0.75rem;
  height: 0.75rem;
  &:hover {
    opacity: 0.9;
  }
`;
const FormInputContainerView = styled.div<{ isDisabled?: boolean }>`
  padding: 0;
  height: 2.78rem;
  width: 100%;
  position: relative;
  opacity: ${(props) => (props.isDisabled ? 0.5 : 1)};
  cursor: ${(props) => (props.isDisabled ? "default" : "pointer")};
  pointer-events: ${(props) => (props.isDisabled ? "none" : "inherit")};
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  label?: string;
  errorMessage?: string;
  onBlur?: () => void;
  helpText?: string;
  isDisabled?: boolean;
  className?: string;
  visualPrefix?: string;
  children: ReactNode;
}

//endregion [[ Props ]]

export const FormInputContainer = forwardRef<HTMLDivElement, Props>(({ label, errorMessage, ...props }, ref) => {
  return (
    <>
      {label && (
        <FormInputLabel>
          {label}
          {props.helpText && <HelpTextIcon helpText={props.helpText} />}
        </FormInputLabel>
      )}
      <FormInputContainerView ref={ref} className={props.className} onBlur={props.onBlur} isDisabled={props.isDisabled}>
        {props.visualPrefix && <PrefixSpn>{props.visualPrefix}</PrefixSpn>}
        {errorMessage && <InputErrorIndication message={errorMessage} />}
        {props.children}
      </FormInputContainerView>
    </>
  );
});

export function HelpTextIcon(props: { helpText: string }) {
  return (
    <Tooltip content={<HelpTextContainer>{props.helpText}</HelpTextContainer>}>
      <HelpIconStyled />
    </Tooltip>
  );
}
