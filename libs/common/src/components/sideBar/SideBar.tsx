import * as _ from "lodash";
import * as React from "react";
import { useRef, useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { CommonColors } from "common/styling/commonColors";
import { RouteMetadata } from "common/stores/_models/routeMetadata";
import { NavButtonsContainer } from "common/components/sideBar/navButtons/NavButtonsContainer";
import { TextTooltip } from "common/components/textTooltip/TextTooltip";
import { CommonUrls } from "common/utils/commonUrls";
import { Ajax } from "common/utils/ajax";
import { Title } from "common/components/sideBar/_styles/sideBarCommon";
import { SideBarStyles } from "common/components/sideBar/_styles/sideBarStyles";
import { SidebarButton } from "common/components/sideBar/sidebarButton/SidebarButton";
import { openQwiltModal } from "../qwiltModal/QwiltModal";
import { RecordFinishedDialog } from "../supportRecording/recordFinishedDialog/RecordFinishedDialog";
import { ContactSupportDialog } from "../supportRecording/contactSupportDialog/ContactSupportDialog";
import { LogRocketUtils } from "common/utils/telemetryRecording/logRocketUtils";
import { Notifier } from "common/utils/notifications/notifier";
import { ApplicationParameters } from "common/components/applicationParameters/ApplicationParameters";
import { ParamsMetadata } from "common/components/applicationParameters/_types/paramsMetadataTypes";
import { UserStore } from "common/stores/userStore";

const moduleLogger = loggerCreator(__filename);

const logoutLogo = require("common/images/sideBar/logout.svg");
const qwiltLogoWithLabel = require("common/images/logo/qwilt-logo.png");
const qwiltLogo = require("common/components/sideBar/_images/qwilt.png");
const qcLogo = require("common/images/logo/qc-logo.png");
const pinNarrowLogo = require("common/images/sideBar/pin-narrow.svg");
const pinWideLogo = require("common/images/sideBar/pin-wide.svg");

//region [[ Styles ]]

const SideBarFill = styled.div<{ isPinned: boolean }>`
  width: ${({ isPinned }) => (isPinned ? SideBarStyles.SIDEBAR_WIDE_WIDTH : SideBarStyles.SIDEBAR_NARROW_WIDTH)};
  height: 100vh;
  z-index: 999;
`;

const SideBarContainer = styled.div<{ isWide: boolean }>`
  transition: 0.2s ease-in-out;
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
  height: 100vh;
  width: ${({ isWide }) => (isWide ? SideBarStyles.SIDEBAR_WIDE_WIDTH : SideBarStyles.SIDEBAR_NARROW_WIDTH)};
  border: 1px solid ${CommonColors.NAVY_4};
  background-color: ${CommonColors.BLUE_LAGOON};
  cursor: default;
  border: 1px solid ${CommonColors.BLACK};
  will-change: transform;
`;

const HeaderContainer = styled.div<{ boxShadowOpacity: number }>`
  display: flex;
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
  transition: 0.3s ease;
  z-index: 999;
  box-shadow: 0 5px 9px 3px rgba(0, 0, 0, ${(props) => props.boxShadowOpacity});
`;

const ContentContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;

  ::-webkit-scrollbar {
    width: 5px;
    display: none;
  }
  &:hover {
    ::-webkit-scrollbar {
      width: 5px;
      display: initial;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: #3780a2;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: #3780a2;
    }
  }
`;

const QcLogoImage = styled.img<{ isWide: boolean }>`
  transition: 0.2s ease;
  margin-left: ${({ isWide }) => (isWide ? "80px" : "8px")};
  margin-right: 36px;
`;

const PinImage = styled.img`
  outline: none;
  cursor: pointer;
  &:hover {
    ${SideBarStyles.WHITE_FILTER}
  }
`;

const QwiltLogoWithLabelImg = styled.img`
  width: 72px;
  height: 100%;
  background-color: #013144;
  padding: 18px 0 18px 16px;
  z-index: 999;
`;

const QwiltLogoImg = styled.img`
  margin-left: 24px;
  height: 16px;
  width: 16px;
`;

const LogoutImg = styled.img`
  width: 32px;
  cursor: pointer;
  opacity: 0.3;
  &:hover {
    opacity: 1;
  }
`;

const UserContainer = styled.div`
  min-height: 56px;
  margin-top: auto;
  display: flex;
  align-items: center;
  width: 100%;
`;

const UserAlias = styled.div`
  margin-left: 16px;
  background-color: #0db2f6;
  color: ${CommonColors.NAVY_2};
  font-size: 18px;
  font-weight: 900;
  width: 32px;
  height: 32px;

  // prevent the circle from morphing when there is no space
  min-width: 32px;
  min-height: 32px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  opacity: 0.3;
  &:hover {
    opacity: 1;
  }

  &:focus {
    outline: none;
  }
`;

const UserName = styled(Title)`
  width: fit-content;
  min-width: 100px;
  margin-left: 12px;
  color: #3780a2;

  ${UserAlias}:hover & {
    color: #0db2f6;
  }
`;

const CopyRightsContainer = styled.div`
  min-height: 56px;
  display: flex;
  align-items: center;
  width: 100%;
  background-color: #013144;
  margin-top: auto;
  overflow-x: hidden;
`;

const VersionContainer = styled.div`
  min-width: 101px;
  padding-bottom: 14px;
  padding-right: 14px;
  position: absolute;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: end;
`;

const Label = styled.div`
  align-self: flex-end;
  text-align: right;
  padding-top: 0;
  position: relative;
  top: 9px;
  color: hsla(197, 100%, 33%, 1);
  font-size: 9px;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  routes: RouteMetadata[][];
  userName: string;
  projectParamsMetadata: ParamsMetadata | undefined;

  className?: string;
}

