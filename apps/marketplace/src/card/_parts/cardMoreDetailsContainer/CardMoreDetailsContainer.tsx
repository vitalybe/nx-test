import * as React from "react";
import styled, { css } from "styled-components";
import { observer } from "mobx-react";
import { CardSharedTop } from "../cardSharedTop/CardSharedTop";
import { CardCapabilities } from "../cardCapabilities/CardCapabilities";
import { CardContainer } from "../cardContainer/CardContainer";
import { CardMoreDetailsContainerModel } from "./cardMoreDetailsContainerModel";

const CardContainerStyled = styled(CardContainer)`
  height: 100%;
  min-height: 370px;
  overflow: hidden;
`;

const CardMoreDetailsView = styled.div`
  height: 100%;
  min-height: 8em;
  display: flex;
  flex-direction: column;
`;

const MoreDetailsSection = styled.div`
  min-height: 0;
  flex: 1;

  display: flex;
  flex-direction: column;
`;

export interface Props {
  model: CardMoreDetailsContainerModel;
  onClose: () => void;

  className?: string;
}
export type DefaultPropsKeys = never;

const initialState = {};

type State = Readonly<typeof initialState>;

@observer
export class CardMoreDetailsContainer extends React.Component<Props, State> {
  static defaultProps: Pick<Props, DefaultPropsKeys> = {};
  readonly state: State = initialState;

  render() {
    const { model } = this.props;

    return (
      <CardContainerStyled model={model.cardContainerModel} showArrow={false} className={this.props.className}>
        <CardMoreDetailsView className={this.props.className}>
          <CardSharedTop model={model.cardSharedTop} onClose={this.props.onClose} />
          <MoreDetailsSection>
            <CardCapabilities model={model.cardCapabilities} />
            {this.props.children}
          </MoreDetailsSection>
        </CardMoreDetailsView>
      </CardContainerStyled>
    );
  }
}
