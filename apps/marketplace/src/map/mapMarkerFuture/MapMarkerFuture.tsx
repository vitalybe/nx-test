import * as React from "react";
import { useCallback } from "react";
import styled from "styled-components";
import { loggerCreator } from "@qwilt/common//utils/logger";
import { MapMarkerBubble } from "../_parts/mapMarkerBubble/MapMarkerBubble";
import { Colors } from "../../_styling/colors";
import { Tooltip } from "@qwilt/common/components/Tooltip";
import { MarketplaceStore } from "../../_stores/marketplaceStore";
import { observer } from "mobx-react-lite";
import { Fonts } from "@qwilt/common/styling/fonts";
import { transparentize } from "polished";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const MapMarkerFutureView = styled.div``;

const TooltipContent = styled.div`
  padding: 1em;
  font-size: ${Fonts.FONT_SIZE_16};
  font-weight: bold;
`;

//endregion

function onTooltipShown() {}

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
        onShow={useCallback(() => onTooltipShown(), [])}>
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
