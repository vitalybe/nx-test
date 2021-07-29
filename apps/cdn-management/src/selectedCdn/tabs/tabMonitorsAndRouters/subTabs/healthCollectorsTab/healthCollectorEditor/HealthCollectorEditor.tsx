import { ServerStatus } from "@qwilt/common/backend/trafficRoutersMonitors/_types/trafficRoutersMonitorsTypes";
import { Content, FormikContainer } from "@qwilt/common/components/configuration/formik/formikContainer/FormikContainer";
import { FormikInput } from "@qwilt/common/components/configuration/formik/formikInput/FormikInput";
import { FormikReactSelect } from "@qwilt/common/components/configuration/formik/formikReactSelect/FormikReactSelect";
import { FormikUtils } from "@qwilt/common/utils/formikUtils";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { enumValues } from "@qwilt/common/utils/typescriptUtils";
import * as _ from "lodash";
import * as React from "react";
import { HealthCollectorEntity } from "../_domain/healthCollectorEntity";
import {
  HealthCollectorFormSchema,
  HealthCollectorFormType,
} from "../_domain/healthCollectorFormType";
import { MonitorsAndRoutersEditorUtils } from "../../_utils/monitorsAndRoutersEditorUtils";
import { ServerEntityStatus } from "../../../_domain/server/oldServerEntity";
import styled from "styled-components";
import { HealthCollectorsProvider } from "../_providers/healthCollectorsProvider";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const VERTICAL_GAP = "1rem";

const HealthCollectorEditorForm = styled(FormikContainer)`
  width: 1000px;
  height: 80vh;

  ${Content} {
    display: flex;
  }
` as typeof FormikContainer;

const EditorContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${VERTICAL_GAP};
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  editedItem: HealthCollectorEntity;
  cdnName: string;

  onClose: () => void;

  className?: string;
}

//endregion [[ Props ]]

export const HealthCollectorEditor = (props: Props) => {
  const isEdit = !!props.editedItem;

  function toFormData(editedItem: HealthCollectorEntity): HealthCollectorFormType {
    return {
      healthCollectorRegion: editedItem.healthCollectorRegion,
      status: editedItem.status,
    };
  }

  async function onSave(formData: HealthCollectorFormType) {
    await HealthCollectorsProvider.instance.update(props.cdnName, props.editedItem.hostname, formData);
    props.onClose();
  }

  const initialValues: HealthCollectorFormType = toFormData(props.editedItem);

  return (
    <HealthCollectorEditorForm<HealthCollectorFormType>
      title={"Health Collector"}
      isEdit={isEdit}
      onCancel={props.onClose}
      onOk={(partialFormData) => onSave(partialFormData as HealthCollectorFormType)}
      initialValues={initialValues}
      validate={(formData) => FormikUtils.performSchemaValidation(HealthCollectorFormSchema, formData)}
      className={props.className}>
      {() => {
        return (
          <EditorContent>
            <MonitorsAndRoutersEditorUtils.ReadOnlyInputs server={props.editedItem} />
            <FormikInput field={"healthCollectorRegion"} label={"Health Collector Region"} />
            <FormikReactSelect<ServerEntityStatus>
              field={"status"}
              label={"Status"}
              required={true}
              options={enumValues(ServerStatus).map((status) => ({
                label: _.startCase(status),
                value: status,
              }))}
            />
          </EditorContent>
        );
      }}
    </HealthCollectorEditorForm>
  );
};
