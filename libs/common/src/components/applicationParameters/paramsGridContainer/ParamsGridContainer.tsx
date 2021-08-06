import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../utils/logger";
import { ParamsMetadata, ParamsMetadataType } from "../_types/paramsMetadataTypes";
import { ParamsGrid, ParamsGridItem } from "./paramsGrid/ParamsGrid";
import { API_OVERRIDE_PREFIX, CommonUrlParams, commonUrlParamsMetadata } from "../../../urlParams/commonUrlParams";
import _ from "lodash";
import { useMemo } from "react";
import { UrlStore } from "../../../stores/urlStore/urlStore";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const ParamsGridContainerView = styled.div`
  height: 100%;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  commonMetadata: ParamsMetadata;
  projectMetadata: ParamsMetadata;
  filter: string;
  className?: string;
}

//endregion [[ Props ]]

export const ParamsGridContainer = (props: Props) => {
  const paramValueMap = useMemo(
    () =>
      new Map(
        Object.entries({ ...commonUrlParamsMetadata, ...props.projectMetadata }).map(([param, data]) => {
          let stringValue;
          if (data.type === "boolean") {
            stringValue = String(UrlStore.getInstance().getParamExists(param));
          } else {
            stringValue = UrlStore.getInstance().getParam(param) ?? "";
          }

          return [param, stringValue];
        })
      ),
    [props.projectMetadata]
  );

  const paramsGridItems = useMemo(
    () => getParamsGridItems(commonUrlParamsMetadata, props.projectMetadata ?? {}, paramValueMap),
    [props.projectMetadata, paramValueMap]
  );

  return (
    <ParamsGridContainerView className={props.className}>
      <ParamsGrid items={paramsGridItems} paramsValueMap={paramValueMap} filter={props.filter} />
    </ParamsGridContainerView>
  );
};

function getParamsGridItems(
  commonMetadata: ParamsMetadata,
  projectMetadata: ParamsMetadata,
  paramValueMap: Map<string, string>
): ParamsGridItem[] {
  let gridItems: ParamsGridItem[] = [
    ...convertMetadataToGridItem(projectMetadata),
    ...convertMetadataToGridItem(commonMetadata, true),
  ];

  gridItems = gridItems.filter(
    (item) => !(item.param.startsWith(API_OVERRIDE_PREFIX) || item.param === CommonUrlParams.disablePersistentParams)
  );

  //Initial order: active, project, common, parameter name
  return _.orderBy(gridItems, [
    (item) => paramHasValue(paramValueMap.get(item.param)),
    (item) => (item.isCommon ? "b" : "a"),
    (item) => item.param,
  ]);
}

function convertMetadataToGridItem(metadata: ParamsMetadata, isCommon = false): ParamsGridItem[] {
  const existingItems = Object.entries(metadata).filter(([, data]) => !!data) as [string, ParamsMetadataType][];
  return existingItems.map(([param, data]) => {
    return {
      ...data,
      param,
      isCommon,
    };
  });
}

function paramHasValue(value: string | undefined): string {
  return !(!value || value === "false") ? "a" : "b";
}
