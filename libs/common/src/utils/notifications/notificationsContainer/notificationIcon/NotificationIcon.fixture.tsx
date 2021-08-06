/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import styled from "styled-components";
import {
  NotificationIcon,
  Props,
} from "./NotificationIcon";
import FixtureDecorator from "../../../cosmos/FixtureDecorator";
import { NotificationLevel } from "../../_domain/notificationEntity";

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
    level: NotificationLevel.INFO,
    size: "24px",
    toShowText: true,
  };
}

export default {
  error: (
    <View>
      <NotificationIcon {...getProps()} level={NotificationLevel.ERROR} />
    </View>
  ),
  warn: (
    <View>
      <NotificationIcon {...getProps()} level={NotificationLevel.WARN} />
    </View>
  ),
  info: (
    <View>
      <NotificationIcon {...getProps()} level={NotificationLevel.INFO} />
    </View>
  ),
  "error small": (
    <View>
      <NotificationIcon {...getProps()} size={"10px"} toShowText={false} level={NotificationLevel.ERROR} />
    </View>
  ),
  "warn small": (
    <View>
      <NotificationIcon {...getProps()} size={"10px"} toShowText={false} level={NotificationLevel.WARN} />
    </View>
  ),
  "info small": (
    <View>
      <NotificationIcon {...getProps()} size={"10px"} toShowText={false} level={NotificationLevel.INFO} />
    </View>
  ),
};
