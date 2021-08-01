import * as React from "react";
import { ReactElement } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import {
  FormikContainer,
  Props as MonitorSegmentsEditorFormProps,
} from "common/components/configuration/formik/formikContainer/FormikContainer";
import { FormikInput } from "common/components/configuration/formik/formikInput/FormikInput";
import { ValidationError } from "yup";
import { FormikAddRemoveItems } from "common/components/configuration/formik/formikAddRemoveItems/FormikAddRemoveItems";
import { FormikSelect } from "common/components/configuration/formik/formikSelect/FormikSelect";
import { MonitorSegmentEntity } from "src/selectedCdn/tabs/tabMonitorSegments/_domain/MonitorSegmentEntity";
import {
  MonitorSegmentFormData,
  MonitorSegmentFormSchema,
} from "src/selectedCdn/tabs/tabMonitorSegments/_domain/MonitorSegmentFormData";
import { MonitorSegmentProvider } from "src/selectedCdn/tabs/tabMonitorSegments/_providers/MonitorSegmentProvider";
import { CdnEntity } from "src/_domain/cdnEntity";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const MonitorSegmentsEditorForm = (styled(FormikContainer)`
  width: 700px;
  height: 500px;
` as unknown) as <T extends {}>(props: MonitorSegmentsEditorFormProps<T>) => ReactElement;

const Content = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  grid-auto-flow: row;
  grid-row-gap: 1em;
  height: 100%;
`;

const FormikSelectStyled = styled(FormikSelect)`
  flex: 1;
  margin-bottom: 0;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  cdn: CdnEntity;

  editedItem: MonitorSegmentEntity | undefined;
  allHealthCollectorIds: string[];
  onClose: () => void;
  className?: string;
}

//endregion [[ Props ]]

export const MonitorSegmentsEditor = (props: Props) => {
  const onValidate = (formData: Partial<MonitorSegmentFormData>) => {
    const errors: Record<string, string> = {};

    try {
      MonitorSegmentFormSchema.validateSync(formData, { abortEarly: false });
    } catch (e) {
      if (e instanceof ValidationError) {
        const validationErrors = Object.fromEntries(e.inner.map((e) => [e.path, e.message]));
        Object.assign(errors, validationErrors);
      }
    }

    //validates user doesn't create a segment with existing id
    if (!props.editedItem && props.allHealthCollectorIds.some((segmentId) => segmentId === formData.id)) {
      errors["idConflict"] = `Segment with this ID (${formData.id}) already exists`;
    }

    return errors;
  };

  const initialValues: Partial<MonitorSegmentFormData> = props.editedItem
    ? {
        id: props.editedItem.id,
        healthCollectors: props.editedItem.healthCollectorIds.map((healthCollectorId) => healthCollectorId),
      }
    : {
        id: "",
        healthCollectors: [],
      };

  async function onSave(formData: MonitorSegmentFormData) {
    const savedItem = new MonitorSegmentEntity(formData.id, formData.healthCollectors);
    await MonitorSegmentProvider.instance.update(props.cdn.id, savedItem, !!props.editedItem);
    props.onClose();
  }

  return (
    <MonitorSegmentsEditorForm<Partial<MonitorSegmentFormData>>
      title={"Monitor Segment"}
      isEdit={!!props.editedItem}
      onCancel={props.onClose}
      onOk={(partialFormData) => onSave(partialFormData as MonitorSegmentFormData)}
      initialValues={initialValues}
      validate={onValidate}
      className={props.className}>
      {(formikProps) => (
        <Content>
          <FormikInput field={"id"} type={"string"} label={"ID"} disabled={!!props.editedItem} />

          <FormikAddRemoveItems<Partial<MonitorSegmentFormData>, string>
            formikProps={formikProps}
            label={"Health Collectors"}
            field={"healthCollectors"}
            getNewItem={() => props.allHealthCollectorIds[0]}
            getIsAddDisabled={() => props.allHealthCollectorIds.length === 0}
            disabledTooltip={"No available Health Collectors"}>
            {(index: number) => (
              <FormikSelectStyled field={`healthCollectors[${index}]`} label={"System Id"}>
                {props.allHealthCollectorIds.map((healthCollectorId) => (
                  <option key={healthCollectorId} value={healthCollectorId}>
                    {healthCollectorId}
                  </option>
                ))}
              </FormikSelectStyled>
            )}
          </FormikAddRemoveItems>
        </Content>
      )}
    </MonitorSegmentsEditorForm>
  );
};
