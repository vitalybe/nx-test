import * as React from "react";
import styled, { css } from "styled-components";
import { CardCapabilitiesModel } from "./cardCapabilitiesModel";
import { CardNamedCapabilities } from "./cardNamedCapabilities";
import { Colors } from "../../../_styling/colors";
import { Fonts } from "@qwilt/common/styling/fonts";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { CardStyle } from "../../cardStyle";

const MapCardCapabilitiesView = styled.div`
  height: 100%;
  min-height: 100px;
  flex-basis: auto;
  color: ${Colors.NAVY_7};
  font-size: ${Fonts.FONT_SIZE_12};
  border-top: 1px solid ${Colors.GRAY_4};
  overflow-y: auto;

  display: flex;
  flex-direction: column;
`;

const List = styled.div`
  overflow-x: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  text-transform: uppercase;
  padding: ${CardStyle.LIST_HEADER_PADDING};
  font-weight: bold;
`;

const Section = styled.div`
  ${(props: { isSelected: boolean }) => css`
    color: ${Colors.NAVY_3};
    opacity: ${props.isSelected ? 1 : 0.3};
    cursor: pointer;
  `};
`;

const CapabilityItem = styled.div`
  display: flex;
  align-items: center;
  padding: ${CardStyle.LIST_ITEM_PADDING};
`;

const Text = styled.div`
  margin-left: 0.5em;
`;

const Icon = styled.div`
  background-color: ${Colors.BLUE_3};
  border-radius: 50%;
  height: 16px;
  width: 16px;
  text-align: center;
  line-height: 16px;
  font-size: 9px;
  color: white;
`;

export interface Props {
  model: CardCapabilitiesModel;

  className?: string;
}

interface State {
  selectedCapabilities: CardNamedCapabilities;
}

@observer
export class CardCapabilities extends React.Component<Props, State> {
  static defaultProps = {};
  readonly state: State;
  capabilitiesList: CardNamedCapabilities[];

  constructor(props: Props) {
    super(props);
    this.capabilitiesList = [
      new CardNamedCapabilities("main capabilities", this.props.model.mainCapabilities),
      new CardNamedCapabilities("content types", this.props.model.contentTypes),
    ];
    this.state = { selectedCapabilities: this.capabilitiesList[0] };
  }

  componentWillMount() {}

  render() {
    return (
      <MapCardCapabilitiesView className={this.props.className}>
        <Header>
          {this.capabilitiesList.map((capabilities) => (
            <Section
              key={capabilities.name}
              isSelected={this.state.selectedCapabilities === capabilities}
              onClick={() => {
                this.setState({ selectedCapabilities: capabilities });
              }}>
              {capabilities.name} ({capabilities.capabilities.length})
            </Section>
          ))}
        </Header>
        <List>
          {this.state.selectedCapabilities.capabilities.map((capability) => (
            <CapabilityItem key={capability}>
              <Icon>
                <FontAwesomeIcon icon={faCheck} />
              </Icon>
              <Text>{capability}</Text>
            </CapabilityItem>
          ))}
        </List>
      </MapCardCapabilitiesView>
    );
  }
}
