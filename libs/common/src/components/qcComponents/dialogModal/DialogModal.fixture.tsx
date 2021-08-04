/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import styled from "styled-components";
import { DialogModal, Props } from "./DialogModal";
import FixtureDecorator from "../../../utils/cosmos/FixtureDecorator";
import { UserConfirmation } from "../userConfirmation/UserConfirmation";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 500px;
`;

const Content = styled.div`
  width: 600px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function getProps(): Props<{}> {
  return {
    title: "Dialog Modal",
    closeCallback: () => null,
    component: () => <Content>content</Content>,
  };
}

export default {
  regular: (
    <View>
      <DialogModal {...getProps()} />
    </View>
  ),
  "user confirmation": (
    <View>
      <DialogModal
        title={"Please Confirm"}
        {...getProps()}
        component={() => <UserConfirmation message={"Are you sure?"} closeFn={() => null} />}
      />
    </View>
  ),
};
