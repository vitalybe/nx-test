import { ServerStatus } from "common/backend/trafficRoutersMonitors/_types/trafficRoutersMonitorsTypes";
import { Content, FormikContainer } from "common/components/configuration/formik/formikContainer/FormikContainer";
import { FormikInput } from "common/components/configuration/formik/formikInput/FormikInput";
import { FormikReactSelect } from "common/components/configuration/formik/formikReactSelect/FormikReactSelect";
import { FormikUtils } from "common/utils/formikUtils";
import { loggerCreator } from "common/utils/logger";
import { enumValues } from "common/utils/typescriptUtils";
import * as _ from "lodash";
import * as React from "react";
import { HealthProviderEntity } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/healthProvidersTab/_domain/healthProviderEntity";
import {
  HealthProviderFormSchema,
  HealthProviderFormType,
} from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/healthProvidersTab/_domain/healthProviderFormType";
import { MonitorsAndRoutersEditorUtils } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/_utils/monitorsAndRoutersEditorUtils";
import { ServerEntityStatus } from "src/selectedCdn/tabs/tabMonitorsAndRouters/_domain/server/oldServerEntity";
import styled from "styled-components";
import { HealthProvidersProvider } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/healthProvidersTab/_providers/healthProvidersProvider";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const VERTICAL_GAP = "1rem";

const HealthProviderEditorForm = styled(FormikContainer)`
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
  editedItem: HealthProviderEntity;
  cdnName: string;

  onClose: () => void;

  className?: string;
}

//endregion [[ Props ]]

export const HealthProviderEditor = (props: Props) => {
  const isEdit = !!props.editedItem;

  function toFormData(editedItem: HealthProviderEntity): HealthProviderFormType {
    return {
      status: editedItem.status,
    };
  }

  async function onSave(formData: HealthProviderFormType) {
    await HealthProvidersProvider.instance.update(props.cdnName, props.editedItem.hostname, formData);
    props.onClose();
  }

  const initialValues: HealthProviderFormType = toFormData(props.editedItem);

  return (
    <HealthProviderEditorForm<HealthProviderFormType>
      title={"Health Collector"}
      isEdit={isEdit}
      onCancel={props.onClose}
      onOk={(partialFormData) => onSave(partialFormData as HealthProviderFormType)}
      initialValues={initialValues}
      validate={(formData) => FormikUtils.performSchemaValidation(HealthProviderFormSchema, formData)}
      className={props.className}>
      {() => {
        return (
          <EditorContent>
            <MonitorsAndRoutersEditorUtils.ReadOnlyInputs server={props.editedItem} />
            <FormikInput field={"healthProviderRegion"} label={"Health Collector Region"} />
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
    </HealthProviderEditorForm>
  );
};
