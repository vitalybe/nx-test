import * as React from "react";
import { QwiltInput } from "common/components/configuration/qwiltForm/qwiltInput/QwiltInput";
import styled from "styled-components";
import { ServerEntity } from "src/selectedCdn/tabs/tabMonitorsAndRouters/_domain/server/serverEntity";
import { FormikProps } from "formik";
import { HealthProviderFormType } from "src/selectedCdn/tabs/tabMonitorsAndRouters/_domain/healthProvider/healthProviderFormType";
import { FormikInput } from "common/components/configuration/formik/formikInput/FormikInput";
import { FormikAddRemoveItems } from "common/components/configuration/formik/formikAddRemoveItems/FormikAddRemoveItems";

const HORIZONTAL_GAP = "1rem";

export class MonitorsAndRoutersEditorUtils {
  static InputRow = styled.div<{ columns: string }>`
    display: grid;
    grid-template-columns: ${(props) => props.columns};
    gap: ${HORIZONTAL_GAP};
    align-items: center;
  `;

  static ReadOnlyInputs(props: { server: ServerEntity }) {
    return (
      <>
        <MonitorsAndRoutersEditorUtils.InputRow columns={"1fr 1fr 1fr"}>
          <QwiltInput label={"Hostname"} value={props.server.hostname} onChange={() => {}} disabled={true} />
          <QwiltInput label={"System ID"} value={props.server.systemId} onChange={() => {}} disabled={true} />
          <QwiltInput label={"Domain"} value={props.server.domain} onChange={() => {}} disabled={true} />
        </MonitorsAndRoutersEditorUtils.InputRow>
        <MonitorsAndRoutersEditorUtils.InputRow columns={"1fr 1fr 1fr 1fr"}>
          <QwiltInput label={"IPv4 Address"} value={props.server.ipv4Address} onChange={() => {}} disabled={true} />
          <QwiltInput label={"IPv6 Address"} value={props.server.ipv6Address} onChange={() => {}} disabled={true} />
          <QwiltInput label={"TCP Port"} value={props.server.tcpPort.toString()} onChange={() => {}} disabled={true} />
          <QwiltInput
            label={"HTTPS Port"}
            value={props.server.httpsPort.toString()}
            onChange={() => {}}
            disabled={true}
          />
        </MonitorsAndRoutersEditorUtils.InputRow>
      </>
    );
  }

  static HealthProvidersAddRemove<T>(props: { formikProps: FormikProps<T>; className?: string }) {
    return (
      <FormikAddRemoveItems<T, HealthProviderFormType>
        label={"Health Providers"}
        field={"healthProviders"}
        formikProps={props.formikProps}
        getNewItem={() => ({
          hostname: "",
          priority: 1,
        })}
        className={props.className}>
        {(index: number) => (
          <MonitorsAndRoutersEditorUtils.InputRow columns={"1fr 100px auto"}>
            <FormikInput field={`healthProviders[${index}].hostname`} label={"Hostname"} />
            <FormikInput field={`healthProviders[${index}].priority`} label={"Priority"} />
          </MonitorsAndRoutersEditorUtils.InputRow>
        )}
      </FormikAddRemoveItems>
    );
  }
}
