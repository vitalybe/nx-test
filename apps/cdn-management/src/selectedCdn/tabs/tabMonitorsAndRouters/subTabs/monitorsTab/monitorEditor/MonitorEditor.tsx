import { ServerStatus } from "common/backend/trafficRoutersMonitors/_types/trafficRoutersMonitorsTypes";
import { Content, FormikContainer } from "common/components/configuration/formik/formikContainer/FormikContainer";
import { FormikInput } from "common/components/configuration/formik/formikInput/FormikInput";
import { FormikReactSelect } from "common/components/configuration/formik/formikReactSelect/FormikReactSelect";
import { FormikUtils } from "common/utils/formikUtils";
import { loggerCreator } from "common/utils/logger";
import { enumValues } from "common/utils/typescriptUtils";
import * as _ from "lodash";
import * as React from "react";
import { MonitorEntity } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/monitorsTab/_domain/monitorEntity";
import {
  MonitorFormSchema,
  MonitorFormType,
} from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/monitorsTab/_domain/monitorFormType";
import { MonitorsAndRoutersEditorUtils } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/_utils/monitorsAndRoutersEditorUtils";
import { ServerEntityStatus } from "src/selectedCdn/tabs/tabMonitorsAndRouters/_domain/server/oldServerEntity";
import styled from "styled-components";
import { MonitorsProvider } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/monitorsTab/_providers/monitorsProvider";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const VERTICAL_GAP = "1rem";

const MonitorEditorForm = styled(FormikContainer)`
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
  editedItem: MonitorEntity;
  cdnName: string;

  onClose: () => void;

  className?: string;
}

//endregion [[ Props ]]

export const MonitorEditor = (props: Props) => {
  const isEdit = !!props.editedItem;

  function toFormData(editedItem: MonitorEntity): MonitorFormType {
    return {
      segmentId: editedItem.segmentId,
      status: editedItem.status,
    };
  }

  async function onSave(formData: MonitorFormType) {
    await MonitorsProvider.instance.update(props.cdnName, props.editedItem.hostname, formData);
    props.onClose();
  }

  const initialValues: MonitorFormType = toFormData(props.editedItem);

  return (
    <MonitorEditorForm<MonitorFormType>
      title={"Monitor"}
      isEdit={isEdit}
      onCancel={props.onClose}
      onOk={(partialFormData) => onSave(partialFormData as MonitorFormType)}
      initialValues={initialValues}
      validate={(formData) => FormikUtils.performSchemaValidation(MonitorFormSchema, formData)}
      className={props.className}>
      {() => {
        return (
          <EditorContent>
            <MonitorsAndRoutersEditorUtils.ReadOnlyInputs server={props.editedItem} />
            <FormikInput field={"segmentId"} label={"Segment ID"} />
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
    </MonitorEditorForm>
  );
};
