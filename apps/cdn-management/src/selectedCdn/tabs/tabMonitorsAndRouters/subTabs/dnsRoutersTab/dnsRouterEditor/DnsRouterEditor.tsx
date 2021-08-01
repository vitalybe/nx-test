import { ServerStatus } from "@qwilt/common/backend/trafficRoutersMonitors/_types/trafficRoutersMonitorsTypes";
import { Content, FormikContainer } from "@qwilt/common/components/configuration/formik/formikContainer/FormikContainer";
import { FormikInput } from "@qwilt/common/components/configuration/formik/formikInput/FormikInput";
import { FormikReactSelect } from "@qwilt/common/components/configuration/formik/formikReactSelect/FormikReactSelect";
import { FormikUtils } from "@qwilt/common/utils/formikUtils";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { enumValues } from "@qwilt/common/utils/typescriptUtils";
import * as _ from "lodash";
import * as React from "react";
import { DnsRouterEntity } from "../_domain/dnsRouterEntity";
import {
  DnsRouterFormSchema,
  DnsRouterFormType,
} from "../_domain/dnsRouterFormType";
import { MonitorsAndRoutersEditorUtils } from "../../_utils/monitorsAndRoutersEditorUtils";
import { ServerEntityStatus } from "../../../_domain/server/oldServerEntity";
import styled from "styled-components";
import { DnsRoutersProvider } from "../_providers/dnsRoutersProvider";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const VERTICAL_GAP = "1rem";

const DnsRouterEditorForm = styled(FormikContainer)`
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
  editedItem: DnsRouterEntity;
  cdnName: string;
  onClose: () => void;

  className?: string;
}

//endregion [[ Props ]]

export const DnsRouterEditor = (props: Props) => {
  const isEdit = !!props.editedItem;

  async function onSave(formData: DnsRouterFormType) {
    await DnsRoutersProvider.instance.update(props.cdnName, props.editedItem.hostname, formData);
    props.onClose();
  }

  function toFormData(editedItem: DnsRouterEntity): DnsRouterFormType {
    return {
      dnsRoutingSegmentId: editedItem.dnsRoutingSegmentId,
      status: editedItem.status,
      healthProviders: editedItem.healthProviders.map((healthProvider) => ({
        hostname: healthProvider.hostname,
        priority: healthProvider.priority,
      })),
    };
  }

  const initialValues: DnsRouterFormType = toFormData(props.editedItem);

  return (
    <DnsRouterEditorForm<DnsRouterFormType>
      title={"Input Source"}
      isEdit={isEdit}
      onCancel={props.onClose}
      onOk={(partialFormData) => onSave(partialFormData as DnsRouterFormType)}
      initialValues={initialValues}
      validate={(formData) => FormikUtils.performSchemaValidation(DnsRouterFormSchema, formData)}
      className={props.className}>
      {(formikProps) => {
        return (
          <EditorContent>
            <MonitorsAndRoutersEditorUtils.ReadOnlyInputs server={props.editedItem} />
            <FormikInput field={"dnsRoutingSegmentId"} label={"DNS Routing Segment ID"} />
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
    </DnsRouterEditorForm>
  );
};
