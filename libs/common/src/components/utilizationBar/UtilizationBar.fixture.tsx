import * as React from "react";
import styled from "styled-components";
import { UtilizationBar } from "./UtilizationBar";
import { CommonColors as Colors } from "../../styling/commonColors";

import FixtureDecorator from "../../utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
  display: flex;
  justify-content: center;
  width: 400px;
`;

export default {
  "-Usage is more than reserved": (
    <View>
      <UtilizationBar reserved={60} value={90} />
    </View>
  ),
  "-Custom Color - Usage is more than reserved": (
    <View>
      <UtilizationBar reserved={60} value={90} color={Colors.TURQUOISE_BLUE} />
    </View>
  ),
  "-Usage is more than reserved with relative peak": (
    <View>
      <UtilizationBar reserved={60} value={90} relativePeak={140} />
    </View>
  ),
  "-Reserved is more than usage": (
    <View>
      <UtilizationBar reserved={90} value={60} />
    </View>
  ),
  "-Reserved is more than usage with relative peak": (
    <View>
      <UtilizationBar reserved={90} value={60} relativePeak={140} />
    </View>
  ),
  "-No Reserved": (
    <View>
      <UtilizationBar value={60} />
    </View>
  ),
  "-No Reserved with relative peak": (
    <View>
      <UtilizationBar value={60} relativePeak={140} />
    </View>
  ),
};
