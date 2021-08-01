import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { Checkbox } from "common/components/checkbox/Checkbox";
import { ReactNode } from "react";
import { TextTooltip } from "common/components/textTooltip/TextTooltip";
import { CommonColors } from "common/styling/commonColors";
import { Field, FieldProps } from "formik";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const FieldWithCheckboxView = styled.div`
  display: flex;
  width: 100%;
  flex: 1;
  align-items: flex-start;
`;

const ContentContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const CheckboxStyled = styled(Checkbox)`
  margin-right: 0.5em;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  name: string;
  disabled?: boolean;
  disabledTooltip?: string;
  children: ReactNode;
  className?: string;
}

//endregion [[ Props ]]

export const FieldWithCheckbox = (props: Props) => {
  return (
    <FieldWithCheckboxView className={props.className}>
      <ContentContainer>
        <TextTooltip content={props.disabledTooltip ?? ""} isEnabled={props.disabled}>
          <Field name={props.name}>
            {(fieldProps: FieldProps) => {
              const value = fieldProps.field.value;
              return (
                <CheckboxStyled
                  isChecked={!value}
                  isDisabled={props.disabled}
                  onClick={() => fieldProps.form.setFieldValue(fieldProps.field.name, !value)}
                  borderColor={CommonColors.HALF_BAKED}
                  checkColor={CommonColors.NAVY_8}
                />
              );
            }}
          </Field>
        </TextTooltip>
        {props.children}
      </ContentContainer>
    </FieldWithCheckboxView>
  );
};
