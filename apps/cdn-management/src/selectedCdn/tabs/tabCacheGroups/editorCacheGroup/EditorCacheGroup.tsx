import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { ProjectUrlStore } from "src/_stores/projectUrlStore";
import { ProjectUrlParams } from "src/_stores/projectUrlParams";
import { FormikSelect } from "common/components/configuration/formik/formikSelect/FormikSelect";
import * as _ from "lodash";
import { FormikReactSelect } from "common/components/configuration/formik/formikReactSelect/FormikReactSelect";
import { FormikInput } from "common/components/configuration/formik/formikInput/FormikInput";
import { enumValues } from "common/utils/typescriptUtils";
import {
  DeliveryUnitGroupEditApiType,
  DispersionCalculationMethodsEnum,
} from "common/backend/cdns/_types/deliveryUnitGroupApiType";
import { ArrayHelpers } from "formik";
import { Notifier } from "common/utils/notifications/notifier";
import { Content, FormikContainer } from "common/components/configuration/formik/formikContainer/FormikContainer";
import { FormikAddRemoveItems } from "common/components/configuration/formik/formikAddRemoveItems/FormikAddRemoveItems";
import { CacheGroupEntityType, CacheGroupEntity } from "src/_domain/cacheGroupEntity";
import { NameWithId } from "common/domain/nameWithId";
import { useMutation } from "react-query";
import { CdnsApi } from "common/backend/cdns";
import { CacheGroupsProvider } from "src/_providers/cacheGroupsProvider";
import pluralize from "pluralize";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const FormikContainerStyled = styled(FormikContainer)`
  width: 1000px;
  height: 80vh;

  ${Content} {
    display: flex;
    flex-direction: column;
    gap: 1em;
  }
` as typeof FormikContainer;

const NameInput = styled(FormikInput)`
  grid-column: 1 / span 2;
`;

const FallbackAddRemoveItems = styled(FormikAddRemoveItems)`
  flex: 1;
  grid-column: 1 / span 2;
` as typeof FormikAddRemoveItems;

//endregion [[ Styles ]]

export interface Props {
  editedEntity: CacheGroupEntity | undefined;
  cachesInGroupAmount: number;

  cdnId: string;
  allCacheGroups: CacheGroupEntity[];
  allNetworks: NameWithId<number>[];

  onClose: () => void;

  className?: string;
}

