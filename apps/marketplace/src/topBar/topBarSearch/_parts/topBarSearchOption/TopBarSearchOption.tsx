import * as React from "react";
import styled, { css } from "styled-components";
import { observer } from "mobx-react";
import { Colors } from "src/_styling/colors";
import { transparentize } from "polished";
import Highlighter from "react-highlight-words";
import { TopBarSearchOptionModel } from "src/topBar/topBarSearch/_parts/topBarSearchOption/topBarSearchOptionModel";
import { EntityIcon } from "src/_parts/entityIcon/EntityIcon";
import { ApiGeoEntityType } from "common/backend/geoDeployment/geoDeploymentTypes";
import { Tooltip } from "common/components/Tooltip";

const TopBarSearchOptionView = styled.div`
  ${(props: { highlighted: boolean; disabled: boolean }) => css`
    ${props.disabled
      ? css`
          opacity: 0.5;
          pointer-events: none;
        `
      : null};
    font-size: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0.7em 16px;
    background-color: ${props.highlighted ? Colors.GRAY_3 : "inherited"};
    &:hover {
      background-color: ${Colors.GRAY_3};
    }
  `};
`;

const EntityIconStyled = styled(EntityIcon)`
  height: 16px;
  width: 28px;
  padding-right: 0.5em;
`;

const Title = styled.div`
  flex: 1;
  color: ${Colors.NAVY_7};

  mark.highlight {
    font-weight: bolder;
    color: inherit;
    background-color: inherit;
  }
`;

const NoService = styled.span`
  margin-left: 0.5em;
`;

const Region = styled.div`
  color: ${transparentize(0.6, Colors.NAVY_1)};
  font-size: 10px;
  text-transform: uppercase;

  &:focus {
    outline: none;
  }
`;

export interface Props {
  isFocused: boolean;
  // it is called "data" because of "react-select", but it is used exactly like our model
  data: TopBarSearchOptionModel;
  selectProps: { inputValue: string };

  setValue: (topBarSearchOption: TopBarSearchOptionModel) => void;

  className?: string;
}

const initialState = {};

type State = Readonly<typeof initialState>;

@observer
export class TopBarSearchOption extends React.Component<Props, State> {
  static defaultProps = {};
  readonly state: State = initialState;

  onSelectOption = () => {
    this.props.setValue(this.props.data);
  };

  render() {
    const { parentLocation, title, isDisabled, entityIcon, entityType } = this.props.data;
    let label = title;
    const isCountry = entityType === ApiGeoEntityType.COUNTRY;
    if (!isCountry) {
      label += parentLocation.firstParent ? ` - ${parentLocation.firstParent!.fullName}` : "";
    }
    const topParent = isCountry ? parentLocation.firstParent : parentLocation.secondParent;
    return (
      <TopBarSearchOptionView
        disabled={isDisabled}
        highlighted={this.props.isFocused}
        className={this.props.className}
        onClick={this.onSelectOption}>
        <EntityIconStyled model={entityIcon} />
        <Title>
          <Highlighter
            highlightClassName="highlight"
            searchWords={[this.props.selectProps.inputValue]}
            autoEscape={true}
            textToHighlight={label}
          />
          {isDisabled ? <NoService>(No service)</NoService> : null}
        </Title>
        <Tooltip ignoreBoundaries content={topParent ? topParent.fullName : ""}>
          <Region>{topParent ? topParent.isoName : ""}</Region>
        </Tooltip>
      </TopBarSearchOptionView>
    );
  }
}
