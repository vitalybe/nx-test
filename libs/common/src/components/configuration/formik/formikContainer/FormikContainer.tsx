// eslint-disable-next-line unused-imports/no-unused-vars
import * as React from "react";
import { ReactChild, useEffect } from "react";
import styled from "styled-components";
import { ConfigurationStyles } from "../../_styles/configurationStyles";
import { lighten } from "polished";
import { SmallTitle } from "../../_styles/configurationCommon";
import { Form, Formik, FormikActions, FormikProps } from "formik";
import { CommonColors } from "../../../../styling/commonColors";
import { TextTooltip } from "../../../textTooltip/TextTooltip";
import { LoadingSpinner } from "../../../loadingSpinner/loadingSpinner/LoadingSpinner";
import { Notifier } from "../../../../utils/notifications/notifier";
import _ from "lodash";
import { FormikConfig } from "formik/dist/types";

const FormikContainerView = styled.div<{ paddingTop?: string }>`
  background: ${ConfigurationStyles.COLOR_BACKGROUND};
  box-shadow: ${ConfigurationStyles.SHADOW};
  padding-top: ${(props) => props.paddingTop ?? "40px"};
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;

  overflow: hidden;
`;

const Title = styled(SmallTitle)`
  width: fit-content;
  background: ${ConfigurationStyles.COLOR_BACKGROUND};
  margin-bottom: 0.5em;
`;

const TitlesContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

export const Content = styled.div`
  flex: 1;
  padding: 1em;
  overflow-y: auto;
`;

const FormStyled = styled(Form)`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Error = styled.div`
  color: red;
  margin-top: 0;
  padding: 0.5em 1em 0;
`;

const StatusContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 6;
`;

const StatusBackground = styled.div<{}>`
  background-color: white;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  opacity: 0.5;
`;

const BottomButton = styled.div`
  display: flex;
  margin-top: 1em;
  justify-content: flex-end;
  padding: 1em;
`;
const Button = styled.button`
  width: 100px;
  padding: 0.5em 0;
  margin-left: 1em;
  border-radius: 5px;
  background: ${CommonColors.MATISSE};
  border: 0;
  color: ${CommonColors.MYSTIC_2};
  outline: 0;
  cursor: pointer;

  &:hover {
    background: ${lighten(0.1, CommonColors.MATISSE)};
  }

  &:active {
    background: ${lighten(0.2, CommonColors.MATISSE)};
  }

  &:disabled {
    background-color: ${CommonColors.SILVER_SAND};
    cursor: initial;
  }
`;

export interface OverrideButtons<T> {
  label: string;
  onClick: (values: T) => void;
  canDisabled?: boolean;
  disabledTooltip?: string;
}

export interface Props<T> {
  title: string[] | string;
  isEdit: boolean;
  isView?: boolean;
  initialValues: T;
  onOk: (values: T) => Promise<void>;
  onCancel: () => void;

  overrideButtons?: OverrideButtons<T>[];

  okLabel?: string;
  cancelLabel?: string;
  error?: string;
  isLoading?: boolean;
  validateOnBlur?: boolean;
  validate?: (values: T) => { [key: string]: string } | Promise<{ [key: string]: string }>;
  validationSchema?: unknown | (() => unknown);
  initialValidation?: boolean;
  children: (formikProps: FormikProps<T>) => ReactChild[] | ReactChild | undefined;

  formikProps?: Partial<FormikConfig<T>>;

  className?: string;
}

const PADDING_PER_TITLE = 20;

export const FormikContainer = <T extends unknown>(props: Props<T>) => {
  const formRef = React.createRef<Formik<T>>();

  useEffect(() => {
    if (props.initialValidation && formRef.current !== null) {
      formRef.current.validateForm(formRef.current.initialValues);
    }
  }, [formRef, props.initialValidation]);

  const titles = _.isArray(props.title) ? props.title : [props.title];

  const onSubmit = async (values: T, formikActions: FormikActions<T>) => {
    try {
      await props.onOk(values);
    } catch (e) {
      Notifier.warn("Operation failed", e);
    } finally {
      formikActions.setSubmitting(false);
    }
  };

  return (
    <FormikContainerView paddingTop={titles.length * PADDING_PER_TITLE + "px"} className={props.className}>
      <TitlesContainer>
        {titles?.map((title, index) => (
          <Title key={index}>{title}</Title>
        ))}
      </TitlesContainer>
      <Formik<T>
        onSubmit={onSubmit}
        initialValues={props.initialValues}
        enableReinitialize={true}
        validate={props.validate}
        validateOnBlur={props.validateOnBlur !== undefined ? props.validateOnBlur : false}
        validationSchema={props.validationSchema}
        ref={formRef}
        {...props.formikProps}>
        {(formikProps: FormikProps<T>) => {
          const isValid = formikProps.isValid;
          const errors = Object.values(formikProps.errors);

          return (
            <FormStyled>
              <Content>{props.children(formikProps)}</Content>
              {formikProps.isSubmitting && (
                <StatusContainer>
                  <StatusBackground />
                  <LoadingSpinner />
                </StatusContainer>
              )}
              {props.error && <Error>{props.error}</Error>}

              <BottomButton>
                {props.overrideButtons &&
                  props.overrideButtons.map((button) => (
                    <TextTooltip
                      key={button.label}
                      content={button.disabledTooltip ?? errors.join("\n")}
                      isEnabled={!!button.canDisabled && !isValid && Object.keys(errors).length > 0}>
                      <div>
                        <Button
                          onClick={() => button.onClick(formikProps.values)}
                          disabled={
                            button.canDisabled &&
                            (props.isLoading ||
                              formikProps.isSubmitting ||
                              (!isValid && Object.keys(errors).length > 0))
                          }>
                          {button.label}
                        </Button>
                      </div>
                    </TextTooltip>
                  ))}

                {!props.overrideButtons && (
                  <>
                    {/* NOTE: type="button" is required to prevent submit per https://stackoverflow.com/questions/932653/how-to-prevent-buttons-from-submitting-forms */}
                    <Button type={"button"} onClick={props.onCancel}>
                      {props.cancelLabel ?? "Cancel"}
                    </Button>

                    {/* disabled button doesn't work with tooltip, div solves that */}
                    {!props.isView && (
                      <TextTooltip content={errors.join("\n")} isEnabled={!isValid && Object.keys(errors).length > 0}>
                        <div>
                          <Button
                            type={"submit"}
                            disabled={
                              props.isLoading ||
                              formikProps.isSubmitting ||
                              (!isValid && Object.keys(errors).length > 0)
                            }>
                            {props.okLabel ? props.okLabel : props.isEdit ? "Save" : "Create"}
                          </Button>
                        </div>
                      </TextTooltip>
                    )}
                  </>
                )}
              </BottomButton>
            </FormStyled>
          );
        }}
      </Formik>
    </FormikContainerView>
  );
};
