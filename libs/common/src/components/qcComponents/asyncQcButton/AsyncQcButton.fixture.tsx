/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import { AsyncQcButton, Props } from "./AsyncQcButton";
import FixtureDecorator from "../../../utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 10em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 500px;
  height: 500px;
`;

function getProps(): Props {
  return {};
}

export default {
  regular: (
    <View>
      <AsyncQcButton {...getProps()}>Submit</AsyncQcButton>
    </View>
  ),
  loading: (
    <View>
      <AsyncQcButton {...getProps()} isLoading>
        Submit
      </AsyncQcButton>
    </View>
  ),
  "loading highlighted": (
    <View>
      <AsyncQcButton {...getProps()} isHighlighted isLoading>
        Submit
      </AsyncQcButton>
    </View>
  ),
  error: (
    <View>
      <AsyncQcButton {...getProps()} isHighlighted isError>
        Submit
      </AsyncQcButton>
    </View>
  ),
};
