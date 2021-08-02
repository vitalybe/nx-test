/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import * as _ from "lodash";
import { loggerCreator } from "common/utils/logger";
import styled, { css } from "styled-components";
import { autorun } from "mobx";
import { MapMarker } from "src/map/mapMarker/MapMarker";
import { MapMarkerModel } from "src/map/mapMarker/mapMarkerModel";
import { observer } from "mobx-react";
import { MapModel } from "src/map/mapModel";
// @ts-ignore
import GoogleMapReact from "google-map-react";
import { MapMarkerFuture } from "src/map/mapMarkerFuture/MapMarkerFuture";
import { PolygonsProvider } from "src/map/_providers/polygonsProvider";
import { ApiGeoEntityType } from "common/backend/geoDeployment/geoDeploymentTypes";

const moduleLogger = loggerCreator(__filename);

const mapStyle = require("src/map/mapStyle.json");

const MAP_MIN_ZOOM = 3;
const MAP_MAX_ZOOM = 6;
export const MAP_DEFAULT_ZOOM = MAP_MIN_ZOOM;

const MapView = styled.div`
  height: 100%;
  width: 100%;
`;

const ClickDetector = styled.div`
  ${(props: { lat?: number; lng?: number }) => css`
    position: absolute;
    top: -9999px;
    bottom: -9999px;
    left: -9999px;
    right: -9999px;
    background-color: rgba(0, 255, 0, 0);
  `};
`;

interface Props {
  model: MapModel;
  lat?: number;
  lng?: number;

  className?: string;
}

const currentYear = new Date().getFullYear();

const initialState: { zoom: number; google?: { maps: any; map: any } } = { zoom: MAP_DEFAULT_ZOOM, google: undefined };
type State = Readonly<typeof initialState>;

@observer
export class Map extends React.Component<Props, State> {
  readonly state: State = initialState;
  center = { lat: 30, lng: -35 };
  currentGoogleMapPolygons: any[] = [];
  isMouseOverRegion: boolean = false;

  onTilesLoaded = () => {
    // remove google maps CSS that overrides ours... hopefully doesn't have side effects
    // source: https://stackoverflow.com/questions/46652258/remove-specific-inline-css-with-pure-javascript
    const ar = document.querySelectorAll("style");
    for (let i = 0; i < ar.length; i++) {
      if (ar[i].innerText.match(".gm-style")) {
        ar[i].remove();
      }
    }

    const _this = this;
    setTimeout(function () {
      _this.updateMapCopyright();
    }, 1000);
  };

  onChange = ({ zoom }: { zoom: number }) => {
    if (this.state.zoom != zoom) {
      this.setState({ zoom: zoom });
    }
    this.updateMapCopyright();
  };

  updateMapCopyright = () => {
    const element = document.querySelector(".gmnoprint span");
    const elementContainer = document.querySelector(".gmnoprint");
    if (element) {
      setTimeout(function () {
        const textContent = (element as HTMLElement).textContent;
        if (textContent && textContent.indexOf("Qwilt") === -1) {
          (element as HTMLElement).textContent += ", Qwilt 2012-" + currentYear + " Qwilt Inc. All rights reserved.";
        }
        (elementContainer as HTMLElement).style.width = "auto";
      }, 200);
    }

    const element2 = document.querySelector(".gmnoscreen div");
    if (element2) {
      (element2 as HTMLElement).style.display = "none";
    }
  };

  handleGoogleMapApi = (google: any) => {
    this.setState({ google: google });
  };

  hideMarkerClickCard = () => {
    if (!this.isMouseOverRegion) {
      this.props.model.marketplace.activeClickedCardId = undefined;
    }
  };

  // the clickable regions are capturing clicks before the drawn react elements. That means that the buttons in cards above the marketplace
  // would get ignored if they are above another clickable region
  disposePolygondisabler = autorun(() => {
    const activeClickedCardId = this.props.model.marketplace.activeClickedCardId;
    if (activeClickedCardId !== undefined) {
      for (const currentGoogleMapPolygon of this.currentGoogleMapPolygons) {
        currentGoogleMapPolygon.setOptions({ clickable: false });
      }
    } else {
      for (const currentGoogleMapPolygon of this.currentGoogleMapPolygons) {
        currentGoogleMapPolygon.setOptions({ clickable: true });
      }
    }
  });

