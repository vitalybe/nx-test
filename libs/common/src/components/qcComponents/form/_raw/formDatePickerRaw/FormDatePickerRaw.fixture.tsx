/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import { FormDatePickerRaw, Props } from "./FormDatePickerRaw";
import FixtureDecorator from "../../../../../utils/cosmos/FixtureDecorator";
import { DateTime } from "luxon";

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
    value: DateTime.local().toJSDate(),
  };
}

export default {
  regular: (
    <View>
      <FormDatePickerRaw {...getProps()} />
    </View>
  ),
  label: (
    <View>
      <FormDatePickerRaw {...getProps()} label={"Select Date"} />
    </View>
  ),
  error: (
    <View>
      <FormDatePickerRaw {...getProps()} value={undefined} label={"Select Date"} error={"no date selected"} />
    </View>
  ),
  disabled: (
    <View>
      <FormDatePickerRaw {...getProps()} label={"Select Date"} isDisabled />
    </View>
  ),
  "help text": (
    <View>
      <FormDatePickerRaw {...getProps()} label={"Select Date"} helpText={"some explanation here"} />
    </View>
  ),
};
