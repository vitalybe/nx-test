import * as React from "react";
import { MouseEvent, RefObject } from "react";
import styled, { css } from "styled-components";
import { observer } from "mobx-react";
import { DrillDownLegendCardModel } from "./drillDownLegendCardModel";
import { Colors } from "src/_styling/colors";
import { NativeAnimations } from "common/styling/animations/nativeAnimations";
import { LoadingSpinner } from "common/components/loadingSpinner/loadingSpinner/LoadingSpinner";
import { Tooltip } from "common/components/Tooltip";
import Scrollbars from "react-custom-scrollbars";
import { RemoveCardCloseButton, RemoveCardModal } from "src/drillDown/removeCardModal/RemoveCardModal";
import { toast } from "react-toastify";
import { CloseButton } from "common/components/closeButton/CloseButton";
import { Metric, Unit, Value } from "common/components/metrics/Metric";
import { Fonts } from "common/styling/fonts";
import { MarketplaceImageWithFallback } from "src/_parts/marketplaceImageWithFallback/MarketplaceImageWithFallback";

const LegendCardView = styled.div`
  ${(props: { isPeak: boolean; isEnabled: boolean }) => css`
    display: flex;
    flex-direction: column;
    padding: 5px 24px;
    width: fit-content;
    flex: 0 0 auto;
    background-color: ${Colors.GRAY_2};
    border-radius: 6px;
    cursor: pointer;
    transition: 0.2s ease-out;
    min-height: 49px;
    align-items: center;
    &:not(:first-of-type) {
      margin-left: 8px;
    }
    &:hover {
      transform: ${props.isPeak && props.isEnabled ? "none" : "translateY(-4px)"};
      box-shadow: 0 12px 14px 0 rgba(0, 0, 0, 0.12);
      ${CloseButtonStyled} {
        opacity: 1;
      }
    }
  `};
`;

const Header = styled.header<{ isEnabled: boolean }>`
  display: flex;
  align-items: flex-end;
  position: relative;
  width: 100%;
  height: 1rem;
  text-align: center;
  opacity: ${(props) => (props.isEnabled ? 1 : 0.5)};
`;
const ColorSquare = styled.i<{ color: string }>`
  background-color: ${(props) => props.color};
  height: 10px;
  width: 10px;
  border-radius: 6px;
  margin-right: 5px;
  position: absolute;
  left: -17px;
  top: 3px;
`;
const Title = styled.span`
  text-transform: uppercase;
  max-width: 200px;
  overflow: hidden;
  max-height: 1rem;
  margin: 0 auto;
  line-height: 1;
`;
const SubTitle = styled.span`
  text-transform: uppercase;
  margin-left: 5px;
  opacity: 0.7;
  font-size: 0.7rem;
  text-align: center;

  &:focus {
    outline: none;
  }
`;
const IspLogo = styled(MarketplaceImageWithFallback)`
  margin: 0 auto;
`;
const MetricStyled = styled(Metric)<{
  isEnabled: boolean;
}>`
  max-width: 100%;
  width: 65px;
  margin-top: 5px;
  transition: 0.3s ease-out;
  transform: translateX(${(props) => (props.isEnabled ? 0 : "-20px")});
  opacity: ${(props) => (props.isEnabled ? 1 : 0)};

  ${Value} {
    font-size: ${Fonts.FONT_SIZE_16};
  }

  ${Unit} {
    font-size: ${Fonts.FONT_SIZE_12};
  }
`;

const LoadingSpinnerStyled = styled(LoadingSpinner)`
  margin-top: 7px;
`;

const CloseButtonStyled = styled(CloseButton)`
  position: absolute;
  right: -15px;
  top: 1px;
  opacity: 0;
  width: 10px;
`;

export interface Props {
  model: DrillDownLegendCardModel;
  sideScroller?: RefObject<Scrollbars>;
}

const initialState = {
  openModal: false,
  itemName: "",
};

type State = Readonly<typeof initialState>;

//for some reason Scrollbars is missing this property, but its there.
interface ScrollbarsExt extends Scrollbars {
  view: HTMLDivElement;
}

@observer
export class DrillDownLegendCard extends React.Component<Props, State> {
  element: RefObject<HTMLDivElement> = React.createRef();

  static defaultProps = {};
  readonly state: State = initialState;

  ensurePositionInView = () => {
    if (this.props.sideScroller && this.props.sideScroller.current && this.element.current) {
      const sideScroller = this.props.sideScroller.current;
      const currentScrollDelta = sideScroller.getScrollLeft();

      const containerMeasures = (sideScroller as ScrollbarsExt).view.getBoundingClientRect() as DOMRect;
      const containerEdgeRight = Math.ceil(containerMeasures.x + containerMeasures.width);
      const containerEdgeLeft = Math.floor(containerMeasures.x);

      const viewMeasures = this.element.current.getBoundingClientRect() as DOMRect;
      const viewEdgeRight = Math.ceil(viewMeasures.x + viewMeasures.width + 15);
      const viewEdgeLeft = Math.floor(viewMeasures.x - 5);

      if (viewEdgeRight > containerEdgeRight) {
        NativeAnimations.runValues(currentScrollDelta, viewEdgeRight - containerEdgeRight, 200, (value: number) => {
          sideScroller.scrollLeft(value);
        });
      }
      if (viewEdgeLeft < containerEdgeLeft) {
        NativeAnimations.runValues(currentScrollDelta, viewEdgeLeft - containerEdgeLeft, 200, (value: number) => {
          sideScroller.scrollLeft(value);
        });
      }
    }
  };

  handleMouseEnter = () => {
    this.ensurePositionInView();
    this.props.model.highlightSeries(this.props.model.id);
  };

  handleMouseOut = () => {
    this.props.model.highlightSeries(undefined);
  };

  onUndo() {
    this.props.model.undoRemove();
  }

  render() {
    const { color, title, currentMetric, isEnabled, isPeak, ispIcon, parentLocation } = this.props.model;
    return (
      <LegendCardView
        ref={this.element}
        isPeak={isPeak}
        isEnabled={isEnabled}
        onClick={this.props.model.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseOut}>
        <Header isEnabled={isEnabled}>
          <ColorSquare color={color} />
          {ispIcon ? <IspLogo imagePath={ispIcon} fallbackElement={<Title>{title}</Title>} /> : <Title>{title}</Title>}
          {parentLocation.firstParent ? (
            <Tooltip delay={400} ignoreBoundaries content={parentLocation.fullNameLabel}>
              <SubTitle>({parentLocation.fullIsoLabel})</SubTitle>
            </Tooltip>
          ) : null}
          <CloseButtonStyled
            onClick={(e: MouseEvent<HTMLButtonElement> | undefined) => {
              this.props.model.removeSelf(e);

              toast(<RemoveCardModal onUndo={this.onUndo.bind(this)} itemName={title.toUpperCase()} />, {
                position: toast.POSITION.BOTTOM_CENTER,
                hideProgressBar: true,
                draggable: false,
                closeOnClick: false,
                closeButton: <RemoveCardCloseButton />,
              });
            }}
          />
        </Header>
        {currentMetric ? (
          <MetricStyled
            isEnabled={isEnabled}
            units={currentMetric.unit}
            value={currentMetric.getPretty()}
            description={""}
          />
        ) : (
          <LoadingSpinnerStyled size={7} />
        )}
      </LegendCardView>
    );
  }
}
