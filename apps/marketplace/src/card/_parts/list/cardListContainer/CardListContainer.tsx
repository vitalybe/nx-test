import * as React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { Fonts } from "common/styling/fonts";
import { Colors } from "src/_styling/colors";
import { CardListRow } from "src/card/_parts/list/cardListRow/CardListRow";
import { CardStyle } from "src/card/cardStyle";

const CardListContainerView = styled.div`
  border-top: 1px solid ${Colors.GRAY_4};
  font-size: ${Fonts.FONT_SIZE_12};
  display: flex;
  flex-direction: column;
  min-height: 140px;
`;

const Header = styled.div`
  font-weight: bold;
  text-transform: uppercase;
  padding: ${CardStyle.LIST_HEADER_PADDING};
`;

const CardContent = styled.div`
  overflow-y: auto;
`;

export interface Props {
  header: string;
  count: number;
  children?: React.ReactElement<CardListRow>[];

  className?: string;
}
export type DefaultPropsKeys = never;

const initialState = {};

type State = Readonly<typeof initialState>;

@observer
export class CardListContainer extends React.Component<Props, State> {
  static defaultProps: Pick<Props, DefaultPropsKeys> = {};
  readonly state: State = initialState;

  render() {
    return (
      <CardListContainerView className={this.props.className}>
        <Header>
          {this.props.header} ({this.props.count})
        </Header>
        <CardContent>{this.props.children}</CardContent>
      </CardListContainerView>
    );
  }
}
