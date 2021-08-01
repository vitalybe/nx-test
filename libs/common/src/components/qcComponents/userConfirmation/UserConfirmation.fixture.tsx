/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import { Props, UserConfirmation } from "./UserConfirmation";
import FixtureDecorator from "../../../utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;
  display: inline-block;
`;

function getProps(): Props {
  return {
    closeFn(): void {},
    confirmFn(): void {},
    message: "Are you sure?",
  };
}

export default {
  regular: (
    <View>
      <UserConfirmation {...getProps()} />
    </View>
  ),
  "custom icon & text": (
    <View>
      <UserConfirmation
        {...getProps()}
        message={"Are you sure you're sure?"}
        confirmText={"Yes I am sure"}
        closeText={"Not sure I'm sure"}
        icon={<img alt={"trash icon"} src={require("../_media/trash-delete-x.svg")} />}
      />
    </View>
  ),
  "no confirm": (
    <View>
      <UserConfirmation {...getProps()} confirmFn={undefined} />
    </View>
  ),
  "long text": (
    <View>
      <UserConfirmation
        {...getProps()}
        confirmText={"I dont know dude"}
        closeText={"what?"}
        message={
          "There was some very long something that happened and we didn't expect and it takes a lot of text to describe, wow so much text. So what are we doing here?"
        }
      />
    </View>
  ),
};
