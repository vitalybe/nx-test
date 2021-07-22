import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const ResultsView = styled.pre`
  position: fixed;
  right: 1em;
  top: 1em;
  font-family: monospace;
  width: 500px;
  overflow-y: auto;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  children: (onResults: (data: unknown) => void) => React.ReactChild | React.ReactChildren;
  className?: string;
}

interface State {
  results: unknown;
}

//endregion [[ Props ]]

// NOTE: Fixture decorators must be not-functional componenets - We get warnings otherwise
export class FixtureWithResults extends React.Component<Props, State> {
  state = { results: {} };

  render() {
    return (
      <FixtureDecorator className={this.props.className}>
        {this.props.children((results: unknown) => this.setState({ results }))}
        <ResultsView>{JSON.stringify(this.state.results, null, 2)}</ResultsView>
      </FixtureDecorator>
    );
  }
}

export default FixtureDecorator;
