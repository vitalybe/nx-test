import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { observer } from "mobx-react-lite";
import { FormikContainer } from "@qwilt/common/components/configuration/formik/formikContainer/FormikContainer";
import { FormikInput } from "@qwilt/common/components/configuration/formik/formikInput/FormikInput";
import { FormikState } from "formik";
import { CacheOperationalModeApiEnum } from "@qwilt/common/backend/cdns/_types/deliveryUnitApiType";
import { enumValues, OnlyData } from "@qwilt/common/utils/typescriptUtils";
import { FormikToggle } from "@qwilt/common/components/configuration/formik/formikToggle/FormikToggle";
import { MonitorSegmentEntity } from "../../tabMonitorSegments/_domain/MonitorSegmentEntity";
import { MonitorSegmentProvider } from "../../tabMonitorSegments/_providers/MonitorSegmentProvider";
import { FormikReactSelect } from "@qwilt/common/components/configuration/formik/formikReactSelect/FormikReactSelect";
import { DropDownOption } from "@qwilt/common/components/configuration/qwiltForm/qwiltReactSelect/QwiltReactSelect";
import { QwiltFormGroup } from "@qwilt/common/components/configuration/qwiltForm/qwiltFormGroup/QwiltFormGroup";
import { FormikJson } from "@qwilt/common/components/configuration/formik/formikJson/FormikJson";
import { ProjectUrlParams } from "../../../../_stores/projectUrlParams";
import { LoadingSpinnerGlobal } from "@qwilt/common/components/loadingSpinner/loadingSpinnerGlobal/LoadingSpinnerGlobal";
import { ConfigurationStyles } from "@qwilt/common/components/configuration/_styles/configurationStyles";
import { ProjectUrlStore } from "../../../../_stores/projectUrlStore";
import { QwiltInput } from "@qwilt/common/components/configuration/qwiltForm/qwiltInput/QwiltInput";
import { Constants } from "../../../../_utils/constants";
import { useMutation } from "react-query";
import { CdnsApi } from "@qwilt/common/backend/cdns";
import { Notifier } from "@qwilt/common/utils/notifications/notifier";
import { CacheEntity } from "../../../../_domain/cacheEntity";
import { useSelectedCdn } from "../../../../_stores/selectedCdnStore";
import { CachesProvider } from "../../../../_providers/cachesProvider";
import { CacheGroupEntity } from "../../../../_domain/cacheGroupEntity";
import { defaultHealthProfile } from "../../../../_domain/defaultHealthProfile";

//region [[Styles]]
const EditorDuContainer = styled.div`
  background: ${ConfigurationStyles.COLOR_BACKGROUND};
  box-shadow: ${ConfigurationStyles.SHADOW};
  height: fit-content;
  min-height: 30vh;
  width: 50vw;
`;

const Content = styled.div`
  overflow-y: auto;
  max-height: 80vh;
  display: grid;
  padding-top: 0.5em;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
`;

const FormikGroupStyled = styled(QwiltFormGroup)`
  grid-column: span 2;
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
  align-items: center;
  padding: 1em;

  &:not(:last-child) {
    margin-bottom: 1em;
  }
`;

const InterfaceErrorInput = styled(QwiltInput)`
  grid-column: 1 / span 2;
`;

const FormikGroupEmpty = styled(QwiltFormGroup)`
  padding: 1.5em 1em 1em;
  grid-column: span 2;
`;

const FormikToggleStyled = styled(FormikToggle)`
  grid-column: span 1;
`;

const RoutingNameInput = styled(FormikInput)<{ isVisible: boolean }>`
  grid-column: span 2;
  visibility: ${(props) => (props.isVisible ? "visible" : "hidden")};
`;

const FormikJsonStyled = styled(FormikJson)`
  grid-column: span 2;
`;
//endregion

export interface Props {
  cache: CacheEntity;
  cacheGroups: CacheGroupEntity[];
  monitorSegments: MonitorSegmentEntity[];

  isEdit: boolean;
  isView?: boolean;

  onClose: () => void;
  className?: string;
}

