import * as React from "react";
import styled, { css } from "styled-components";
import { observer } from "mobx-react";
// @ts-ignore
import Select from "react-select";
import { Colors } from "../../_styling/colors";
import { transparentize } from "polished";
import { TopBarSearchOption } from "./_parts/topBarSearchOption/TopBarSearchOption";
import { TopBarDropdownIndicator } from "./_parts/topBarDropdownIndicator/TopBarDropdownIndicator";
import { TopBarSearchModel } from "./topBarSearchModel";
import { TopBarSearchGroup } from "./_models/topBarSearchGroup";
import { TopBarSearchOptionModel } from "./_parts/topBarSearchOption/topBarSearchOptionModel";

const TopBarSearchView = styled.div`
  z-index: 9999;
`;

const placeholderColor = transparentize(0.5, Colors.NAVY_7);

const selectStyle = {
  control: (base: any, state: any) => ({
    ...base,
    fontSize: 12,
    height: 44,
    backgroundColor: state.isFocused ? Colors.WHITE : "transparent",
    borderRadius: 6,
    border: state.isFocused ? `1px solid ${Colors.NAVY_12}` : `1px solid ${"transparent"}`,
    boxShadow: 0,
    color: state.isFocused ? placeholderColor : "transparent",
    "&:hover": {
      backgroundColor: Colors.WHITE,
      color: placeholderColor,
    },
    transition: "0.3s ease",
  }),

  input: (base: any, state: any) => ({
    ...base,
    color: Colors.NAVY_7,
    "& input": {
      fontSize: 12,
      fontWeight: "bold",
    },
  }),

  placeholder: (base: any, state: any) => ({
    marginLeft: 2,
    marginRight: 2,
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    fontWeight: 700,
    "&:hover": {
      opacity: 1,
    },
  }),
  groupHeading: (base: any, state: any) => ({
    paddingLeft: "0.7em",
    textTransform: "uppercase",
  }),
};

const TopBarDropdownIndicatorStyled = styled(TopBarDropdownIndicator)`
  margin-right: 0.5em;
`;

const GroupHeader = styled.div`
  color: ${Colors.NAVY_11};
  font-size: 10px;
`;

export interface Props {
  model: TopBarSearchModel;

  className?: string;
}

const initialState = {
  hasSearchString: false,
};

type State = Readonly<typeof initialState>;

@observer
export class TopBarSearch extends React.Component<Props, State> {
  static defaultProps = {};
  readonly state: State = initialState;

  onFilter = (optionModel: { data: TopBarSearchOptionModel }, searchInput: string) => {
    if (!searchInput) {
      return !optionModel.data.isDisabled;
    } else {
      const searchLower = searchInput.toLowerCase();
      const titleLower = optionModel.data.title.toLowerCase();
      const parentLocationLower = optionModel.data.parentLocation.fullNameLabel.toLowerCase();
      return titleLower.includes(searchLower) || parentLocationLower.includes(searchLower);
    }
  };

  onOptionSelected = (option: TopBarSearchOptionModel | []) => {
    if (option instanceof TopBarSearchOptionModel) {
      this.props.model.selectSearchOption(option.id);
    }
  };

  isOptionDisabled = (topBarSearchOption: TopBarSearchOptionModel) => {
    return topBarSearchOption.isDisabled;
  };

  onInputChange = (inputValue: string) => {
    return this.setState({ hasSearchString: !!inputValue });
  };
  render() {
    return (
      <TopBarSearchView className={this.props.className}>
        <Select
          styles={selectStyle}
          menuPortalTarget={document.body}
          options={this.props.model.searchGroupsModel}
          formatGroupLabel={(group: TopBarSearchGroup) => <GroupHeader>{group.name}</GroupHeader>}
          isSearchable={true}
          onInputChange={this.onInputChange}
          components={{
            IndicatorSeparator: () => <div />,
            DropdownIndicator: () => <TopBarDropdownIndicatorStyled showClearIndicator={this.state.hasSearchString} />,
            Option: TopBarSearchOption,
          }}
          onChange={this.onOptionSelected}
          value={null}
          placeholder={"Search by location or ISP"}
          openMenuOnClick={false}
          filterOption={this.onFilter}
          isOptionDisabled={this.isOptionDisabled}
        />
      </TopBarSearchView>
    );
  }
}
