import { MarketplaceEntity } from "./marketplaceEntity";
import { LatLng } from "../latLng";
import { MarketplaceEntityGeo } from "./marketplaceEntityGeo";
import { ApiGeoEntityType } from "@qwilt/common/backend/geoDeployment/geoDeploymentTypes";
import { MarketplaceEntityIsp } from "./marketplaceEntityIsp";
import { MarketplaceQnEntity } from "./marketplaceQnEntity";

export class MarketplaceEntities {
  constructor(public entities: MarketplaceEntity[]) {}

  private static mockGeoEntity(
    name: string,
    iso: string,
    latLng: LatLng,
    type: ApiGeoEntityType,
    childEntities: MarketplaceEntity[]
  ) {
    const createdEntities: MarketplaceEntity[] = [];

    const parentEntity = new MarketplaceEntityGeo(name.toLowerCase(), iso, type, name, latLng, undefined, 5);

    let childHasCoverage: boolean = false;
    createdEntities.push(parentEntity);
    for (const child of childEntities) {
      if (child instanceof MarketplaceEntityIsp && !child.geoParent) {
        const newId = parentEntity.id + "_" + child.id;
        const newIspEntity = new MarketplaceEntityIsp(
          newId,
          child.id,
          child.name,
          parentEntity,
          [
            MarketplaceQnEntity.createMock({
              isFutureDeployment: false,
              location: { lat: latLng.lat - 0.5, lng: latLng.lng - 0.5 },
            }),
            MarketplaceQnEntity.createMock({
              isFutureDeployment: false,
              location: { lat: latLng.lat + 0.5, lng: latLng.lng + 0.5 },
            }),
          ],
          10
        );
        createdEntities.push(newIspEntity);
        childHasCoverage = true;
      } else if (child instanceof MarketplaceEntityGeo && !child.geoParent) {
        child.geoParent = parentEntity;
        childHasCoverage = true;
        createdEntities.push(child);
      } else {
        createdEntities.push(child);
      }
    }

    return createdEntities;
  }

  private static mockIspEntity(name: string): MarketplaceEntityIsp {
    const id = name.toLowerCase();
    return new MarketplaceEntityIsp(id, id, name, undefined, [], 10);
  }

