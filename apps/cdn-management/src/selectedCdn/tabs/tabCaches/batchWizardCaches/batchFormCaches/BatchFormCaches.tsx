import * as React from "react";
import { ReactElement, useMemo, useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import {
  FormikContainer,
  OverrideButtons,
  Props as FormikContainerProps,
} from "common/components/configuration/formik/formikContainer/FormikContainer";
import { CacheEntityFormType } from "src/selectedCdn/tabs/tabCaches/batchWizardCaches/_domain/cacheEntitySchema";
import { FormikReactSelect } from "common/components/configuration/formik/formikReactSelect/FormikReactSelect";
import { DropDownOption } from "common/components/configuration/qwiltForm/qwiltReactSelect/QwiltReactSelect";
import { CacheOperationalModeApiEnum } from "common/backend/cdns/_types/deliveryUnitApiType";
import { enumValues } from "common/utils/typescriptUtils";
import { MonitorSegmentEntity } from "src/selectedCdn/tabs/tabMonitorSegments/_domain/MonitorSegmentEntity";
import { useProvider } from "common/components/providerDataContainer/_providers/useProvider";
import { MonitorSegmentProvider } from "src/selectedCdn/tabs/tabMonitorSegments/_providers/MonitorSegmentProvider";
import { DateTime } from "luxon";
import { ProviderDataContainer } from "common/components/providerDataContainer/ProviderDataContainer";
import { FormikJson } from "common/components/configuration/formik/formikJson/FormikJson";
import { ConfigurationStyles } from "common/components/configuration/_styles/configurationStyles";
import { FieldWithCheckbox } from "src/selectedCdn/tabs/tabCaches/batchWizardCaches/batchFormCaches/fieldWithCheckbox/FieldWithCheckbox";
import { LoadingSpinnerGlobal } from "common/components/loadingSpinner/loadingSpinnerGlobal/LoadingSpinnerGlobal";
import _ from "lodash";
import { CacheEntity } from "src/_domain/cacheEntity";
import { CacheGroupEntity } from "src/_domain/cacheGroupEntity";
import { defaultHealthProfile } from "src/_domain/defaultHealthProfile";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const BatchFromCachesView = (styled(FormikContainer)`
  width: 100%;
` as unknown) as <T extends unknown>(props: FormikContainerProps<T>) => ReactElement;

const Content = styled(ProviderDataContainer)`
  height: 100%;
  overflow-y: auto;
  max-height: 80vh;
  display: grid;
  padding-top: 0.5em;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
`;

const FieldWithCheckboxStyled = styled(FieldWithCheckbox)`
  grid-column: span 2;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  onCancel: () => void;
  onBack: () => void;
  onNext: (cacheFormData: CacheEntityFormType) => void;
  cdnId: string;
  caches: CacheEntity[];
  cacheGroups: CacheGroupEntity[];
  className?: string;
}

//endregion [[ Props ]]

export const BatchFormCaches = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastRefreshDate, setLastRefreshDate] = useState<DateTime>(DateTime.local());
  const { data: segments, metadata } = useProvider(() => MonitorSegmentProvider.instance.provide(props.cdnId), false, [
    lastRefreshDate,
  ]);

  const allOperationsModes: CacheOperationalModeApiEnum[] = enumValues(CacheOperationalModeApiEnum);
  const initialValues: CacheEntityFormType = {
    healthProfile: defaultHealthProfile,
    disabledFields: {
      group: true,
      operationalMode: true,
      monitoringSegmentId: true,
      healthProfile: true,
    },
  };

  const buttons: OverrideButtons<CacheEntityFormType>[] = useMemo(() => {
    return [
      {
        label: "Cancel",
        onClick: props.onCancel,
      },
      {
        label: "< Back",
        onClick: props.onBack,
      },
      {
        label: "Update >",
        onClick: (cacheFormData: CacheEntityFormType) => props.onNext(cacheFormData),
        canDisabled: true,
      },
    ];
  }, [props]);

  const getDeliveryUnitGroupsOptions = (selectedCaches: CacheEntity[], canAssignGroups: boolean) => {
    if (canAssignGroups) {
      const network = selectedCaches[0].network;
      const sameNetworkCacheGroups = props.cacheGroups.filter(
        (dug) => dug.network === undefined || network === undefined || dug.network.id === network.id
      );

      return sameNetworkCacheGroups.map((deliveryUnitGroup) => {
        const dropDownOption: DropDownOption<CacheGroupEntity> = {
          value: deliveryUnitGroup,
          label: deliveryUnitGroup.name,
        };
        return dropDownOption;
      });
    } else {
      return [];
    }
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

  const createNewMonitorSegment = async (monitoringSegmentId: string) => {
    setIsLoading(true);
    await MonitorSegmentProvider.instance.update(props.cdnId, new MonitorSegmentEntity(monitoringSegmentId, []), false);
    setLastRefreshDate(DateTime.local());
    setIsLoading(false);
    return monitoringSegmentId;
  };

  const onValidate = (cacheFormData: CacheEntityFormType) => {
    const errors: { [key: string]: string } = {};
    const disabledFields = cacheFormData.disabledFields;

    if (Object.values(disabledFields).every((value) => value)) {
      errors["fields"] = "No fields selected";
    }

    Object.keys(disabledFields).forEach((key) => {
      // @ts-ignore
      if (!disabledFields[key] && cacheFormData[key] === undefined) {
        errors[key] = _.startCase(key) + ": Selected field must have value";
      }
    });

    return errors;
  };

  const canAssignGroups = props.caches?.every((cache, i, array) => cache.network?.id === array[0]?.network?.id);

  return (
    <BatchFromCachesView<CacheEntityFormType>
      className={props.className}
      title={"Batch Editor - Form"}
      isEdit={false}
      onCancel={props.onCancel}
      initialValues={initialValues}
      initialValidation={true}
      validate={onValidate}
      overrideButtons={buttons}
      onOk={async () => {}}
      formikProps={{ isInitialValid: false }}>
      {(formikProps) => {
        const disabledFields = formikProps.values.disabledFields;
        return (
          <Content providerMetadata={metadata} loadingBackground={ConfigurationStyles.COLOR_BACKGROUND}>
            {metadata.isLoading || isLoading ? (
              <LoadingSpinnerGlobal />
            ) : (
              <>
                <FieldWithCheckbox
                  name={"disabledFields.group"}
                  disabled={!canAssignGroups}
                  disabledTooltip={"Can't assign group - Selected caches are from different networks"}>
                  <FormikReactSelect<CacheGroupEntity>
                    disabled={!canAssignGroups || disabledFields.group}
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
                    options={getDeliveryUnitGroupsOptions(props.caches, canAssignGroups)}
                  />
                </FieldWithCheckbox>
                <FieldWithCheckbox name={"disabledFields.operationalMode"}>
                  <FormikReactSelect<string>
                    field={"operationalMode"}
                    label={"Operational Mode"}
                    isMenuPositionFixed={false}
                    disabled={disabledFields.operationalMode}
                    reactSelectProps={{
                      menuPortalTarget: document.body,
                      styles: {
                        menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
                      },
                    }}
                    options={getOperationalModeOptions()}
                  />
                </FieldWithCheckbox>
                <FieldWithCheckbox name={"disabledFields.monitoringSegmentId"}>
                  <FormikReactSelect<string>
                    field={"monitoringSegmentId"}
                    label={"Monitor Segment"}
                    disabled={disabledFields.monitoringSegmentId}
                    isMenuPositionFixed={false}
                    reactSelectProps={{
                      menuPortalTarget: document.body,
                      styles: {
                        menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
                      },
                    }}
                    onCreateNew={(monitoringSegmentId) => {
                      createNewMonitorSegment(monitoringSegmentId);
                      return monitoringSegmentId;
                    }}
                    options={getMonitorSegmentsOptions(segments)}
                  />
                </FieldWithCheckbox>
                <FieldWithCheckboxStyled name={"disabledFields.healthProfile"}>
                  <FormikJson
                    canMinimize
                    disabled={disabledFields.healthProfile}
                    field={"healthProfile"}
                    label={"Health Profile"}
                    value={defaultHealthProfile}
                  />
                </FieldWithCheckboxStyled>
              </>
            )}
          </Content>
        );
      }}
    </BatchFromCachesView>
  );
};
