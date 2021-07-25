import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faCalendarDay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ComponentTypeEnum } from "common/backend/systemEvents/_types/systemEventsTypes";
import { Checkbox } from "common/components/checkbox/Checkbox";
import { Clickable } from "common/components/configuration/clickable/Clickable";
import {
  FormikContainer,
  OverrideButtons,
} from "common/components/configuration/formik/formikContainer/FormikContainer";
import { FormikDateTimePicker } from "common/components/configuration/formik/formikDateTimePicker/FormikDateTimePicker";
import { FormikInput } from "common/components/configuration/formik/formikInput/FormikInput";
import { FormikSelect } from "common/components/configuration/formik/formikSelect/FormikSelect";
import { FormikToggle } from "common/components/configuration/formik/formikToggle/FormikToggle";
import { QwiltFormGroup } from "common/components/configuration/qwiltForm/qwiltFormGroup/QwiltFormGroup";
import { QwiltToggle } from "common/components/configuration/qwiltForm/qwiltToggle/QwiltToggle";
import { ConfigurationStyles } from "common/components/configuration/_styles/configurationStyles";
import { AffectedEntitiesDropdown } from "common/components/_projectSpecific/systemUpdatesManagement/systemUpdatesForm/affectedEntitiesDropdown/AffectedEntitiesDropdown";
import { DsDropdown } from "common/components/_projectSpecific/systemUpdatesManagement/systemUpdatesForm/dsDropdown/DsDropdown";
import { SystemUpdateInternalEntity } from "common/components/_projectSpecific/systemUpdatesManagement/_domain/systemUpdateInternalEntity";
import {
  SystemUpdateKind,
  SystemUpdateSchema,
  SystemUpdateSchemaType,
} from "common/components/_projectSpecific/systemUpdatesManagement/_domain/systemUpdateSchema";
import { SystemUpdatesUtils } from "common/components/_projectSpecific/systemUpdatesManagement/_utils/systemUpdatesUtils";
import { loggerCreator } from "common/utils/logger";
import { enumValues } from "common/utils/typescriptUtils";
import { Field, FieldProps, FormikProps } from "formik";
import { DateTime } from "luxon";
import * as React from "react";
import { ReactNode, useState } from "react";
import styled, { css } from "styled-components";
import { ValidationError } from "yup";
import { SystemUpdateFormEntity } from "../_domain/systemUpdateFormEntity";
import { CommonColors } from "common/styling/commonColors";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const SystemUpdatesFormView = styled(FormikContainer)`
  width: 100%;
  height: 100%;
` as typeof FormikContainer;

const Content = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const HelpNote = styled.div`
  color: ${CommonColors.FUN_GREEN};
  margin-bottom: 0.5rem;
`;

const BeforeFormContent = styled.div``;

const FormContent = styled.div<{ isDisabled: boolean }>`
  display: grid;
  grid-auto-flow: row;
  grid-row-gap: 1em;
  align-content: start;
  padding-right: 1rem;

  flex: 1;
  overflow-y: auto;

  ${(props) =>
    props.isDisabled &&
    css`
      opacity: 0.5;
      pointer-events: none;
    `}
`;

const KindRadios = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: max-content;
  column-gap: 2rem;
`;

const QwiltFormGroupStyled = styled(QwiltFormGroup)`
  padding-top: 1.5rem;
`;

const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  column-gap: 0.5rem;
  margin-bottom: 1rem;
`;

const RadioGroupWrapper = styled.div<{ isHighlighted: boolean }>`
  opacity: ${(props) => (props.isHighlighted ? "100%" : "50%")};
`;

const RadioText = styled.span`
  margin: 0 0.5rem;
`;

const Label = styled.div`
  color: ${ConfigurationStyles.COLOR_ROLLING_STONE};
  text-shadow: ${ConfigurationStyles.getEditorLabelShadow(ConfigurationStyles.COLOR_DODGER_BLUE)};

  font-weight: bold;
  margin: 0.5rem 0;
`;

const TimeWindow = styled.div`
  margin-bottom: 1rem;
`;

const TimeWindowPickers = styled.div`
  display: grid;
  grid-auto-flow: column;
  column-gap: 2rem;
`;
const TimeWindowShortcuts = styled.div`
  margin-top: 0.2rem;
  margin-left: 0.2rem;
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: max-content;
  column-gap: 1rem;
`;

