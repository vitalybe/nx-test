import { ServerStatus } from "@qwilt/common/backend/trafficRoutersMonitors/_types/trafficRoutersMonitorsTypes";
import { Content, FormikContainer } from "@qwilt/common/components/configuration/formik/formikContainer/FormikContainer";
import { FormikInput } from "@qwilt/common/components/configuration/formik/formikInput/FormikInput";
import { FormikReactSelect } from "@qwilt/common/components/configuration/formik/formikReactSelect/FormikReactSelect";
import { FormikUtils } from "@qwilt/common/utils/formikUtils";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { enumValues } from "@qwilt/common/utils/typescriptUtils";
import * as _ from "lodash";
import * as React from "react";
import { HttpRouterEntity } from "../_domain/httpRouterEntity";
import {
  HttpRouterFormSchema,
  HttpRouterFormType,
} from "../_domain/httpRouterFormType";
import { MonitorsAndRoutersEditorUtils } from "../../_utils/monitorsAndRoutersEditorUtils";
import { ServerEntityStatus } from "../../../_domain/server/oldServerEntity";
import styled from "styled-components";
import { HttpRoutersProvider } from "../_providers/httpRoutersProvider";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const VERTICAL_GAP = "1rem";

const HttpRouterEditorForm = styled(FormikContainer)`
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

const HealthProvidersAddRemoveStyled = styled(MonitorsAndRoutersEditorUtils.HealthProvidersAddRemove)`
  flex: 1;
  min-height: 0;
` as typeof MonitorsAndRoutersEditorUtils.HealthProvidersAddRemove;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  editedItem: HttpRouterEntity;
  cdnName: string;

  onClose: () => void;

  className?: string;
}

//endregion [[ Props ]]

export const HttpRouterEditor = (props: Props) => {
  const isEdit = !!props.editedItem;

  function toFormData(editedItem: HttpRouterEntity): HttpRouterFormType {
    return {
      httpRouterGroupName: editedItem.httpRouterGroupName,
      status: editedItem.status,
      healthProviders: editedItem.healthProviders.map((healthProvider) => ({
        hostname: healthProvider.hostname,
        priority: healthProvider.priority,
      })),
    };
  }

  async function onSave(formData: HttpRouterFormType) {
    await HttpRoutersProvider.instance.update(props.cdnName, props.editedItem.hostname, formData);
    props.onClose();
  }

  const initialValues: HttpRouterFormType = toFormData(props.editedItem);

  return (
    <HttpRouterEditorForm<HttpRouterFormType>
      title={"HTTP Router"}
      isEdit={isEdit}
      onCancel={props.onClose}
      onOk={(partialFormData) => onSave(partialFormData as HttpRouterFormType)}
      initialValues={initialValues}
      validate={(formData) => FormikUtils.performSchemaValidation(HttpRouterFormSchema, formData)}
      className={props.className}>
      {(formikProps) => {
        return (
          <EditorContent>
            <MonitorsAndRoutersEditorUtils.ReadOnlyInputs server={props.editedItem} />
            <FormikInput field={"httpRouterGroupName"} label={"HTTP Router Group Name"} />
            <HealthProvidersAddRemoveStyled formikProps={formikProps} />
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
    </HttpRouterEditorForm>
  );
};