export const EditorCache = observer(({ isView = false, ...props }: Props) => {
  const cdn = useSelectedCdn();
  const allOperationsModes: CacheOperationalModeApiEnum[] = enumValues(CacheOperationalModeApiEnum);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const mutateSaveCache = useMutation<void, Error, CacheEntity>(
    async (editedCache) => {
      setIsLoading(true);

      const editedDeliveryUnitApi = editedCache.toEditApiType();
      if (props.isEdit) {
        if (!!editedDeliveryUnitApi.duGroupId) {
          await CdnsApi.instance.deliveryUnitsUpdate(cdn.id, editedCache.id, editedDeliveryUnitApi);
        }
      } else {
        await CdnsApi.instance.deliveryUnitsCreate(cdn.id, editedDeliveryUnitApi);
      }

      setIsLoading(false);
    },
    {
      onSuccess: () => {
        props.onClose();
        CachesProvider.instance.prepareQuery(cdn.id).invalidateWithChildren();
      },
      onError: (e) => Notifier.error("Save failed: " + e.message, e),
    }
  );

  const mutateSaveMonitorSegment = useMutation<void, Error, string>(
    async (monitorSegmentId) => {
      setIsLoading(true);
      await MonitorSegmentProvider.instance.update(cdn.id, new MonitorSegmentEntity(monitorSegmentId, []), false);
      setIsLoading(false);
    },
    {
      onSuccess: () => {
        MonitorSegmentProvider.instance.prepareQuery(cdn.id).invalidateWithChildren();
      },
      onError: (e) => Notifier.error("Save failed: " + e.message, e),
    }
  );

  const onOk = async (editedData: OnlyData<CacheEntity>) => {
    const editedDeliveryUnit = new CacheEntity(editedData);
    editedDeliveryUnit.monitoringSegmentId =
      editedData.monitoringSegmentId === "" || editedData.monitoringSegmentId === "---"
        ? undefined
        : editedData.monitoringSegmentId;
    await mutateSaveCache.mutate(editedDeliveryUnit);
  };

  const getMonitorSegmentsOptions = (segments: MonitorSegmentEntity[] | undefined) => {
    const monitorSegmentsOptions: DropDownOption<string>[] =
      segments?.map((segment) => {
        const dropDownOption: DropDownOption<string> = {
          value: segment.id,
          label: segment.id,
        };
        return dropDownOption;
      }) ?? [];
    monitorSegmentsOptions.unshift({ value: "---", label: "---" });
    return monitorSegmentsOptions;
  };

  const getDeliveryUnitGroupsOptions = (deliveryUnit: CacheEntity, deliveryUnitGroups: CacheGroupEntity[]) => {
    let sameNetworkDugs = deliveryUnitGroups;
    sameNetworkDugs = deliveryUnitGroups.filter(
      (dug) =>
        dug.network === undefined || deliveryUnit.network === undefined || dug.network.id === deliveryUnit.network.id
    );

    return (
      sameNetworkDugs.map((deliveryUnitGroup) => {
        const dropDownOption: DropDownOption<CacheGroupEntity> = {
          value: deliveryUnitGroup,
          label: deliveryUnitGroup.name,
        };
        return dropDownOption;
      }) ?? []
    );
  };

  const getOperationalModeOptions = () => {
    const operationalModes: DropDownOption<string>[] = [];
    allOperationsModes.map((mode) => {
      operationalModes.push({
        value: mode,
        label: mode,
      });
    });
    return operationalModes ?? [];
  };

  return (
    <EditorDuContainer>
      {isLoading ? (
        <LoadingSpinnerGlobal />
      ) : (
        <FormikContainer<CacheEntity>
          title={"Cache"}
          isEdit={props.isEdit}
          isView={isView}
          initialValues={props.cache}
          validate={onValidate}
          initialValidation={true}
          onOk={onOk}
          onCancel={props.onClose}
          cancelLabel={isView ? "Close" : undefined}
          className={props.className}>
          {(formikState: FormikState<CacheEntity>) => (
            <Content>
              <FormikInput field={"cacheId"} label={"System ID"} disabled />
              <FormikInput field={"name"} label={"Name"} preventCapital disabled={isView} />
              <FormikReactSelect<CacheGroupEntity>
                disabled={isView}
                field={"group"}
                label={"Group"}
                isMenuPositionFixed={false}
                reactSelectProps={{
                  menuPortalTarget: document.body,
                  styles: {
                    menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
                  },
                }}
                idGetter={(dug) => dug.id}
                options={getDeliveryUnitGroupsOptions(props.cache, props.cacheGroups)}
              />
              <FormikInput field={"cacheHashId"} label={"Cache hash id"} disabled={true} />
              <FormikReactSelect<string>
                disabled={isView}
                field={"operationalMode"}
                label={"Operational mode"}
                value={formikState.values.operationalMode}
                isMenuPositionFixed={false}
                reactSelectProps={{
                  menuPortalTarget: document.body,
                  styles: {
                    menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
                  },
                }}
                options={getOperationalModeOptions()}
              />
              <FormikReactSelect<string>
                disabled={isView}
                field={"monitoringSegmentId"}
                label={"Monitor Segment"}
                isMenuPositionFixed={false}
                reactSelectProps={{
                  menuPortalTarget: document.body,
                  styles: {
                    menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
                  },
                }}
                onCreateNew={(monitorSegmentId) => {
                  mutateSaveMonitorSegment.mutate(monitorSegmentId);
                  return monitorSegmentId;
                }}
                options={getMonitorSegmentsOptions(props.monitorSegments)}
              />

              {formikState.values.interfaces.length === 0 && (
                <FormikGroupEmpty label={"Interfaces"}>None</FormikGroupEmpty>
              )}
              {formikState.values.interfaces.map((duInterface, i) => (
                <FormikGroupStyled key={i} label={"Interface"}>
                  {duInterface.cacheInterface ? (
                    <>
                      <FormikInput field={`interfaces[${i}].cacheInterface.name`} label={"Name"} disabled />
                      <FormikInput field={`interfaces[${i}].cacheInterface.ipv4Address`} label={"IP v4"} disabled />
                      <FormikInput field={`interfaces[${i}].cacheInterface.ipv6Address`} label={"IP v6"} disabled />
                    </>
                  ) : (
                    <InterfaceErrorInput
                      onChange={() => {}}
                      value={Constants.CACHE_DELETED_INTERFACES}
                      label={"Error"}
                      disabled
                    />
                  )}
                  {/* temp flag */}
                  {ProjectUrlStore.getInstance().getParamExists(
                    ProjectUrlParams.tempFlag_deliveryInterfaceHashFields
                  ) && (
                    <>
                      <FormikInput field={`interfaces[${i}].hashId`} label={"Hash ID"} disabled={isView} />
                      <FormikInput field={`interfaces[${i}].hashCount`} label={"Hash Count"} disabled={isView} />
                      <FormikInput
                        field={`interfaces[${i}].hashCountOffset`}
                        label={"Hash Count Offset"}
                        disabled={isView}
                      />
                    </>
                  )}

                  <FormikToggleStyled field={`interfaces[${i}].isEnabled`} label={"Is Attached"} disabled={isView} />
                  <RoutingNameInput
                    disabled={isView}
                    field={`interfaces[${i}].routingName`}
                    label={"Routing name"}
                    isVisible={formikState.values.interfaces[i].isEnabled}
                  />
                </FormikGroupStyled>
              ))}
              <FormikJsonStyled
                disabled={isView}
                canMinimize
                field={"healthProfile"}
                label={"Health Profile"}
                value={props.cache.healthProfile ?? defaultHealthProfile}
              />
            </Content>
          )}
        </FormikContainer>
      )}
    </EditorDuContainer>
  );
});

function onValidate(deliveryUnit: CacheEntity) {
  const errors: { [key: string]: string } = {};

  if (!deliveryUnit.group) {
    errors["group"] = "Missing group";
  }

  if (!deliveryUnit.monitoringSegmentId) {
    errors["monitoringSegmentId"] = "Monitoring segment isn't defined";
  }

  return errors;
}
