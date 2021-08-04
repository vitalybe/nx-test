import * as React from "react";
import styled from "styled-components";
import { MapMarker, Props } from "src/map/mapMarker/MapMarker";
import { MapMarkerModel } from "src/map/mapMarker/mapMarkerModel";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

import { MAP_DEFAULT_ZOOM } from "src/map/Map";

const View = styled(FixtureDecorator)`
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function getProps(overrides?: Partial<MapMarkerModel>, propsOverrides?: Partial<Props>): Props {
  return {
    model: MapMarkerModel.createMock(overrides),
    currentZoom: MAP_DEFAULT_ZOOM,
    ...propsOverrides,
  };
}

export default {
  Regular: (
    <View>
      <MapMarker {...getProps()} />)
    </View>
  ),
  Clicked: () => {
    const props = getProps({
      isClickedCardActive: true,
    });
    return <MapMarker {...props} />;
  },
  "Not highlighted": () => {
    const props = getProps();
    return <MapMarker {...props} />;
  },
};
