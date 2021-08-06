import * as React from "react";
import { ReactNode } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons/faExclamationTriangle";
import { LoadingSpinner } from "../loadingSpinner/loadingSpinner/LoadingSpinner";
import { loggerCreator } from "../../utils/logger";
import { transparentize } from "polished";
import { CommonColors } from "../../styling/commonColors";
import { UseQueryResult } from "react-query/types/react/types";
import { TextTooltip } from "../textTooltip/TextTooltip";

const moduleLogger = loggerCreator("__filename");

//region Styles
const QueryDataContainerView = styled.div`
  position: relative;
`;

// using 2 layer container to handle scrolling containers, from: https://stackoverflow.com/a/11833892
const StatusContainerAbs = styled.div<{ backgroundColor: string }>`
  position: absolute;
  background-color: ${(props) => props.backgroundColor};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;

  width: 100%;
  height: 100%;
  .icon {
    font-size: 18px;
    opacity: 0.5;
  }
`;
const StatusContainerFixed = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 99;
`;
//endregion

export interface Props<T> {
  queryMetadata: UseQueryResult<T>;
  children: (data: T) => ReactNode;

  options?: {
    loadingBackground?: string;
    // set this to true to add a fixed overlay for scrolling
    isScrollingContainer?: boolean;
    spinnerSize?: number;
  };

  className?: string;
}

export const QueryDataContainer = <T extends unknown>(props: Props<T>) => {
  const loadingBackground = props.options?.loadingBackground ?? transparentize(0.1, CommonColors.WHITE);

  function getStatus(): Status<T> {
    let status: Status<T>;
    if (props.queryMetadata.isLoading) {
      status = { status: "loading" };
    } else if (props.queryMetadata.error) {
      let error = new Error("Failed to provide data");
      if (props.queryMetadata.error instanceof Error) {
        error = props.queryMetadata.error;
      }

      status = { status: "error", error: error };
    } else {
      status = { status: "success", data: props.queryMetadata.data ?? (undefined as T) };
    }

    return status;
  }

  function getStatusContainer<T>(statusData: Status<T>, backgroundColor: string) {
    let statusContainer = null;

    if (statusData.status === "error") {
      statusContainer = (
        <StatusContainerAbs backgroundColor={backgroundColor}>
          <TextTooltip content={statusData.error.message}>
            <FontAwesomeIcon className="icon" icon={faExclamationTriangle} />
          </TextTooltip>
        </StatusContainerAbs>
      );
    } else if (statusData.status === "loading") {
      statusContainer = props.options?.isScrollingContainer ? (
        <StatusContainerFixed>
          <StatusContainerAbs backgroundColor={backgroundColor}>
            <LoadingSpinner size={props.options?.spinnerSize} />
          </StatusContainerAbs>
        </StatusContainerFixed>
      ) : (
        <StatusContainerAbs backgroundColor={backgroundColor}>
          <LoadingSpinner size={props.options?.spinnerSize} />
        </StatusContainerAbs>
      );
    }

    return statusContainer;
  }

  const statusData = getStatus();
  const statusContainer = getStatusContainer(statusData, loadingBackground);

  return (
    <QueryDataContainerView className={props.className}>
      {statusData.status === "success" ? props.children(statusData.data) : null}
      {statusContainer}
    </QueryDataContainerView>
  );
};

//region Utility
type Status<T> = LoadingStatus | ErrorStatus | SuccessStatus<T>;

interface LoadingStatus {
  status: "loading";
}
interface ErrorStatus {
  status: "error";
  error: Error;
}
interface SuccessStatus<T> {
  status: "success";
  data: T;
}
//endregion
