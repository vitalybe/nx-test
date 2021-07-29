import _ from "lodash";
import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { DeliveryAgreementsGroupEntity } from "src/_domain/deliveryAgreementsGroupEntity";
import { FormikContainer } from "common/components/configuration/formik/formikContainer/FormikContainer";
import { Field, FieldProps } from "formik";
import { useProvider } from "common/components/providerDataContainer/_providers/useProvider";
import { ProviderDataContainer } from "common/components/providerDataContainer/ProviderDataContainer";
import { EditorDropdownProvider } from "src/editorDeliveryAgreement/_providers/editorDropdownProvider";
import { DeliveryAgreementsProvider } from "src/_providers/deliveryAgreementsProvider";
import { QwiltMultiSelect } from "common/components/configuration/qwiltForm/qwiltMultiSelect/QwiltMultiSelect";
import { QwiltFormGroup } from "common/components/configuration/qwiltForm/qwiltFormGroup/QwiltFormGroup";
import { DaNetworkConnectionEntity } from "src/_domain/daNetworkConnectionEntity";
import { Notifier } from "common/utils/notifications/notifier";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const Content = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-auto-rows: 1fr;
  grid-auto-flow: row;
  row-gap: 1em;
  width: 500px;
  height: 50vh;
`;

const QwiltFormGroupStyled = styled(QwiltFormGroup)`
  min-height: 200px;
  display: grid;
  padding-top: 1.5em;
  padding-bottom: 2px;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  entity: DeliveryAgreementsGroupEntity;
  provider?: DeliveryAgreementsProvider;
  preselectedNetworkId: number | undefined;

  onModalClose: (didModifications: boolean) => void;

  className?: string;
}

//endregion [[ Props ]]

//region [[ Functions ]]

function onValidate(entity: DeliveryAgreementsGroupEntity) {
  const errors: { [key: string]: string } = {};

  if (!entity.name) {
    errors["name"] = "Name must have value";
  }

  return errors;
}

//endregion [[ Functions ]]

export const EditorDeliveryAgreement = (props: Props) => {
  const provider = props.provider || DeliveryAgreementsProvider.instance;

  const { data: networks, metadata: providerMetadata } = useProvider(
    (metadata) => EditorDropdownProvider.instance.provide(metadata),
    true,
    []
  );
  const [isSaving, setIsSaving] = useState(false);

  async function onOk(entity: DeliveryAgreementsGroupEntity) {
    try {
      setIsSaving(true);
      const updatedEntity = props.entity;
      await provider.update(updatedEntity, entity);

      setIsSaving(false);
      props.onModalClose(true);
    } catch (e) {
      setIsSaving(false);
      Notifier.warn("Failed to save changes", e);
    }
  }

  const entity = new DeliveryAgreementsGroupEntity({ ..._.cloneDeep(props.entity) });

  return (
    <ProviderDataContainer providerMetadata={providerMetadata} forceLoading={isSaving}>
      {networks && (
        <FormikContainer<DeliveryAgreementsGroupEntity>
          title={`Delivery Agreements - ${props.entity.name} - ${props.entity.dsMetadataCpName}`}
          isEdit={true}
          initialValues={entity}
          onOk={onOk}
          onCancel={() => props.onModalClose(false)}
          validate={onValidate}
          className={props.className}>
          {() => {
            return (
              <Content>
                <Field>
                  {(fieldProps: FieldProps) => {
                    const initialItems = _.sortBy(
                      networks!.map((network) => {
                        const isPreselected = network.id === props.preselectedNetworkId;
                        const isSelected =
                          isPreselected ||
                          !!props.entity.networks.find((daNetwork) => daNetwork.networkId === network.id);

                        return {
                          ...network,
                          id: network.id.toString(),
                          isSelected: isSelected,
                        };
                      }),
                      (network) => network.name.toLowerCase()
                    );
                    return (
                      <QwiltFormGroupStyled label={"Networks"}>
                        <QwiltMultiSelect
                          initialItems={initialItems}
                          itemRenderer={(item) => <div>{item.name}</div>}
                          itemFilterPredicate={(item, filter) => _.toLower(item.name).includes(_.toLower(filter))}
                          onItemsChanged={(items) =>
                            fieldProps.form.setFieldValue(
                              "networks",
                              items
                                .filter((item) => item.isSelected)
                                .map(
                                  (item) =>
                                    new DaNetworkConnectionEntity({
                                      networkId: parseInt(item.id),
                                      name: item.name,
                                      deliveryAgreementId: "N/A",
                                    })
                                )
                            )
                          }
                        />
                      </QwiltFormGroupStyled>
                    );
                  }}
                </Field>
              </Content>
            );
          }}
        </FormikContainer>
      )}
    </ProviderDataContainer>
  );
};
