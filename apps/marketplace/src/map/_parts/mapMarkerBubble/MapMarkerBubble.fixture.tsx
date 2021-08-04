/* eslint-disable no-console */
import * as React from "react";
import * as _ from "lodash";

import { MapMarkerBubble } from "src/map/_parts/mapMarkerBubble/MapMarkerBubble";
import styled from "styled-components";
import { MAP_DEFAULT_ZOOM } from "src/map/Map";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

import { Colors } from "src/_styling/colors";

const View = styled(FixtureDecorator)`
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default {
  Regular: (
    <View>
      <MapMarkerBubble
        id={"id"}
        isHighlighted={true}
        onClick={() => console.log("clicked")}
        currentZoom={MAP_DEFAULT_ZOOM}
        isEnlarged={false}
        color={Colors.SPRAY}
      />
    </View>
  ),
  Enlarged: (
    <View>
      <MapMarkerBubble
        id={"id"}
        isHighlighted={true}
        onClick={() => console.log("clicked")}
        currentZoom={MAP_DEFAULT_ZOOM}
        isEnlarged={true}
        color={Colors.SPRAY}
      />
    </View>
  ),
  Many: (
    <View>
      <div>
        {_.range(0, 60).map((i) => (
          <div
            key={i}
            style={{
              display: "inline-block",
              marginRight: "8em",
              marginBottom: "8em",
            }}>
            <MapMarkerBubble
              id={"id"}
              isHighlighted={true}
              onClick={() => console.log("clicked")}
              currentZoom={MAP_DEFAULT_ZOOM}
              isEnlarged={false}
              color={Colors.SPRAY}
            />
          </div>
        ))}
      </div>
    </View>
  ),
};
