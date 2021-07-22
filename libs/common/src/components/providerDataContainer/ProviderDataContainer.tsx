import * as React from "react";
import { MutableRefObject, ReactNode, Ref } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons/faExclamationTriangle";
import { LoadingSpinner } from "common/components/loadingSpinner/loadingSpinner/LoadingSpinner";
import { loggerCreator } from "common/utils/logger";
import { transparentize } from "polished";
import { ProviderMetadata } from "common/components/providerDataContainer/_providers/useProvider";
import { CommonColors } from "common/styling/commonColors";

const moduleLogger = loggerCreator(__filename);

const ProviderDataContainerView = styled.div`
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

export interface Props {
  providerMetadata?: Partial<ProviderMetadata>;
  children?: ReactNode;
  forceLoading?: boolean;
  showChildrenWhileLoading?: boolean;
  loadingBackground?: string;
  disableLoadingSpinner?: boolean;
  // set this to true to add a fixed overlay for scrolling
  isScrollingContainer?: boolean;
  className?: string;
  ref?: MutableRefObject<HTMLDivElement>;
}

export const ProviderDataContainer = React.forwardRef(
  (
    { showChildrenWhileLoading = true, loadingBackground = transparentize(0.1, CommonColors.WHITE), ...props }: Props,
    forwardedRef: Ref<HTMLDivElement>
  ) => {
    const isLoading = props.forceLoading || (props.providerMetadata?.isLoading && !props.providerMetadata?.isError);

    function getStatusContainer(backgroundColor: string) {
      let statusContainer = null;
      if (props.providerMetadata?.isError) {
        statusContainer = (
          <StatusContainerFixed>
            <StatusContainerAbs backgroundColor={backgroundColor}>
              <FontAwesomeIcon className="icon" icon={faExclamationTriangle} />
            </StatusContainerAbs>
          </StatusContainerFixed>
        );
      } else if (isLoading && !props.disableLoadingSpinner) {
        statusContainer = props.isScrollingContainer ? (
          <StatusContainerFixed>
            <StatusContainerAbs backgroundColor={backgroundColor}>
              <LoadingSpinner />
            </StatusContainerAbs>
          </StatusContainerFixed>
        ) : (
          <StatusContainerAbs backgroundColor={backgroundColor}>
            <LoadingSpinner />
          </StatusContainerAbs>
        );
      }

      return statusContainer;
    }

    const statusContainer = getStatusContainer(loadingBackground);

    let children: ReactNode | undefined;
    if (!isLoading || showChildrenWhileLoading) {
      children = props.children;
    }

    return (
      <ProviderDataContainerView ref={forwardedRef} className={props.className}>
        {children}
        {statusContainer}
      </ProviderDataContainerView>
    );
  }
);
