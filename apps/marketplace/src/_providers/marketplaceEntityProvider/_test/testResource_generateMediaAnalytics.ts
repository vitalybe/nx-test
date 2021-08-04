import { Utils } from "common/utils/utils";
import { ApiHistogramGroupType } from "common/backend/mediaAnalytics/mediaAnalyticsTypes";

const entities = require("./testResource_geoEntities.json");
const ispIds = new Set<string>();

interface Entity {
  id: string;
  contains?: Entity[];
  isps: { id: string }[];
}

function getIds(entity: Entity, ids: string[]) {
  ids.push(entity.id);
  if (entity.contains && entity.contains.length > 0) {
    entity.contains.forEach(entity => getIds(entity, ids));
  }

  if (entity.isps && entity.isps.length) {
    entity.isps.forEach(isp => {
      ids.push(`${entity.id}::${isp.id}`);
      ispIds.add(isp.id);
    });
  }
}

function getGeoEntitiesIds() {
  const ids: string[] = [];

  getIds(entities.entities[0], ids);
  for (const ispId of ispIds.values()) {
    ids.push(ispId);
  }

  return ids;
}

export function generateAggregation(series: string[]) {
  const ids = getGeoEntitiesIds();

  return {
    debug: {
      message: null,
    },
    reports: {
      overtime: {
        aggregation: {
          group: {
            geo: Utils.objectMap(ids, () => ({
              series: Utils.objectMap(series, () => 1000),
            })),
          },
        },
      },
    },
  };
}

export function generateGroupHistogram(series: string[]): ApiHistogramGroupType {
  const ids = getGeoEntitiesIds();

  return {
    "#":
      "https://media-analytics.cqloud.com/api/1.0/reports/overtime/histogram/?from=1539018000&to=1539018300&debug=true&series=l2AvailableBwCapacity&bin_interval=300s&stats=max,min&geos=geo_6295630,geo_6255151,geo_4032283,geo_2077456,geo_2077456::isp_124,geo_2077456::isp_119,isp_124,isp_119&group_by=geo",
    debug: {
      message: null,
    },
    reports: {
      overtime: {
        histogram: {
          bins: [
            {
              group: {
                geo: Utils.objectMap(ids, () => ({
                  series: Utils.objectMap(series, () => 1000),
                  missingData: false,
                  docCount: 0,
                })),
              },
              timestamp: 1539018000,
              docCount: 0,
            },
          ],
          stats: {
            group: Utils.objectMap(ids, () => ({
              statsResults: {
                min: {
                  series: Utils.objectMap(series, () => 50),
                },
                max: {
                  series: Utils.objectMap(series, () => 1000),
                },
              },
              detailedStatsResults: {
                min: {
                  series: Utils.objectMap(series, () => ({
                    value: 50,
                    timestamp: 1539018000,
                  })),
                },
                max: {
                  series: Utils.objectMap(series, () => ({
                    value: 1000,
                    timestamp: 1539018000,
                  })),
                },
              },
            })),
          },
        },
      },
    },
  };
}
