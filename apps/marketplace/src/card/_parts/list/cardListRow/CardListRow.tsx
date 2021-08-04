import * as React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { Colors } from "src/_styling/colors";
import transparentize from "polished/lib/color/transparentize";
import { CardStyle } from "src/card/cardStyle";
import { ParentLocation } from "src/_domain/parentLocation";
import { Tooltip } from "common/components/Tooltip";
import { MarketplaceImageWithFallback } from "src/_parts/marketplaceImageWithFallback/MarketplaceImageWithFallback";

const CardListRowView = styled.div`
  display: flex;
  padding: ${CardStyle.LIST_ITEM_PADDING};
  cursor: pointer;
  align-items: center;
  &:hover {
    background-color: rgba(1, 13, 14, 0.04);
  }
`;

const Icon = styled(MarketplaceImageWithFallback)`
  height: 16px;
  width: 28px;
  padding-right: 0.5em;
`;

const Title = styled.div`
  flex: 1;
  color: ${Colors.NAVY_7};
`;

const Region = styled.div`
  color: ${transparentize(0.6, Colors.NAVY_1)};
  font-size: 10px;
  text-transform: uppercase;
`;

export interface Props {
  id: string;
  icon: string;
  title: string;
  parentLocation: ParentLocation;
  cardTitle?: string;

  onClick: (id: string) => void;

  className?: string;
}
export type DefaultPropsKeys = never;

const initialState = {};

type State = Readonly<typeof initialState>;

@observer
export class CardListRow extends React.Component<Props, State> {
  static defaultProps: Pick<Props, DefaultPropsKeys> = {};
  readonly state: State = initialState;

  onRowClick = () => {
    this.props.onClick(this.props.id);
  };

  render() {
    const { parentLocation, icon, title, className, cardTitle } = this.props;
    let topParent;
    if (parentLocation.secondParent && cardTitle !== parentLocation.secondParent.fullName) {
      topParent = parentLocation.secondParent;
    }
    return (
      <CardListRowView className={className} onClick={this.onRowClick}>
        <Icon imagePath={icon} />
        <Title>{title + (parentLocation.firstParent ? ` - ${parentLocation.firstParent!.fullName}` : "")}</Title>
        <Tooltip placement={"right"} ignoreBoundaries content={topParent ? topParent.fullName : ""}>
          <Region>{topParent ? topParent.isoName : ""}</Region>
        </Tooltip>
      </CardListRowView>
    );
  }
}
