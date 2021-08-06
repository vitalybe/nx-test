import * as React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { Colors } from "../../../../_styling/colors";
import { darken } from "polished";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

const TopBarDropdownIndicatorView = styled.div``;

const SearchIndicator = styled.div`
  color: ${Colors.NAVY_10};
  font-size: 21px;
  transform: translateY(1px);
`;

const ClearIndicator = styled.div`
  width: 16px;
  height: 16px;
  background-color: ${Colors.NAVY_10};
  color: white;
  border-radius: 50%;
  line-height: 18px;
  font-size: 10px;
  font-weight: bolder;
  text-align: center;
  cursor: pointer;

  &:hover {
    background-color: ${darken(0.1, Colors.NAVY_10)};
  }

  &:active {
    background-color: ${darken(0.2, Colors.NAVY_10)};
  }
`;

export interface Props {
  showClearIndicator: boolean;
  className?: string;
}

const initialState = {};

type State = Readonly<typeof initialState>;

@observer
export class TopBarDropdownIndicator extends React.Component<Props, State> {
  static defaultProps: Pick<Props, "showClearIndicator"> = { showClearIndicator: false };
  readonly state: State = initialState;

  render() {
    return (
      <TopBarDropdownIndicatorView className={this.props.className}>
        {this.props.showClearIndicator ? (
          <ClearIndicator>
            <FontAwesomeIcon icon={faTimes} />
          </ClearIndicator>
        ) : (
          <SearchIndicator>
            <FontAwesomeIcon icon={faSearch} />
          </SearchIndicator>
        )}
      </TopBarDropdownIndicatorView>
    );
  }
}
