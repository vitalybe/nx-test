/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import {
  HttpRoutersTab,
  Props,
} from "./HttpRoutersTab";
import { HttpRouterEntity } from "./_domain/httpRouterEntity";
import { SelectedCdnFixtureDecorator } from "../../../_utils/SelectedCdnFixtureDecorator";

const View = styled(SelectedCdnFixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 500px;
`;

function getProps(): Props {
  return {
    cdnName: "1234",
    entities: [HttpRouterEntity.createMock(), HttpRouterEntity.createMock(), HttpRouterEntity.createMock()],
  };
}

export default {
  regular: (
    <View>
      <HttpRoutersTab {...getProps()}></HttpRoutersTab>
    </View>
  ),
};
