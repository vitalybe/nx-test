import * as React from "react";
import { useCallback } from "react";
import styled, { css } from "styled-components";
import { loggerCreator } from "common//utils/logger";
import { MapMarkerBubble } from "src/map/_parts/mapMarkerBubble/MapMarkerBubble";
import { Colors } from "src/_styling/colors";
import { Tooltip } from "common/components/Tooltip";
import { MarketplaceStore } from "src/_stores/marketplaceStore";
import { observer } from "mobx-react-lite";
import { Fonts } from "common/styling/fonts";
import { transparentize } from "polished";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const MapMarkerFutureView = styled.div``;

const TooltipContent = styled.div`
  padding: 1em;
  font-size: ${Fonts.FONT_SIZE_16};
  font-weight: bold;
`;

//endregion

function onTooltipShown(marketplaceStore: MarketplaceStore) {}

export interface Props {
  currentZoom: number;
  // NOTE: These props are used by the parent map container, not by the actual component
  lat?: number;
  lng?: number;
  marketplaceStore: MarketplaceStore;
  className?: string;
}

export const MapMarkerFuture = observer(({ ...props }: Props) => {
  return (
    <MapMarkerFutureView className={props.className} data-lng={props.lng} data-lat={props.lat}>
      <Tooltip
        delay={500}
        content={<TooltipContent>Future deployment</TooltipContent>}
        onShow={useCallback(() => onTooltipShown(props.marketplaceStore), [props.marketplaceStore])}>
        <MapMarkerBubble
          id={"Future"}
          color={Colors.WHITE}
          dimmedColor={transparentize(0.95, Colors.WHITE)}
          currentZoom={props.currentZoom}
          isHighlighted={props.marketplaceStore.selectedEntities.length === 0}
          isEnlarged={false}
          enableAnimation={true}
        />
      </Tooltip>
    </MapMarkerFutureView>
  );
});