  static createMock() {
    const comcast = this.mockIspEntity("Comcast");
    const cox = this.mockIspEntity("Cox");
    const fios = this.mockIspEntity("FiOS");
    const isps = [comcast, cox, fios];

    const northAmerica = this.mockGeoEntity("North America", "na", { lat: 0, lng: 0 }, ApiGeoEntityType.CONTINENT, [
      ...this.mockGeoEntity("United States", "us", { lat: 0, lng: 0 }, ApiGeoEntityType.COUNTRY, [
        ...this.mockGeoEntity("Alabama", "al", { lat: 32.799, lng: -86.8073 }, ApiGeoEntityType.STATE, [cox]),
        ...this.mockGeoEntity("Alaska", "ak", { lat: 61.385, lng: -152.2683 }, ApiGeoEntityType.STATE, []),
        ...this.mockGeoEntity("Arizona", "az", { lat: 33.7712, lng: -111.3877 }, ApiGeoEntityType.STATE, [comcast]),
        ...this.mockGeoEntity("Arkansas", "ar", { lat: 34.9513, lng: -92.3809 }, ApiGeoEntityType.STATE, []),
        ...this.mockGeoEntity("California", "ca", { lat: 36.17, lng: -119.7462 }, ApiGeoEntityType.STATE, [comcast]),
        ...this.mockGeoEntity("Colorado", "co", { lat: 39.0646, lng: -105.3272 }, ApiGeoEntityType.STATE, [comcast]),
        ...this.mockGeoEntity("Connecticut", "ct", { lat: 41.5834, lng: -72.7622 }, ApiGeoEntityType.STATE, []),
        ...this.mockGeoEntity("Delaware", "de", { lat: 39.3498, lng: -75.5148 }, ApiGeoEntityType.STATE, []),
        ...this.mockGeoEntity("Florida", "fl", { lat: 27.8333, lng: -81.717 }, ApiGeoEntityType.STATE, [cox]),
        ...this.mockGeoEntity("Georgia", "ga", { lat: 32.9866, lng: -83.6487 }, ApiGeoEntityType.STATE, [cox]),
        ...this.mockGeoEntity("Hawaii", "hi", { lat: 21.1098, lng: -157.5311 }, ApiGeoEntityType.STATE, [comcast]),
        ...this.mockGeoEntity("Idaho", "id", { lat: 44.2394, lng: -114.5103 }, ApiGeoEntityType.STATE, [comcast]),
        ...this.mockGeoEntity("Illinois", "il", { lat: 40.3363, lng: -89.0022 }, ApiGeoEntityType.STATE, [cox]),
        ...this.mockGeoEntity("Indiana", "in", { lat: 39.8647, lng: -86.2604 }, ApiGeoEntityType.STATE, [cox]),
        ...this.mockGeoEntity("Iowa", "ia", { lat: 42.0046, lng: -93.214 }, ApiGeoEntityType.STATE, []),
        ...this.mockGeoEntity("Kansas", "ks", { lat: 38.5111, lng: -96.8005 }, ApiGeoEntityType.STATE, []),
        ...this.mockGeoEntity("Kentucky", "ky", { lat: 37.669, lng: -84.6514 }, ApiGeoEntityType.STATE, [cox]),
        ...this.mockGeoEntity("Louisiana", "la", { lat: 31.1801, lng: -91.8749 }, ApiGeoEntityType.STATE, []),
        ...this.mockGeoEntity("Maine", "me", { lat: 44.6074, lng: -69.3977 }, ApiGeoEntityType.STATE, []),
        ...this.mockGeoEntity("Maryland", "md", { lat: 39.0724, lng: -76.7902 }, ApiGeoEntityType.STATE, []),
        ...this.mockGeoEntity("Massachusetts", "ma", { lat: 42.2373, lng: -71.5314 }, ApiGeoEntityType.STATE, []),
        ...this.mockGeoEntity("Michigan", "mi", { lat: 43.3504, lng: -84.5603 }, ApiGeoEntityType.STATE, [cox]),
        ...this.mockGeoEntity("Minnesota", "mn", { lat: 45.7326, lng: -93.9196 }, ApiGeoEntityType.STATE, []),
        ...this.mockGeoEntity("Mississippi", "ms", { lat: 32.7673, lng: -89.6812 }, ApiGeoEntityType.STATE, [cox]),
        ...this.mockGeoEntity("Missouri", "mo", { lat: 38.4623, lng: -92.302 }, ApiGeoEntityType.STATE, []),
        ...this.mockGeoEntity("Montana", "mt", { lat: 46.9048, lng: -110.3261 }, ApiGeoEntityType.STATE, [comcast]),
        ...this.mockGeoEntity("Nebraska", "ne", { lat: 41.1289, lng: -98.2883 }, ApiGeoEntityType.STATE, []),
        ...this.mockGeoEntity("Nevada", "nv", { lat: 38.4199, lng: -117.1219 }, ApiGeoEntityType.STATE, [comcast, cox]),
        ...this.mockGeoEntity("New Hampshire", "nh", { lat: 43.4108, lng: -71.5653 }, ApiGeoEntityType.STATE, []),
        ...this.mockGeoEntity("New Jersey", "nj", { lat: 40.314, lng: -74.5089 }, ApiGeoEntityType.STATE, []),
        ...this.mockGeoEntity("New Mexico", "nm", { lat: 34.8375, lng: -106.2371 }, ApiGeoEntityType.STATE, [comcast]),
        ...this.mockGeoEntity("New York", "ny", { lat: 42.1497, lng: -74.9384 }, ApiGeoEntityType.STATE, []),
        ...this.mockGeoEntity("North Carolina", "nc", { lat: 35.6411, lng: -79.8431 }, ApiGeoEntityType.STATE, []),
        ...this.mockGeoEntity("North Dakota", "nd", { lat: 47.5362, lng: -99.793 }, ApiGeoEntityType.STATE, []),
        ...this.mockGeoEntity("Ohio", "oh", { lat: 40.3736, lng: -82.7755 }, ApiGeoEntityType.STATE, [cox]),
        ...this.mockGeoEntity("Oklahoma", "ok", { lat: 35.5376, lng: -96.9247 }, ApiGeoEntityType.STATE, []),
        ...this.mockGeoEntity("Oregon", "or", { lat: 44.5672, lng: -122.1269 }, ApiGeoEntityType.STATE, [comcast]),
        ...this.mockGeoEntity("Pennsylvania", "pa", { lat: 40.5773, lng: -77.264 }, ApiGeoEntityType.STATE, []),
        ...this.mockGeoEntity("Rhode Island", "ri", { lat: 41.6772, lng: -71.5101 }, ApiGeoEntityType.STATE, []),
        ...this.mockGeoEntity("South Carolina", "sc", { lat: 33.8191, lng: -80.9066 }, ApiGeoEntityType.STATE, []),
        ...this.mockGeoEntity("South Dakota", "sd", { lat: 44.2853, lng: -99.4632 }, ApiGeoEntityType.STATE, []),
        ...this.mockGeoEntity("Tennessee", "tn", { lat: 35.7449, lng: -86.7489 }, ApiGeoEntityType.STATE, []),
        ...this.mockGeoEntity("Texas", "tx", { lat: 31.106, lng: -97.6475 }, ApiGeoEntityType.STATE, []),
        ...this.mockGeoEntity("Utah", "ut", { lat: 40.1135, lng: -111.8535 }, ApiGeoEntityType.STATE, [comcast]),
        ...this.mockGeoEntity("Vermont", "vt", { lat: 44.0407, lng: -72.7093 }, ApiGeoEntityType.STATE, []),
        ...this.mockGeoEntity("Virginia", "va", { lat: 37.768, lng: -78.2057 }, ApiGeoEntityType.STATE, []),
        ...this.mockGeoEntity("Washington", "wa", { lat: 47.3917, lng: -121.5708 }, ApiGeoEntityType.STATE, []),
        ...this.mockGeoEntity("West Virginia", "wv", { lat: 38.468, lng: -80.9696 }, ApiGeoEntityType.STATE, []),
        ...this.mockGeoEntity("Wisconsin", "wi", { lat: 44.2563, lng: -89.6385 }, ApiGeoEntityType.STATE, []),
        ...this.mockGeoEntity("Wyoming", "wy", { lat: 42.7475, lng: -107.2085 }, ApiGeoEntityType.STATE, []),
      ]),
    ]);

    const europe = this.mockGeoEntity("Europe", "eu", { lat: 0, lng: 0 }, ApiGeoEntityType.CONTINENT, [
      ...this.mockGeoEntity("France", "fr", { lat: 46.227638, lng: 2.213749 }, ApiGeoEntityType.COUNTRY, [
        comcast,
        cox,
      ]),
      ...this.mockGeoEntity("Israel", "il", { lat: 31.046051, lng: 34.851612 }, ApiGeoEntityType.COUNTRY, [fios]),
      ...this.mockGeoEntity("Andorra", "ad", { lat: 42.546245, lng: 1.601554 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Albania", "al", { lat: 41.153332, lng: 20.168331 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Austria", "at", { lat: 47.516231, lng: 14.550072 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Bosnia", "ba", { lat: 43.915886, lng: 17.679076 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Belgium", "be", { lat: 50.503887, lng: 4.469936 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Bulgaria", "bg", { lat: 42.733883, lng: 25.48583 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Belarus", "by", { lat: 53.709807, lng: 27.953389 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Switzerland", "ch", { lat: 46.818188, lng: 8.227512 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Cyprus", "cy", { lat: 35.126413, lng: 33.429859 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Czech Republic", "cz", { lat: 49.817492, lng: 15.472962 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Germany", "de", { lat: 51.165691, lng: 10.451526 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Denmark", "dk", { lat: 56.26392, lng: 9.501785 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Estonia", "ee", { lat: 58.595272, lng: 25.013607 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Spain", "es", { lat: 40.463667, lng: -3.74922 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Finland", "fi", { lat: 61.92411, lng: 25.748151 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Faroe Islands", "fo", { lat: 61.892635, lng: -6.911806 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("United Kingdom", "gb", { lat: 55.378051, lng: -3.435973 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Guernsey", "gg", { lat: 49.465691, lng: -2.585278 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Gibraltar", "gi", { lat: 36.137741, lng: -5.345374 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Greece", "gr", { lat: 39.074208, lng: 21.824312 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Croatia", "hr", { lat: 45.1, lng: 15.2 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Hungary", "hu", { lat: 47.162494, lng: 19.503304 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Ireland", "ie", { lat: 53.41291, lng: -8.24389 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Isle of Man", "im", { lat: 54.236107, lng: -4.548056 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Iceland", "is", { lat: 64.963051, lng: -19.020835 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Italy", "it", { lat: 41.87194, lng: 12.56738 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Jersey", "je", { lat: 49.214439, lng: -2.13125 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Liechtenstein", "li", { lat: 47.166, lng: 9.555373 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Lithuania", "lt", { lat: 55.169438, lng: 23.881275 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Luxembourg", "lu", { lat: 49.815273, lng: 6.129583 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Latvia", "lv", { lat: 56.879635, lng: 24.603189 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Monaco", "mc", { lat: 43.750298, lng: 7.412841 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Moldova", "md", { lat: 47.411631, lng: 28.369885 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Montenegro", "me", { lat: 42.708678, lng: 19.37439 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Macedonia", "mk", { lat: 41.608635, lng: 21.745275 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Malta", "mt", { lat: 35.937496, lng: 14.375416 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Netherlands", "nl", { lat: 52.132633, lng: 5.291266 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Norway", "no", { lat: 60.472024, lng: 8.468946 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Poland", "pl", { lat: 51.919438, lng: 19.145136 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Portugal", "pt", { lat: 39.399872, lng: -8.224454 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Romania", "ro", { lat: 45.943161, lng: 24.96676 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Serbia", "rs", { lat: 44.016521, lng: 21.005859 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Russia", "ru", { lat: 61.52401, lng: 105.318756 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Sweden", "se", { lat: 60.128161, lng: 18.643501 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Slovenia", "si", { lat: 46.151241, lng: 14.995463 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Slovakia", "sk", { lat: 48.669026, lng: 19.699024 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("San Marino", "sm", { lat: 43.94236, lng: 12.457777 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Ukraine", "ua", { lat: 48.379433, lng: 31.16558 }, ApiGeoEntityType.COUNTRY, []),
      ...this.mockGeoEntity("Vatican City", "va", { lat: 41.902916, lng: 12.453389 }, ApiGeoEntityType.COUNTRY, []),
    ]);

    return new MarketplaceEntities([...isps, ...europe, ...northAmerica]);
  }
}
