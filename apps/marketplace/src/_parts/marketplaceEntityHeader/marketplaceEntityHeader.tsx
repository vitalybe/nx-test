import * as React from "react";
import styled, { css } from "styled-components";
import { Colors } from "src/_styling/colors";
import { MarketplaceEntityHeaderModel } from "src/_parts/marketplaceEntityHeader/marketplaceEntityHeaderModel";
import { observer } from "mobx-react";
// @ts-ignore
import Dotdotdot from "react-dotdotdot";
import { MarketplaceImageWithFallback } from "src/_parts/marketplaceImageWithFallback/MarketplaceImageWithFallback";

const MarketplaceEntityHeaderView = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  color: ${Colors.NAVY_1};
  text-align: center;
  align-items: center;
`;

const ImageWithFallbackStyled = styled(MarketplaceImageWithFallback)`
  img {
    height: 32px;
  }
`;

const NameText = styled.div`
  ${(props: { nameFontSize: string }) => css`
    font-size: ${props.nameFontSize};
    text-transform: uppercase;
    overflow: hidden;
  `};
`;

const ParentLocation = styled.div`
  margin-top: 5px;
  font-weight: bold;
  font-size: 11px;
  text-transform: uppercase;
`;

export interface Props {
  model: MarketplaceEntityHeaderModel;
  nameFontSize?: string;

  className?: string;
}
export type DefaultPropsKeys = "nameFontSize";

const initialState = {};
type State = Readonly<typeof initialState>;

@observer
export class MarketplaceEntityHeader extends React.Component<Props, State> {
  static defaultProps: Pick<Props, DefaultPropsKeys> = {
    nameFontSize: "17px",
  };
  readonly state: State = initialState;

  render() {
    const model = this.props.model;
    const titleHeight = "50px";
    return (
      <MarketplaceEntityHeaderView className={this.props.className} {...this.props}>
        {model.ispImagePath ? (
          <ImageWithFallbackStyled
            imagePath={model.ispImagePath}
            fallbackElement={
              <NameText nameFontSize={this.props.nameFontSize!}>
                <Dotdotdot clamp={titleHeight}>{model.title}</Dotdotdot>
              </NameText>
            }
          />
        ) : (
          <NameText nameFontSize={this.props.nameFontSize!}>
            <Dotdotdot clamp={titleHeight}>{model.title}</Dotdotdot>
          </NameText>
        )}
        {model.location ? <ParentLocation>{model.location}</ParentLocation> : null}
      </MarketplaceEntityHeaderView>
    );
  }
}
