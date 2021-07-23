import * as React from "react";
import styled from "styled-components";
import { VolumeIcon } from "common/components/metrics/icons/volumeIcon/VolumeIcon";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;

  width: 500px;
  height: 500px;
  // without 'grid' the child item won't get the dimensions of the parent
  display: grid;
`;

export default {
  Light: (
    <View>
      <VolumeIcon iconTheme={"bright"} />
    </View>
  ),
  Dark: (
    <View>
      <VolumeIcon iconTheme={"dark"} />
    </View>
  ),
};