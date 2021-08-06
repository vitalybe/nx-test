/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import styled from "styled-components";
import { SearchInput } from "./SearchInput";
import FixtureDecorator from "../../utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;
`;

const StatefulWrapper = () => {
  const [value, setValue] = React.useState("");
  return (
    <View>
      <SearchInput value={value} onChange={setValue} placeholder={"Search something"} />
    </View>
  );
};

export default {
  regular: <StatefulWrapper />,
};
