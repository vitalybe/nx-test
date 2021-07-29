import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { StaticDnsEntity } from "../_domain/staticDnsEntity";
import { FormikContainer } from "@qwilt/common/components/configuration/formik/formikContainer/FormikContainer";
import { FormikSelect } from "@qwilt/common/components/configuration/formik/formikSelect/FormikSelect";
import { FormikInput } from "@qwilt/common/components/configuration/formik/formikInput/FormikInput";
import { CdnEntity } from "../../../../_domain/cdnEntity";
import { StaticDnsProvider } from "../_providers/staticDnsProvider";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const Content = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: min-content;
  grid-auto-flow: row;
  row-gap: 1em;
`;

//endregion [[ Styles ]]

export interface Props {
  cdn: CdnEntity;
  editedStaticDns: StaticDnsEntity | undefined;
  deliveryServiceId: string;
  onClose: () => void;

  className?: string;
}

export const EditorStaticDns = (props: Props) => {
  function getInitialFormValues(): StaticDnsFormData {
    const initialValues: StaticDnsFormData = {
      name: "",
      dnsRecordId: "",
      cdnId: props.cdn.id,
      deliveryServiceId: props.deliveryServiceId,
      ttl: "",
      type: "",
      value: "",
    };

    if (props.editedStaticDns) {
      initialValues.name = props.editedStaticDns.name;
      initialValues.type = props.editedStaticDns.type;
      initialValues.ttl = props.editedStaticDns.ttl;
      initialValues.value = props.editedStaticDns.value;
      initialValues.dnsRecordId = props.editedStaticDns.dnsRecordId;
    }

    return initialValues;
  }

  async function onOk(data: StaticDnsFormData) {
    await StaticDnsProvider.instance.update(props.editedStaticDns ? "edit" : "add", data);
    props.onClose();
  }

  const types = [
    { key: "A", value: "A_RECORD" },
    { key: "CNAME", value: "CNAME_RECORD" },
    { key: "TXT", value: "TXT_RECORD" },
  ];

  return (
    <FormikContainer<StaticDnsFormData>
      title={"Static DNS"}
      isEdit={!!props.editedStaticDns}
      initialValues={getInitialFormValues()}
      initialValidation={true}
      onOk={onOk}
      onCancel={props.onClose}
      className={props.className}>
      {() => (
        <Content>
          <FormikSelect field={"type"} label={"Type"}>
            <option value="" disabled>
              Select One...
            </option>
            {types.map((type) => (
              <option key={type.key} value={type.value}>
                {type.key}
              </option>
            ))}
          </FormikSelect>

          <FormikInput field={"name"} label={"Name"} isRequired={true} />
          <FormikInput field={"value"} label={"Value"} isRequired={true} />
          <FormikInput field={"ttl"} label={"TTL"} isRequired={true} type={"number"} />
        </Content>
      )}
    </FormikContainer>
  );
};

//region [[Utils]]
export interface StaticDnsFormData {
  name: string;
  cdnId: string;
  deliveryServiceId: string;
  type: string;
  ttl: string;
  value: string;
  dnsRecordId: string;
}

//endregion