const LateArrivals = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 1rem;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  // qcpConfiguration - QN Configuration
  // dsUpdate - CDN Management
  forcedComponent?: ComponentTypeEnum | undefined;

  // show DS dropdown selection be shown
  isShowDsDropdown: boolean;

  // contains the dropdown values that the user chooses
  formAdditionalData: SystemUpdateFormEntity;

  // used when going back to show the data entered by user. it overrides all the form data.
  overrideFormData?: SystemUpdateSchemaType;
  // if updating an existing System Update
  existingSystemUpdate: SystemUpdateInternalEntity | undefined;

  // used after submitting a known QN, for example, in QN-Configuration, after editing a QN, that QN id is passed
  affectedQnDeploymentIds: number[];

  beforeForm?: ReactNode;
  isFormDisabled?: boolean;

  overrideButtons: OverrideButtons<SystemUpdateSchemaType>[];

  className?: string;
}

//endregion [[ Props ]]

type AffectedEntityType = "ds" | "qn";

export const SystemUpdatesForm = (props: Props) => {
  const [isLateArrival, setIsLateArrival] = useState(!!props.existingSystemUpdate?.lateArrivals);
  const [selectedTypesSet, setSelectedTypesSet] = useState<Set<AffectedEntityType>>(new Set(["qn", "ds"]));

  const systemUpdate = props.existingSystemUpdate;

  const affectedQnDeploymentIds = (systemUpdate?.affectedQnDeploymentIds || []).concat(props.affectedQnDeploymentIds);

  const changeSelectedTypesSet = (entity: AffectedEntityType) => {
    const newSet = new Set(selectedTypesSet);
    const newState = !newSet.has(entity);
    if (newState) {
      newSet.add(entity);
    } else {
      newSet.delete(entity);
    }
    setSelectedTypesSet(newSet);
  };

  return (
    <SystemUpdatesFormView<SystemUpdateSchemaType>
      className={props.className}
      title={"System Update"}
      isEdit={!!props.existingSystemUpdate}
      overrideButtons={props.overrideButtons}
      onCancel={() => {}}
      onOk={async () => {}}
      formikProps={{ enableReinitialize: false }}
      initialValues={
        props.overrideFormData ?? {
          affectedQnDeploymentIds: affectedQnDeploymentIds,
          startTime: systemUpdate?.startTime ?? DateTime.local(),
          endTime: systemUpdate?.endTime ?? DateTime.local().plus({ hour: 1 }),
          affectedDsIds: systemUpdate?.affectedDsIds ?? [],
          externalDescription: systemUpdate?.externalDescription ?? "",
          internalDescription: systemUpdate?.internalDescription ?? "",
          isCustomerFacing: systemUpdate?.isCustomerFacing ?? false,
          lateArrivals: systemUpdate?.lateArrivals,
          kind: SystemUpdateKind.SCHEDULED,
          expectedEffect: systemUpdate?.expectedEffect ?? "No expected effect on end users or network",
          component:
            props.forcedComponent ?? props.existingSystemUpdate?.component ?? ComponentTypeEnum.QCP_CONFIGURATION,
        }
      }
      initialValidation={true}
      validate={onValidate}>
      {(formProps) => {
        const values: SystemUpdateSchemaType = formProps.values;

        const affectedQnsField = (
          <Field name={"affectedEntities"}>
            {() => {
              return (
                <RadioGroupWrapper isHighlighted={selectedTypesSet.has("qn")}>
                  <AffectedEntitiesDropdown
                    onSelectionChanged={(affectedIds) =>
                      formProps.setValues({
                        ...values,
                        affectedQnDeploymentIds: affectedIds,
                      })
                    }
                    affectedIds={values.affectedQnDeploymentIds ?? []}
                    networksHierarchy={props.formAdditionalData.networksHierarchy}
                    disabled={!selectedTypesSet.has("qn")}
                  />
                </RadioGroupWrapper>
              );
            }}
          </Field>
        );

        return (
          <Content>
            <HelpNote>
              <b>NOTE: </b>The following is used to notify customers about configuration changes. If no real customers
              are going to be affected by your change, it is ok to skip it.
            </HelpNote>
            <BeforeFormContent>{props.beforeForm}</BeforeFormContent>
            <FormContent isDisabled={!!props.isFormDisabled}>
              <FormikToggle field={"isCustomerFacing"} label={"Customer-Facing Update"} />
              {props.forcedComponent === undefined ? (
                <FormikSelect field={"component"} label={"Component Type"}>
                  {enumValues(ComponentTypeEnum).map((component) => (
                    <option key={component} value={component}>
                      {SystemUpdatesUtils.getComponentDisplayName(component)}
                    </option>
                  ))}
                </FormikSelect>
              ) : null}
              {props.isShowDsDropdown ? (
                <QwiltFormGroupStyled label={"Affected Entities"}>
                  <CheckboxGroup>
                    <Checkbox isChecked={selectedTypesSet.has("qn")} onClick={() => changeSelectedTypesSet("qn")} />
                    {affectedQnsField}
                  </CheckboxGroup>
                  <CheckboxGroup>
                    <Checkbox isChecked={selectedTypesSet.has("ds")} onClick={() => changeSelectedTypesSet("ds")} />
                    <RadioGroupWrapper isHighlighted={selectedTypesSet.has("ds")}>
                      <DsDropdown
                        disabled={!props.isShowDsDropdown || !selectedTypesSet.has("ds")}
                        selectedIds={formProps.values.affectedDsIds ?? []}
                        deliveryServices={props.formAdditionalData.deliveryServices}
                        onSelectionChanged={(dsIds) =>
                          formProps.setValues({
                            ...values,
                            affectedDsIds: dsIds,
                          })
                        }
                      />
                    </RadioGroupWrapper>
                  </CheckboxGroup>
                </QwiltFormGroupStyled>
              ) : (
                affectedQnsField
              )}
              <Field name={"kind"}>
                {(fieldProps: FieldProps) => {
                  const values: SystemUpdateSchemaType = formProps.values;

                  return (
                    <KindRadios>
                      <label>
                        <input
                          type={"radio"}
                          checked={values.kind === SystemUpdateKind.SCHEDULED}
                          onChange={() =>
                            fieldProps.form.setFieldValue(fieldProps.field.name, SystemUpdateKind.SCHEDULED)
                          }
                        />
                        <RadioText>Scheduled</RadioText>
                        <FontAwesomeIcon icon={faCalendarDay} />
                      </label>
                      <label>
                        <input
                          type={"radio"}
                          checked={values.kind === SystemUpdateKind.TIMELY}
                          onChange={() => fieldProps.form.setFieldValue(fieldProps.field.name, SystemUpdateKind.TIMELY)}
                        />
                        <RadioText>Timely</RadioText>
                        <FontAwesomeIcon icon={faClock} />
                      </label>
                    </KindRadios>
                  );
                }}
              </Field>
              <FormikInput field={"expectedEffect"} label={"Expected Effect"} />
              <Label>Time Window (local timezone)</Label>
              <TimeWindow>
                <TimeWindowPickers>
                  <FormikDateTimePicker label={"Start Time"} field={"startTime"} />
                  <FormikDateTimePicker label={"End Time"} field={"endTime"} />
                </TimeWindowPickers>
                <TimeWindowShortcuts>
                  <Clickable onClick={() => updateTimeWindow(1, formProps)}>Next 1hr</Clickable>
                  <Clickable onClick={() => updateTimeWindow(2, formProps)}>Next 2hrs</Clickable>
                </TimeWindowShortcuts>
              </TimeWindow>
              <LateArrivals>
                <QwiltToggle
                  label={""}
                  checked={isLateArrival}
                  onChange={(value) => {
                    formProps.setValues({
                      ...formProps.values,
                      lateArrivals: value ? DateTime.local() : undefined,
                    });

                    setIsLateArrival(value);
                  }}
                />
                <FormikDateTimePicker label={"Late Arrivals"} field={"lateArrivals"} disabled={!isLateArrival} />
              </LateArrivals>
              <FormikInput field={"externalDescription"} label={"External Description (Optional)"} />
              <FormikInput field={"internalDescription"} label={"Internal Description (Optional)"} />
            </FormContent>
          </Content>
        );
      }}
    </SystemUpdatesFormView>
  );
};

function onValidate(formData: SystemUpdateSchemaType) {
  const errors: Record<string, string> = {};

  try {
    SystemUpdateSchema.validateSync(formData, { abortEarly: false });
  } catch (e) {
    if (e instanceof ValidationError) {
      const validationErrors = Object.fromEntries(e.inner.map((e) => [e.path, e.message]));
      Object.assign(errors, validationErrors);
    }
  }

  if (formData.component === ComponentTypeEnum.DS_UPDATE && !formData.affectedDsIds) {
    errors["missingAffectedDs"] = `At least one Delivery Service should be selected`;
  }

  if (formData.lateArrivals && formData.lateArrivals < formData.endTime) {
    errors["lateArrivalsError"] = `Late Arrivals date must be later than End date`;
  }

  return errors;
}

function updateTimeWindow(nextHrs: number, formikProps: FormikProps<SystemUpdateSchemaType>) {
  formikProps.setValues({
    ...formikProps.values,
    startTime: DateTime.local(),
    endTime: DateTime.local().plus({ hours: nextHrs }),
  });
}
