import * as React from "react";
import styled, { css } from "styled-components";
import { observer } from "mobx-react";
import { Colors } from "../_styling/colors";
import { TopBarMetrics } from "./_parts/topBarMetrics/TopBarMetrics";
import { TopBarModel } from "./topBarModel";
import { LoadingSpinner } from "@qwilt/common/components/loadingSpinner/loadingSpinner/LoadingSpinner";
import { TopBarSearch } from "./topBarSearch/TopBarSearch";
import { Fonts } from "@qwilt/common/styling/fonts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons/faExclamationTriangle";
import { autorun } from "mobx";

const TopBarView = styled.div`
  display: flex;
  z-index: 1; // allow the hide-drilldown button to be above the main content

  background-color: ${Colors.DAINTREE};
  position: relative;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;

  color: ${Colors.WHITE};
`;

const TitlePart = styled.div`
  text-transform: uppercase;
`;

const TopTitle = styled.div`
  font-size: 22px;
  margin-bottom: 8px;
`;

const SelectionType = styled.span`
  font-weight: bold;
  margin-right: 0.5em;
`;

const Title = styled.span`
  font-weight: lighter;
`;

const BottomTitle = styled.div`
  color: ${Colors.WHITE};
  font-family: ${Fonts.FONT_FAMILY};
  font-size: 12px;
  font-weight: 900;
`;

const MetricsPart = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const TopBarSearchStyled = styled(TopBarSearch)`
  width: 300px;
`;

const MetricsPlaceholder = styled.div`
  ${(props: { faded?: boolean }) => css`
    height: 61px;
    margin: 1em 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    opacity: ${props.faded ? 0.7 : 1};
    .icon {
      margin-right: 6px;
    }
  `};
`;
export interface Props {
  model: TopBarModel;

  className?: string;
}

const initialState = {};

type State = Readonly<typeof initialState>;

@observer
export class TopBar extends React.Component<Props, State> {
  static defaultProps = {};
  readonly state: State = initialState;
  disposer = autorun(() => {
    if (this.props.model.enabledCount > 0 && this.props.model.status.hasError) {
      this.props.model.status.clearError();
    }
  });
  componentWillUnmount() {
    this.disposer();
  }
  render() {
    const model = this.props.model;
    const isSelectedMode = model.didUserSelectEntities;

    const isLoading = isSelectedMode && model.selectedMetricsAsync.busy;
    const shownMetricsModel = isSelectedMode ? model.selectedMetricsAsync.get() : model.overallMetrics;

    return (
      <TopBarView className={this.props.className}>
        <TitlePart>
          <TopTitle>
            <SelectionType>last hour</SelectionType>
            <Title>open caching</Title>
          </TopTitle>
          <BottomTitle>{isSelectedMode ? model.selectionCountText : "world wide"}</BottomTitle>
        </TitlePart>
        <MetricsPart>
          {model.errorMessage !== "" ? (
            <MetricsPlaceholder faded>
              <FontAwesomeIcon className={"icon"} icon={faExclamationTriangle} />
              {model.errorMessage}
            </MetricsPlaceholder>
          ) : !isLoading && shownMetricsModel ? (
            <TopBarMetrics metrics={shownMetricsModel} />
          ) : (
            <MetricsPlaceholder>
              <LoadingSpinner shakeAnimation={true} size={15} />
            </MetricsPlaceholder>
          )}
        </MetricsPart>
        <TopBarSearchStyled model={model.topBarSearchModel} />
      </TopBarView>
    );
  }
}
