import { loggerCreator } from "common/utils/logger";
import { LatLng } from "src/_domain/latLng";

const moduleLogger = loggerCreator(__filename);

export class PolygonEntity {
  countryIso!: string;
  stateIso!: string | undefined;
  coordinates!: Array<LatLng[]>;

  constructor(data: Required<PolygonEntity>) {
    Object.assign(this, data);
  }
}
