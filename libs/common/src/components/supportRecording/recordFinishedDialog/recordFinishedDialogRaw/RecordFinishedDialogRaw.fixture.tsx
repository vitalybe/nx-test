/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import styled from "styled-components";
import {
  Props,
  RecordFinishedDialogRaw,
} from "./RecordFinishedDialogRaw";
import FixtureDecorator from "../../../../utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;
`;

function getProps(): Props {
  return {
    displayedSessionId:
      "aHR0cHM6Ly9hBHAubG9ncm9ja2V0LmNvbS96bm84amUvcWMtc2VydmljAXMvcy80LWI4MzM0NTFmLTJmN2UtNDVjOC05OWNmLWIwMjA4YzZhMWJjYi8wL2E3NjdkODJmLWMxZDYtNGYxNi1iNGVhLTc3MjMwMWQzMDEzMz90PTE1OTAzMjA3NDA2NDA=",
    submissionPercent: 0,
    submissionState: "not-started",

    onCopySessionId(): void {},
    onRecapture(): void {},
    onStart(): void {},
    onStop(): void {},
    onClose(): void {},
  };
}

export default {
  "getting ID": (
    <View>
      <RecordFinishedDialogRaw {...getProps()} displayedSessionId={undefined} />
    </View>
  ),
  "not started": (
    <View>
      <RecordFinishedDialogRaw {...getProps()} submissionState={"not-started"} />
    </View>
  ),
  "in progress": (
    <View>
      <RecordFinishedDialogRaw {...getProps()} submissionState={"in-progress"} submissionPercent={10} />
    </View>
  ),
  "finish-success": (
    <View>
      <RecordFinishedDialogRaw {...getProps()} submissionState={"finish-success"} />
    </View>
  ),
  "finish-error": (
    <View>
      <RecordFinishedDialogRaw {...getProps()} submissionState={"finish-error"} />
    </View>
  ),
};
