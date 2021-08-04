import * as React from "react";
import styled from "styled-components";
import { CardHistogram } from "./CardHistogram";
import FixtureDecorator from "@qwilt/common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  width: 300px;
  border: 1px solid black;
`;

export default {
  Regular: (
    <View>
      <CardHistogram hasError={false} qoeValues={[Math.pow(10, 6), Math.pow(10, 7), Math.pow(10, 8)]} />
    </View>
  ),
  "Small and large values": (
    <View>
      <CardHistogram hasError={false} qoeValues={[10, 20, 30, 40, Math.pow(10, 6) + 5]} />
    </View>
  ),
  Error: (
    <View>
      <CardHistogram hasError={true} qoeValues={undefined} />
    </View>
  ),
  "Near top": (
    <View>
      <CardHistogram
        hasError={false}
        qoeValues={[
          423403872,
          155958558,
          584140850,
          382750398,
          592117299,
          302464613,
          703749059,
          577777065,
          293089571,
          92042373,
          827084321,
          910296416,
          124918827,
          699096143,
          599937799,
          548981736,
          74528110,
          564967520,
          951378631,
          800507712,
          845216990,
          643809820,
          160573883,
          883107106,
          738002897,
          276927298,
          882510610,
          663133269,
          534389227,
          661818408,
        ]}
      />
    </View>
  ),
  Loading: (
    <View>
      <CardHistogram hasError={false} qoeValues={undefined} />
    </View>
  ),
};
