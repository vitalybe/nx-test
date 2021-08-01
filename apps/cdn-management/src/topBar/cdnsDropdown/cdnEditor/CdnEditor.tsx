import * as React from "react";
import styled from "styled-components";
import { FormikContainer } from "common/components/configuration/formik/formikContainer/FormikContainer";
import { FormikInput } from "common/components/configuration/formik/formikInput/FormikInput";
import { FormikState } from "formik";
import { loggerCreator } from "common/utils/logger";
import { CdnEntity } from "src/_domain/cdnEntity";
import { useMutation } from "react-query";
import { CdnsApi } from "common/backend/cdns";
import { Notifier } from "common/utils/notifications/notifier";
import { CdnsProvider } from "src/_providers/cdnsProvider";
import { Colors } from "src/_styling/colors";
import { InputRow } from "common/components/configuration/formik/inputRow/InputRow";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const FormikContainerStyled = styled(FormikContainer)`
  width: 1000px;
  max-height: 80vh;
` as typeof FormikContainer;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputContainer = styled.div`
  position: relative;
  padding-bottom: 1rem;
`;

const HelpLabel = styled.div`
  position: absolute;
  bottom: 0;
  margin-left: 0.5rem;

  color: ${Colors.BOULDER};
  font-size: 0.75rem;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  editedItem: CdnEntity | undefined;
  onClose: () => void;

  className?: string;
}

//endregion [[ Props ]]

export type CdnFormData = Omit<CdnEntity, "id">;

export const CdnEditor = (props: Props) => {
  const initialValues: CdnFormData = getInitialValues(props);
  const saveMutate = useMutation<void, Error, CdnFormData>(
    async (formData) => {
      if (props.editedItem) {
        await CdnsApi.instance.cdnUpdate(props.editedItem.id, formData);
      } else {
        await CdnsApi.instance.cdnCreate(formData);
      }
    },
    {
      onSuccess: () => {
        props.onClose();
        CdnsProvider.instance.prepareQuery().invalidateWithChildren();
      },
      onError: (e) => Notifier.error("Save failed: " + e.message, e),
    }
  );

  return (
    <FormikContainerStyled<CdnFormData>
      title={"CDN"}
      isEdit={!!props.editedItem}
      initialValues={initialValues}
      initialValidation={true}
      onOk={async (partialFormData) => {
        await saveMutate.mutateAsync(partialFormData);
      }}
      onCancel={props.onClose}
      className={props.className}>
      {(formikState: FormikState<CdnFormData>) => (
        <Content>
          <InputRow columns={"1fr 1fr"}>
            <FormikInput field={"name"} label={"Name"} disabled={!!props.editedItem} />
            <FormikInput field={"description"} label={"Description"} />
          </InputRow>

          <FormikInput field={"httpRootHostedZone"} label={"HTTP Root Hosted Zone"} isRequired={true} />

          <InputRow columns={"1fr 1fr"}>
            <FormikInput field={"httpCdnSubDomain"} label={"HTTP CDN Sub Domain"} />
            <FormikInput field={"httpSubDomain"} label={"HTTP Routing Domain "} />
          </InputRow>
          <InputContainer>
            <HelpLabel>
              For Example: <b>http.{formikState.values.name}.cqloud.com</b>
            </HelpLabel>
            <FormikInput field={"dnsRootHostedZone"} label={"DNS Root Hosted Zone"} isRequired={true} />
          </InputContainer>
          <InputRow columns={"1fr 1fr 1fr"}>
            <FormikInput field={"dnsCdnSubDomain"} label={"DNS CDN Sub Domain"} />
            <InputContainer>
              <FormikInput field={"dnsSubDomain"} label={"DNS Routing Domain"} />
              <HelpLabel>
                For Example: <b>dns.{formikState.values.name}.cqloud.com</b>
              </HelpLabel>
            </InputContainer>
            {<FormikInput field={"operationalDomain"} label={"Operational Domain"} />}
          </InputRow>
        </Content>
      )}
    </FormikContainerStyled>
  );
};

function getInitialValues(props: Props): CdnFormData {
  return props.editedItem
    ? {
        name: props.editedItem.name || "",
        description: props.editedItem.description || "",
        httpSubDomain: props.editedItem.httpSubDomain || "",
        httpRootHostedZone: props.editedItem.httpRootHostedZone || "",
        httpCdnSubDomain: props.editedItem.httpCdnSubDomain || "",
        operationalDomain: props.editedItem.operationalDomain || "",
        dnsSubDomain: props.editedItem.dnsSubDomain || "",
        dnsRootHostedZone: props.editedItem.dnsRootHostedZone || "",
        dnsCdnSubDomain: props.editedItem.dnsCdnSubDomain || "",
      }
    : {
        name: "",
        description: "",
        httpSubDomain: "",
        httpRootHostedZone: "",
        httpCdnSubDomain: "",
        operationalDomain: "",
        dnsSubDomain: "",
        dnsRootHostedZone: "",
        dnsCdnSubDomain: "",
      };
}
