/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import {
  ContextDiffListOfSegments,
  Props,
} from "./ContextDiffListOfSegments";
import FixtureDecorator from "@qwilt/common/utils/cosmos/FixtureDecorator";
import { ContextDiffSegmentEntity } from "../_domain/contextDiffSegmentEntity";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 500px;
`;

function getProps(): Props {
  return {
    items: [
      ContextDiffSegmentEntity.createMock({ name: "Network with changes" }),
      ContextDiffSegmentEntity.createMock({ changeCount: 0, name: "Network with NO changes" }),
      ContextDiffSegmentEntity.createMock({ name: "Network with changes" }),
    ],
    isReviewEnabled: true,
    reviewedIds: new Set([]),
    onZoom: () => {},
    onSelectedSegmentsChanged: () => {},
    selectedSegmentsIds: [],
  };
}

export default {
  regular: (
    <View>
      <ContextDiffListOfSegments {...getProps()}></ContextDiffListOfSegments>
    </View>
  ),
};
