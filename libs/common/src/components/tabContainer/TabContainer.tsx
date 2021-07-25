import * as React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { Tab } from "common/components/tabContainer/tab/Tab";
import { CommonColors } from "common/styling/commonColors";

const StyledTab = styled(Tab)<{ Color?: string }>`
  background-color: ${(props) => props.Color || CommonColors.GEYSER};
`;

const TabContainerView = styled.div`
  display: flex;
  flex-direction: column;
`;

const TabBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 180px);
  column-gap: 0.5em;
  transform: translateY(1px);
`;

const TabContent = styled.div<{ Color?: string }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.Color || CommonColors.GEYSER};
  border: 1px solid ${CommonColors.GRAY_1};
  padding: 1em;

  overflow: hidden;
`;

interface TabEntity {
  title: string;
  backgroundColor?: string;
}

export interface Props {
  tabNames: (string | TabEntity)[];
  initialTabIndex: number;
  onTabChange: (tabIndex: number) => void;

  className?: string;
}
export type DefaultPropsKeys = never;

const initialState = {
  selectedTabIndex: 0,
};

type State = Readonly<typeof initialState>;

@observer
export class TabContainer extends React.Component<Props, State> {
  static defaultProps: Pick<Props, DefaultPropsKeys> = {};
  readonly state: State = {
    selectedTabIndex: this.props.initialTabIndex,
  };

  tabsColorsArray: (string | undefined)[] = this.props.tabNames.map((tabItem) => {
    if (typeof tabItem === "string") {
      return CommonColors.GEYSER;
    } else {
      return tabItem.backgroundColor;
    }
  });

  componentWillMount() {
    if (React.Children.toArray(this.props.children).length != this.props.tabNames.length) {
      throw new Error("provided amount of tabs should be the same as amount of children");
    }
  }

  onTabClick = (tabIndex: number) => {
    this.setState({
      selectedTabIndex: tabIndex,
    });
    this.props.onTabChange(tabIndex);
  };

  defineTabItem(tabItem: string | TabEntity, i: number) {
    let tabName;
    let Color;
    if (typeof tabItem === "string") {
      tabName = tabItem;
    } else {
      tabName = tabItem.title;
      Color = tabItem.backgroundColor;
    }
    return (
      <StyledTab
        title={tabName}
        index={i}
        key={tabName + i}
        onClick={this.onTabClick}
        isSelected={this.state.selectedTabIndex === i}
        Color={Color}
      />
    );
  }

  defineTabContent() {}

  render() {
    return (
      <TabContainerView className={this.props.className}>
        <TabBar>{this.props.tabNames.map((tabItem, i) => this.defineTabItem(tabItem, i))}</TabBar>
        <TabContent Color={this.tabsColorsArray[this.state.selectedTabIndex]}>
          {React.Children.map(this.props.children, (child, i) =>
            this.state.selectedTabIndex === i ? child : undefined
          )}
        </TabContent>
      </TabContainerView>
    );
  }
}
