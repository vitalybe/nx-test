/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import styled from "styled-components";
import { Props, RecordingDialog } from "common/components/supportRecording/_parts/recordingDialog/RecordingDialog";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;
`;

function getProps(): Props {
  return {
    title: "Title",
    children: "Dummy content",
    onClose: () => {},
  };
}

export default {
  regular: (
    <View>
      <RecordingDialog {...getProps()}></RecordingDialog>
    </View>
  ),
};
