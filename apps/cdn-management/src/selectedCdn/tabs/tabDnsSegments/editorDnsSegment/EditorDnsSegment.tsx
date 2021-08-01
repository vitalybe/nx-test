import * as React from "react";
import styled from "styled-components";
import { FormikContainer } from "common/components/configuration/formik/formikContainer/FormikContainer";
import { DnsSegmentEntity } from "src/selectedCdn/tabs/tabDnsSegments/_domain/DnsSegmentEntity";
import { FormikInput } from "common/components/configuration/formik/formikInput/FormikInput";
import { Colors } from "src/_styling/colors";
import { Fonts } from "common/styling/fonts";
import { FormikState } from "formik";
import { DnsSegmentProvider } from "src/selectedCdn/tabs/tabDnsSegments/_providers/DnsSegmentProvider";
import { CdnEntity } from "src/_domain/cdnEntity";

const EditorDnsSegmentView = styled.div``;

const Content = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: min-content;
  grid-auto-flow: row;
  row-gap: 1em;
`;

const Label = styled.div`
  color: ${Colors.BOULDER};
  font-size: ${Fonts.FONT_SIZE_12};
  margin-bottom: 10px;
  margin-top: -7px;
`;

export interface Props {
  dnsSegment: DnsSegmentEntity;
  cdn: CdnEntity;
  edit: boolean;
  onClose: () => void;
  className?: string;
}

export const EditorDnsSegment = ({ ...props }: Props) => {
  const onOk = async (dnsSegment: DnsSegmentEntity) => {
    await DnsSegmentProvider.instance.update(props.cdn.id, dnsSegment.id, dnsSegment.subDomain, props.edit);
    props.onClose();
  };

  return (
    <EditorDnsSegmentView className={props.className}>
      <FormikContainer<DnsSegmentEntity>
        title={props.edit ? "Edit DNS Routing Segment" : "DNS Routing Segment"}
        isEdit={props.edit}
        initialValues={props.dnsSegment}
        initialValidation={true}
        onOk={onOk}
        onCancel={props.onClose}
        className={props.className}>
        {(formikState: FormikState<DnsSegmentEntity>) => (
          <Content>
            <FormikInput field={"id"} label={"ID"} disabled={props.edit} />
            <FormikInput field={"subDomain"} label={"Sub Domain"} />
            <Label>
              Resulting segment domain for CDN:{" "}
              <b>
                {formikState.values.subDomain}
                {props.cdn.dnsSubDomain ? "." + props.cdn.dnsSubDomain : ""}
                {props.cdn.dnsCdnSubDomain ? "." + props.cdn.dnsCdnSubDomain : ""}.{props.cdn.dnsRootHostedZone}
              </b>
            </Label>
          </Content>
        )}
      </FormikContainer>
    </EditorDnsSegmentView>
  );
};
