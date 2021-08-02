import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { Clickable } from "common/components/configuration/clickable/Clickable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  ApplicationParamsTabRouter,
  TabOptionEnum,
} from "common/components/applicationParameters/ApplicationParamsTabRouter/ApplicationParamsTabRouter";
import { SearchBox } from "common/components/applicationParameters/searchBox/SearchBox";
import { ParamsMetadata } from "common/components/applicationParameters/_types/paramsMetadataTypes";
import { CommonUrlParams, commonUrlParamsMetadata } from "common/urlParams/commonUrlParams";
import { Switch } from "antd";
import { PushpinFilled, PushpinOutlined, ReloadOutlined } from "@ant-design/icons";
import { useUrlBooleanState } from "common/utils/hooks/useUrlState";
import { TextTooltip } from "common/components/textTooltip/TextTooltip";
import { OverridesGrid } from "common/components/applicationParameters/overridesGrid/OverridesGrid";
import "@fortawesome/fontawesome-free/css/all.css";
import "antd/dist/antd.css";
import { ParamsGridContainer } from "common/components/applicationParameters/paramsGridContainer/ParamsGridContainer";
import { QcButton } from "common/components/qcComponents/_styled/qcButton/QcButton";
// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const ApplicationParametersView = styled.div`
  width: 60vw;
  border-radius: 8px;
  box-shadow: 0 2px 22px 0 rgba(0, 0, 0, 0.5);
  background-color: #ffffff;
  color: #21506e;

  display: flex;
  flex-direction: column;
  font-size: 14px;
  min-height: 60vh;
  max-width: 90vw;
  max-height: 90vh;
`;

const TopBars = styled.div`
  display: flex;
  flex-direction: column;
`;

const SecondTopBar = styled.div`
  display: flex;
  align-items: flex-end;
  width: 100%;
  padding-right: 1rem;
  padding-bottom: 0.5em;
  border-bottom: 1px solid #f6fafc;
`;

const RightItemsContainer = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const TitleSection = styled.div`
  padding-top: 2rem;
  text-align: center;
  position: relative;
`;

const Title = styled.span`
  font-size: 1rem;
  font-weight: bold;
`;

const CloseIcon = styled(Clickable)`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
`;

const Content = styled.div`
  height: 30rem;
  min-height: 0;
  padding: 1rem 1.5rem;
`;

const BottomButtons = styled.div`
  padding: 1em;
  display: flex;
  width: 100%;
  border-top: 1px solid #f6fafc;
`;

const QcButtonStyled = styled(QcButton)`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ReloadOutlinedStyled = styled(ReloadOutlined)`
  svg {
    width: 0.875rem;
    height: 0.875rem;
  }
`;
//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  projectParamsMetadata: ParamsMetadata | undefined;
  onClose: () => void;
  className?: string;
}

//endregion [[ Props ]]

export const ApplicationParameters = (props: Props) => {
  const [isDisablePersistentParams, setIsDisablePersistentParams] = useUrlBooleanState(
    CommonUrlParams.disablePersistentParams
  );
  const [selectedTab, setSelectedTab] = useState<TabOptionEnum>(TabOptionEnum.FEATURE_FLAGS);
  const [search, setSearch] = useState<string>("");

  return (
    <ApplicationParametersView className={props.className}>
      <TopBars>
        <TitleSection>
          <Title>Application Parameters</Title>
          <CloseIcon onClick={props.onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </CloseIcon>
        </TitleSection>
        <SecondTopBar>
          <ApplicationParamsTabRouter
            tabs={Object.values(TabOptionEnum).map((tabOption) => ({
              tabOption: tabOption,
              isSelected: tabOption === selectedTab,
              onClick: setSelectedTab,
            }))}
          />
          <RightItemsContainer>
            <SearchBox initialValue={search} onChange={setSearch} />
            <TextTooltip content={`${isDisablePersistentParams ? "Enable" : "Disable"} persistent parameters`}>
              <Switch
                checked={!isDisablePersistentParams}
                onChange={() => setIsDisablePersistentParams(!isDisablePersistentParams)}
                checkedChildren={<PushpinFilled />}
                unCheckedChildren={<PushpinOutlined />}
              />
            </TextTooltip>
          </RightItemsContainer>
        </SecondTopBar>
      </TopBars>
      <Content>
        {selectedTab === TabOptionEnum.FEATURE_FLAGS ? (
          <ParamsGridContainer
            commonMetadata={commonUrlParamsMetadata}
            projectMetadata={props.projectParamsMetadata ?? {}}
            filter={search}
          />
        ) : (
          <OverridesGrid filter={search} />
        )}
      </Content>
      <BottomButtons>
        <QcButtonStyled isHighlighted onClick={() => window.location.reload()}>
          Reload Page
          <ReloadOutlinedStyled />
        </QcButtonStyled>
      </BottomButtons>
    </ApplicationParametersView>
  );
};