//endregion [[ Props ]]

export const SideBar = (props: Props) => {
  const { routes, userName } = props;
  const [isMenuPinned, setIsMenuPinned] = useState(false);
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [boxShadowOpacity, setBoxShadowOpacity] = useState<number>(0);

  const viewRef = useRef<HTMLDivElement | null>(null);

  // @ts-ignore - Comes from webpack
  let version = __VERSION__;
  if (typeof version !== "string") {
    version = "vDEV";
  }

  const currentYear = new Date().getFullYear();

  const onLogoutClick = async () => {
    location.href = CommonUrls.addPersistentQueryParams(CommonUrls.logoutUrl);
    Ajax.isRedirecting = true;
  };

  const menuPinChange = () => setIsMenuPinned(!isMenuPinned);
  // eslint-disable-next-line unused-imports/no-unused-vars
  const contentOnScroll = () => {
    if (viewRef.current?.scrollTop !== 0) {
      if (boxShadowOpacity !== 0.28) {
        setBoxShadowOpacity(0.28);
      }
    } else {
      setBoxShadowOpacity(0);
    }
  };

  const onMouseEnter = () => {
    changeSidebarExpansion(true);
  };
  const onMouseLeave = () => {
    if (!isMenuPinned) {
      changeSidebarExpansion(false);
    }
  };

  const changeSidebarExpansion = _.debounce((toExpandedState: boolean) => {
    if (toExpandedState) {
      setIsMenuExpanded(true);
      contentOnScroll();
    } else {
      setBoxShadowOpacity(0);
      setIsMenuExpanded(false);
    }

    Notifier.instance.setBtnOffset(
      isMenuPinned || toExpandedState ? SideBarStyles.SIDEBAR_WIDE_WIDTH : SideBarStyles.SIDEBAR_NARROW_WIDTH
    );
  }, 200);

  const containerRef = useRef<HTMLDivElement>(null);
  const handleElementFocus = (e: React.FocusEvent<HTMLImageElement>) => {
    if (!isMenuExpanded) {
      e.stopPropagation();
    }
    containerRef.current?.scrollTo({ left: 0 });
  };

  return (
    <SideBarFill isPinned={isMenuPinned}>
      <SideBarContainer
        ref={containerRef}
        className={props.className}
        isWide={isMenuExpanded}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}>
        <HeaderContainer boxShadowOpacity={boxShadowOpacity}>
          <QcLogoImage isWide={isMenuExpanded} src={qcLogo} height={"48px"} width={"48px"} alt={"QC Logo"} />
          <TextTooltip content={(isMenuPinned ? "Unpin" : "Pin") + " menu "} ignoreBoundaries>
            <PinImage
              onFocus={handleElementFocus}
              src={isMenuPinned ? pinNarrowLogo : pinWideLogo}
              onClick={menuPinChange}
              alt={"Pin menu"}
            />
          </TextTooltip>
        </HeaderContainer>
        <ContentContainer ref={viewRef} onScroll={contentOnScroll}>
          <NavButtonsContainer routes={routes} isWide={isMenuExpanded} />
          <SidebarButton
            shouldShowTitle={isMenuExpanded}
            isSelected={false}
            image={require("./_images/help.svg")}
            label={"Help"}
            childrenState={"none"}
            isChild={false}
            onClick={showHelpModal}
          />
          {UserStore.instance.isQwiltUser && (
            <SidebarButton
              shouldShowTitle={isMenuExpanded}
              isSelected={false}
              image={require("./_images/url-params.svg")}
              label={"Application Parameters"}
              childrenState={"none"}
              isChild={false}
              onClick={() => showApplicationParameters(props.projectParamsMetadata)}
            />
          )}
          <UserContainer>
            <UserAlias>{userName[0].toUpperCase()}</UserAlias>
            {isMenuExpanded && (
              <>
                <UserName>{userName}</UserName>
                <LogoutImg alt={"qwilt logo"} src={logoutLogo} onClick={onLogoutClick} />
              </>
            )}
          </UserContainer>
        </ContentContainer>
        <CopyRightsContainer>
          {isMenuExpanded ? (
            <>
              <QwiltLogoWithLabelImg alt={"qwilt logo"} src={qwiltLogoWithLabel} />
              <VersionContainer>
                <Label>{version}</Label>
                <Label>© 2012-{currentYear} Qwilt Inc.</Label>
              </VersionContainer>
            </>
          ) : (
            <QwiltLogoImg src={qwiltLogo} />
          )}
          re
        </CopyRightsContainer>
      </SideBarContainer>
    </SideBarFill>
  );
};

function showHelpModal() {
  if (LogRocketUtils.instance.isRecordingLogRocket) {
    openQwiltModal((closeModalWithResult) => <RecordFinishedDialog onClose={closeModalWithResult} />);
  } else {
    openQwiltModal((closeModalWithResult) => <ContactSupportDialog onClose={closeModalWithResult} />);
  }
}

function showApplicationParameters(projectParams: ParamsMetadata | undefined) {
  openQwiltModal(
    (closeModalWithResult) => (
      <ApplicationParameters projectParamsMetadata={projectParams} onClose={closeModalWithResult} />
    ),
    {
      closeOnClickOutside: true,
    }
  );
}