  render() {
    const model = this.props.model;

    const sortedMarkers = _.sortBy(model.mapMarkers, [
      (mapMarker: MapMarkerModel) => mapMarker.isHoverCardActive,
      (mapMarker: MapMarkerModel) => mapMarker.isClickedCardActive,
    ]);

    if (this.state.google && this.currentGoogleMapPolygons.length === 0) {
      for (const currentGoogleMapPolygon of this.currentGoogleMapPolygons) {
        currentGoogleMapPolygon.setMap(null);
      }

      this.currentGoogleMapPolygons = [];
      const polygons = PolygonsProvider.getInstance().provide();
      for (const polygon of polygons) {
        const marker = sortedMarkers.find((mapMarker) => {
          const markerGeoParent = mapMarker.geoParent;
          const markerGeoIso = markerGeoParent.iso2.toLowerCase();

          let isMarkerInPolygon = false;
          if (markerGeoParent.type === ApiGeoEntityType.COUNTRY) {
            isMarkerInPolygon = markerGeoIso === polygon.countryIso.toLowerCase();
          } else {
            const isState = markerGeoParent.type === ApiGeoEntityType.STATE;
            const isUsa = !!markerGeoParent.geoParent && markerGeoParent.geoParent.iso2.toLowerCase() === "us";
            const isStateEqual = !!polygon.stateIso && markerGeoIso === polygon.stateIso.toLowerCase();
            isMarkerInPolygon = isState && isUsa && isStateEqual;
          }

          return isMarkerInPolygon;
        });
        if (marker) {
          // noinspection TypeScriptValidateJSTypes
          const googlePolygon = new this.state.google.maps.Polygon({
            map: this.state.google.map,
            paths: polygon.coordinates,
            strokeOpacity: 0.8,
            strokeWeight: 0,
            fillColor: "#FFFFFF",
            fillOpacity: 0,
          });
          this.currentGoogleMapPolygons.push(googlePolygon);

          this.state.google.maps.event.addListener(googlePolygon, "click", () => {
            this.props.model.marketplace.activeHoverCardId = undefined;
            this.props.model.marketplace.activeClickedCardId = marker.geoParent.id;
          });

          this.state.google.maps.event.addListener(googlePolygon, "mousemove", () => {
            if (this.props.model.marketplace.activeClickedCardId === undefined) {
              this.props.model.marketplace.actionShowHoverCard(marker.geoParent.id);
            }

            this.isMouseOverRegion = true;
          });

          this.state.google.maps.event.addListener(googlePolygon, "mouseout", () => {
            this.props.model.marketplace.actionHideHoverCard();
            this.isMouseOverRegion = false;
          });
        }
      }
    }

    return (
      <MapView>
        <GoogleMapReact
          yesIWantToUseGoogleMapApiInternals={true}
          bootstrapURLKeys={{ key: "AIzaSyCRD5R1OTwSq14hpT2TCmpBWOyn0BBh_qQ" }}
          defaultCenter={this.center}
          defaultZoom={MAP_DEFAULT_ZOOM}
          onChange={this.onChange}
          onTilesLoaded={this.onTilesLoaded}
          options={{
            styles: mapStyle as any,
            disableDefaultUI: true,
            zoomControl: true,
            zoomControlOptions: { position: 8 as any },
            gestureHandling: "greedy",
            maxZoom: MAP_MAX_ZOOM,
            minZoom: MAP_MIN_ZOOM,
          }}
          onGoogleApiLoaded={this.handleGoogleMapApi}>
          <ClickDetector lat={this.center.lat} lng={this.center.lng} onClick={this.hideMarkerClickCard} />
          {model.marketplace.futureDeployments.map((futureDeployment, i) => (
            <MapMarkerFuture
              key={i}
              lat={futureDeployment.location.lat}
              lng={futureDeployment.location.lng}
              currentZoom={this.state.zoom}
              marketplaceStore={this.props.model.marketplace}
            />
          ))}
          {sortedMarkers.map((mapMarker) => (
            <MapMarker
              key={mapMarker.uniqueId}
              lat={mapMarker.location.lat}
              lng={mapMarker.location.lng}
              model={mapMarker}
              currentZoom={this.state.zoom}
            />
          ))}
        </GoogleMapReact>
      </MapView>
    );
  }
}