export const EditorCacheGroup = (props: Props) => {
  const otherGroups = getOtherGroups(props.allCacheGroups, props.editedEntity);
  const dugTypes: CacheGroupEntityType[] = ["edge", "mid", "both"];

  const cacheGroupFormData = getInitialFormValues(props.editedEntity);
  const isTempFlagDispersion = ProjectUrlStore.getInstance().getBooleanParam(
    ProjectUrlParams.tempFlag_cacheGroupDispersion
  );
  const isEdit = !!props.editedEntity;
  const saveMutate = useMutation<void, Error, CacheGroupFormData>(
    async (formData) => {
      let editedData: DeliveryUnitGroupEditApiType = {
        name: formData.name,
        type: formData.type,
        latitude: formData.latitude,
        longitude: formData.longitude,
        fallbackDeliveryUnitGroups: formData.fallbackDeliveryUnitGroupsIds,
        parentDeliveryUnitGroupId: formData.parentDeliveryUnitGroupId || null,
        networkId: formData.networkId ?? null,
      };

      const projectUrlStore = ProjectUrlStore.getInstance();
      const isTempFlagDispersion = projectUrlStore.getBooleanParam(ProjectUrlParams.tempFlag_cacheGroupDispersion);
      if (isTempFlagDispersion) {
        if (!formData.dispersion) {
          throw new Error(`no dispersion value`);
        }

        const dispersionNumeric: number = parseFloat(formData.dispersion);
        if (_.isNaN(dispersionNumeric)) {
          throw new Error(`dispersion value is NaN`);
        }

        editedData = {
          ...editedData,
          dispersion: dispersionNumeric,
          dispersionCalculationMethod: formData.dispersionCalculationMethod,
        };
      }

      if (isEdit && props.editedEntity) {
        await CdnsApi.instance.deliveryUnitGroupsUpdate(props.cdnId, props.editedEntity.id, editedData);
      } else {
        await CdnsApi.instance.deliveryUnitGroupsCreate(props.cdnId, editedData);
      }
    },
    {
      onSuccess: () => {
        props.onClose();
        CacheGroupsProvider.instance.prepareQuery(props.cdnId).invalidateWithChildren();
      },
      onError: (e) => Notifier.error("Save failed: " + e.message, e),
    }
  );

  return (
    <FormikContainerStyled<CacheGroupFormData>
      title={"Cache Groups"}
      isEdit={isEdit}
      initialValues={cacheGroupFormData}
      initialValidation={true}
      onOk={async (partialFormData) => {
        await saveMutate.mutateAsync(partialFormData);
      }}
      onCancel={props.onClose}
      validate={(values) => onValidate(values, otherGroups)}
      className={props.className}>
      {(formikProps) => {
        return (
          <>
            <NameInput field={"name"} label={"Name"} preventCapital />
            <FormikSelect field={"type"} label={"Type"}>
              {dugTypes.map((type) => (
                <option key={type} value={type}>
                  {_.startCase(type)}
                </option>
              ))}
            </FormikSelect>
            <FormikReactSelect<number>
              required={true}
              disabled={isEdit && cacheGroupFormData.networkId !== undefined}
              field={"networkId"}
              label={"Network"}
              value={formikProps.values.networkId}
              isMenuPositionFixed={false}
              reactSelectProps={{
                menuPortalTarget: document.body,
                styles: {
                  menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
                },
              }}
              options={props.allNetworks.map((network) => ({
                value: network.id,
                label: network.name ?? "N/A",
              }))}
            />
            <FormikInput field={"longitude"} label={"Longitude"} />
            <FormikInput field={"latitude"} label={"Latitude"} />
            {isTempFlagDispersion ? (
              <FormikSelect field={"dispersionCalculationMethod"} label={"Dispersion Calculation Method"}>
                {enumValues(DispersionCalculationMethodsEnum).map((method) => (
                  <option key={method} value={method}>
                    {_.startCase(method)}
                  </option>
                ))}
              </FormikSelect>
            ) : null}
            {isTempFlagDispersion
              ? (() => {
                  let cachesCountLabel = "";
                  if (props.editedEntity) {
                    const amount = props.cachesInGroupAmount;
                    cachesCountLabel = ` (between ${amount} ${pluralize("cache", amount)})`;
                  }

                  return <FormikInput field={"dispersion"} label={`Dispersion` + cachesCountLabel} type={"number"} />;
                })()
              : null}
            <FormikReactSelect
              field={`parentDeliveryUnitGroupId`}
              label={"Mid"}
              options={[
                { label: "None", value: "" },
                ...otherGroups
                  .filter((dug) => !dug.network || dug.network.id === formikProps.values.networkId)
                  .map((group) => ({
                    label: group.name,
                    value: group.id,
                  })),
              ]}
            />
            <FallbackAddRemoveItems
              formikProps={formikProps}
              label={"Fallback groups"}
              field={"fallbackDeliveryUnitGroupsIds"}
              getIsAddDisabled={() => otherGroups.length <= formikProps.values.fallbackDeliveryUnitGroupsIds.length}
              getNewItem={() => otherGroups[0].id}
              onAddItemOverride={(arrayHelpers, newItem) => onAddFallbackGroup(arrayHelpers, newItem, otherGroups)}>
              {(index: number) => (
                <FormikReactSelect
                  field={`fallbackDeliveryUnitGroupsIds[${index}]`}
                  label={"Group"}
                  options={otherGroups.map((group) => ({
                    label: group.name,
                    value: group.id,
                  }))}
                />
              )}
            </FallbackAddRemoveItems>
          </>
        );
      }}
    </FormikContainerStyled>
  );
};

//region [[ Utils ]]
export interface CacheGroupFormData {
  name: string;
  type: CacheGroupEntityType;
  networkId: number | undefined;
  longitude: number;
  latitude: number;
  fallbackDeliveryUnitGroupsIds: string[];
  parentDeliveryUnitGroupId: string;
  dispersion?: string;
  dispersionCalculationMethod?: DispersionCalculationMethodsEnum;
}

