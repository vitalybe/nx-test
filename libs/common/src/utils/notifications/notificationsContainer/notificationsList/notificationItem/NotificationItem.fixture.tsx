/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import styled from "styled-components";
import {
  NotificationItem,
  Props,
} from "./NotificationItem";
import FixtureDecorator from "../../../../cosmos/FixtureDecorator";
import { NotificationLevel, NotificationEntity } from "../../../_domain/notificationEntity";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;
  width: 300px;
`;

function getProps(): Props {
  return {
    notification: new NotificationEntity({
      text: "Some error has occurred",
      title: "Title",
      level: NotificationLevel.WARN,
    }),
  };
}

export default {
  regular: (
    <View>
      <NotificationItem {...getProps()}></NotificationItem>
    </View>
  ),
  long: () => {
    const props = getProps();
    props.notification.text =
      "00:16:24,704 - ERROR - [common/components/providerDataContainer/providers/useProvider.ts] Provider failed to fetch data NetworkError: failed to get a response at Function.push../common/utils/ajax.ts.Ajax.fetch (http://dev-localhost.cqloud.com/static/js/main.chunk.js:10688:15) at async Function.push../common/utils/ajax.ts.Ajax.fetchJson (http://dev-localhost.cqloud.com/static/js/main.chunk.js:10739:26)";

    return (
      <View>
        <NotificationItem {...props}></NotificationItem>
      </View>
    );
  },
};
