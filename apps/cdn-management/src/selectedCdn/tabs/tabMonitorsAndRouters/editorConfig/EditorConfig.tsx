import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { FormikContainer } from "common/components/configuration/formik/formikContainer/FormikContainer";
import { FormikJson } from "common/components/configuration/formik/formikJson/FormikJson";
import { CdnEntity } from "src/_domain/cdnEntity";
import { TrafficRoutersMonitorsApi } from "common/backend/trafficRoutersMonitors";
import { EditorConfigProvider } from "src/selectedCdn/tabs/tabMonitorsAndRouters/editorConfig/_providers/editorConfigProvider";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const Content = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: min-content;
  grid-auto-flow: row;
  row-gap: 1em;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  cdn: CdnEntity;
  mode: "routers" | "monitors";
  config: object;

  onClose: () => void;
  className?: string;
}

//endregion [[ Props ]]

export const EditorConfig = (props: Props) => {
  async function onOk(formData: ConfigFormData) {
    await TrafficRoutersMonitorsApi.instance.updateConfig(formData.config, props.mode, props.cdn.name);
    EditorConfigProvider.instance.prepareQuery(props.cdn.name, props.mode).invalidateWithChildren();
    props.onClose();
  }

  return (
    <FormikContainer<ConfigFormData>
      title={props.mode + " config"}
      isEdit={true}
      initialValues={{ config: props.config || {} }}
      initialValidation={true}
      onOk={onOk}
      onCancel={props.onClose}
      className={props.className}>
      {(fieldProps) => (
        <Content>
          <FormikJson
            field={"config"}
            label={"Configuration"}
            disabled={false}
            minimized={false}
            value={fieldProps.values.config}
          />
        </Content>
      )}
    </FormikContainer>
  );
};

export interface ConfigFormData {
  config: object;
}