function onValidate(cacheGroupFormData: CacheGroupFormData, otherGroups: CacheGroupEntity[]) {
  const errors: { [key: string]: string } = {};

  if (!cacheGroupFormData.name.match(/^[a-zA-Z]+/)) {
    errors["name"] = "Name must start with at least one letter";
  }

  if (_.isUndefined(cacheGroupFormData.networkId)) {
    errors["networkId"] = "Network must be defined";
  }

  if (cacheGroupFormData.parentDeliveryUnitGroupId) {
    const selectedParent = otherGroups.find((group) => group.id === cacheGroupFormData.parentDeliveryUnitGroupId);

    if (!selectedParent) {
      errors["parentDeliveryUnitGroupId"] = "Unknown parent group: " + cacheGroupFormData.parentDeliveryUnitGroupId;
    } else if (selectedParent.network && selectedParent.network.id !== cacheGroupFormData.networkId) {
      errors["parentDeliveryUnitGroupId"] = "Selected Mid value is from a different network";
    }
  }

  if (cacheGroupFormData.fallbackDeliveryUnitGroupsIds.length) {
    for (const fallbackId of cacheGroupFormData.fallbackDeliveryUnitGroupsIds) {
      const selectedParent = otherGroups.find((group) => group.id === fallbackId);

      if (!selectedParent) {
        errors["parentDeliveryUnitGroupId"] = "Unknown fallback group: " + cacheGroupFormData.parentDeliveryUnitGroupId;
      } else if (selectedParent.network && selectedParent.network.id !== cacheGroupFormData.networkId) {
        errors["parentDeliveryUnitGroupId"] = "Fallback group has a different network";
      }
    }
  }

  if (ProjectUrlStore.getInstance().getBooleanParam(ProjectUrlParams.tempFlag_cacheGroupDispersion)) {
    const dispersion = cacheGroupFormData.dispersion !== undefined ? parseFloat(cacheGroupFormData.dispersion) : -1;
    if (_.isNaN(dispersion) || dispersion < 0) {
      errors["dispersion"] = "Dispersion must be a zero or positive number";
    }

    if (
      !cacheGroupFormData.dispersionCalculationMethod ||
      !enumValues(DispersionCalculationMethodsEnum).includes(cacheGroupFormData.dispersionCalculationMethod)
    ) {
      errors["dispersion"] =
        "Dispersion calculation method is invalid: " + cacheGroupFormData.dispersionCalculationMethod;
    }
  }

  return errors;
}

function getOtherGroups(
  allCacheGroups: CacheGroupEntity[],
  editedCacheGroup: CacheGroupEntity | undefined
): CacheGroupEntity[] {
  const otherGroups = allCacheGroups.filter(
    (group) => group.id !== (editedCacheGroup ? editedCacheGroup.id : undefined)
  );

  const sameNetworkGroups = otherGroups.filter(
    (otherGroup) =>
      otherGroup.network === undefined ||
      editedCacheGroup?.network === undefined ||
      otherGroup.network.id === editedCacheGroup.network.id
  );

  return sameNetworkGroups;
}

function getInitialFormValues(cacheGroup: CacheGroupEntity | undefined): CacheGroupFormData {
  if (cacheGroup) {
    const parentGroup = cacheGroup.parentCacheGroup;
    return {
      name: cacheGroup.name || "",
      latitude: cacheGroup.latitude || 0,
      longitude: cacheGroup.longitude || 0,
      type: cacheGroup.type || "edge",
      fallbackDeliveryUnitGroupsIds: cacheGroup.fallbackCacheGroups.map((group) => group.id),
      parentDeliveryUnitGroupId: parentGroup ? parentGroup.id : "",
      networkId: cacheGroup.network?.id,
      dispersion: cacheGroup.dispersion?.toString(),
      dispersionCalculationMethod: cacheGroup.dispersionCalculationMethod,
    };
  } else {
    return {
      name: "",
      longitude: 0,
      latitude: 0,
      type: "edge",
      fallbackDeliveryUnitGroupsIds: [],
      parentDeliveryUnitGroupId: "",
      networkId: undefined,
      dispersion: (1).toString(),
      dispersionCalculationMethod: DispersionCalculationMethodsEnum.FACTOR,
    };
  }
}

function onAddFallbackGroup(arrayHelpers: ArrayHelpers, newFallbackId: string, otherGroups: CacheGroupEntity[]) {
  if (otherGroups.length >= 0) {
    arrayHelpers.push(newFallbackId);
  } else {
    Notifier.warn("All fallback group IDs are visible - Can't add");
  }
}

//endregion
