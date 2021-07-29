import * as React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons/faExternalLinkAlt";
import { ConfigurationStyles } from "@qwilt/common/components/configuration/_styles/configurationStyles";
import { CommonUrls } from "@qwilt/common/utils/commonUrls";
import { WorkflowStatusBarContainer } from "../workflowStatus/workflowStatusBar/WorkflowStatusBarContainer";
import { ErrorBoundary } from "@qwilt/common/components/ErrorBoundary";
import { CommonStyles } from "@qwilt/common/styling/commonStyles";
import { CommonUrlParams } from "@qwilt/common/urlParams/commonUrlParams";
import { ProjectUrlStore } from "../_stores/projectUrlStore";
import { CdnsDropdown } from "./cdnsDropdown/CdnsDropdown";
import { ProjectUrlParams } from "../_stores/projectUrlParams";
import { CdnEntity } from "../_domain/cdnEntity";

const TopBarView = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  padding-left: 4px;
  column-gap: 2rem;
  justify-items: center;
`;

const TitlePart = styled.div`
  align-self: center;
`;

const TopTitle = styled.div`
  font-size: 22px;
  font-weight: bold;
  align-items: center;
`;

const RightActions = styled.div`
  margin-top: 0.5em;
  display: grid;
  grid-template-columns: auto;
  column-gap: 20px;
  align-self: flex-start;
`;

const FontAwesomeIconStyled = styled(FontAwesomeIcon)`
  margin-left: 0.5rem;
`;

const LogLink = styled.a`
  display: block;
  margin-top: 0.5em;
  text-decoration: none;
  ${CommonStyles.clickableStyle("color", ConfigurationStyles.COLOR_CLICKABLE)};
`;

const WorkflowStatusBarContainerStyled = styled(WorkflowStatusBarContainer)`
  min-width: 750px;
  max-width: 950px;
  width: 100%;
`;

export interface Props {
  selectedCdn: CdnEntity | undefined;
  cdns: CdnEntity[];

  className?: string;
}

export const TopBar = (props: Props) => {
  return (
    <TopBarView className={props.className}>
      <TitlePart>
        <TopTitle>
          <span>CDN MANAGEMENT</span>
        </TopTitle>
        <CdnsDropdown cdns={props.cdns} />
      </TitlePart>
      {props.selectedCdn ? (
        <ErrorBoundary>
          <WorkflowStatusBarContainerStyled cdn={props.selectedCdn} />
        </ErrorBoundary>
      ) : (
        <div />
      )}
      {!ProjectUrlStore.getInstance().getBooleanParam(ProjectUrlParams.tempFlag_tamarDemoOnlyDsAssignments) ? (
        <RightActions>
          <LogLink href={CommonUrls.buildUrl("/cfg-mng", false)}>
            <span>Configuration Management</span>
            <FontAwesomeIconStyled icon={faExternalLinkAlt} />
          </LogLink>
          <LogLink href={CommonUrls.buildUrl("/cfg-dashboard/monitoring", false)}>
            <span>Monitoring</span>
            <FontAwesomeIconStyled icon={faExternalLinkAlt} />
          </LogLink>
          <LogLink
            href={CommonUrls.getKibanaAuditLogUrl(ProjectUrlStore.getInstance().getParam(CommonUrlParams.env))}
            target={"_blank"}>
            <span>Kibana Log</span>
            <FontAwesomeIconStyled icon={faExternalLinkAlt} />
          </LogLink>
        </RightActions>
      ) : null}
    </TopBarView>
  );
};
