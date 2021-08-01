import * as _ from "lodash";
import {
  AnalyticsFilterParamsEnum,
  AnalyticsGeneralParamsEnum,
  AnalyticsParams,
  AnalyticsParamsType,
  ApiHistogramBin,
  ApiHistogramGroupBin,
  ApiHistogramGroupStatsList,
  ApiHistogramGroupType,
  ApiHistogramStatsList,
  ApiHistogramType,
  ApiPercentileType,
  ApiSeries,
} from "../mediaAnalyticsTypes";
import { TimeConfig } from "../../../utils/timeConfig";
import { MediaAnalyticsSeries } from "../mediaAnalyticsSeries";
import { MediaAnalyticsApi } from "../../mediaAnalytics";
import { DateTime, Duration } from "luxon";
import { Utils } from "../../../utils/utils";
import mockData from "../../_utils/mockData";
import { sleep } from "../../../utils/sleep";
import { mockNetworkSleep, mockUtils } from "../../../utils/mockUtils";

interface HistogramOptions {
  from: DateTime;
  to: DateTime;
  series: MediaAnalyticsSeries[];
  systems: string[];
  binInterval: Duration;
  groupBy?: string;
  geos?: string[];
  sites?: string[];
  dsgs?: string[];
  totals?: boolean;
  stats?: boolean;
}

type FilterNames = "geos" | "dsgs" | "systems" | "sites";
type FilterValues = { [key in FilterNames]: string[] };

interface MockConfigOfMediaAnalytics {
  valueForMinBinInterval: number;
  valuesCycleDuration: Duration;
  valuesCycleChange: { percent: number; percentOfSeed: number }[];
  minBinInterval: Duration;
  autoAdjustTimeConfig: boolean;
  // Filters/Groups
  possibleFilters: { [key in FilterNames]: string[] };
  // Default strength is 1
  filterStrengthOverride: { [key: string]: number };
}

interface FilterCombination {
  filters: string[];
  filtersStrength: number;
}

type ValuesBySeries = Map<string, { timestamp: DateTime; value: number }[]>;

export class MediaAnalyticsApiMock extends MediaAnalyticsApi {
  mockConfigOfMediaAnalytics: MockConfigOfMediaAnalytics = this.getMockConfigOfMediaAnalytics();

  private getMockConfigOfMediaAnalytics(): MockConfigOfMediaAnalytics {
    return {
      // base of bin values for the minimum interval of the series
      valueForMinBinInterval: Math.pow(10, 9),
      minBinInterval: Duration.fromObject({ minute: 5 }),

      // NOTE: valuesCycleDuration by default won't do much unless CycleChange is specified
      valuesCycleDuration: Duration.fromObject({ day: 1 }),
      valuesCycleChange: [{ percent: 0, percentOfSeed: 100 }],

      possibleFilters: {
        dsgs: mockData.dsgs.slice(),
        geos: mockData.geos.slice(),
        systems: mockData.qns.slice(),
        sites: mockData.sites.slice(),
      },
      filterStrengthOverride: {},
      autoAdjustTimeConfig: true,
    };
  }

  private getFilterStrength(filter: string) {
    let strength = 1;
    const override = this.mockConfigOfMediaAnalytics.filterStrengthOverride[filter];
    if (override !== undefined) {
      strength = override;
    }

    return strength;
  }

  private _generateBins(from: number, to: number, binInterval: number): ApiHistogramBin[] | ApiHistogramGroupBin[] {
    const bins = [];
    for (let current = from; current < to; current += binInterval) {
      bins.push({
        timestamp: current,
        missingData: false,
        series: {},
      });
    }

    return bins;
  }

  private _generateSeries(timestamp: number, series: string[], seriesValue: ValuesBySeries, strengthPercent: number) {
    const newSeries: ApiSeries = {};

    for (const [, name] of series.entries()) {
      const serieValues = seriesValue.get(name);
      if (!serieValues) {
        throw new Error(`serie not found: ${name}`);
      }

      const valueEntry = serieValues.find((entry) => entry.timestamp.toSeconds() === timestamp);
      if (!valueEntry) {
        throw new Error(`timestamp not found: ${timestamp}`);
      }

      newSeries[name] = (valueEntry.value / 100) * strengthPercent;
    }

    return newSeries;
  }

  private _generateGroups(
    timestamp: number,
    series: string[],
    filterName: FilterNames,
    seriesValue: ValuesBySeries,
    strengthPercentPerGroup: Map<string, number>
  ) {
    const newGroups: {
      [itemName: string]: {
        series: ApiSeries;
        missingData: boolean;
      };
    } = {};

    for (const group of this.mockConfigOfMediaAnalytics.possibleFilters[filterName]) {
      const strengthPercent = strengthPercentPerGroup.get(group);
      if (strengthPercent === undefined) {
        throw new Error(`no strength found for group: ${group}`);
      }
      // Ability to have zero data for groups with specified tag, e.g, DSG with no data
      newGroups[group] = {
        series: this._generateSeries(timestamp, series, seriesValue, strengthPercent),
        missingData: false,
      };
    }

    return newGroups;
  }

  private _setBinSeriesStats(timestamp: number, binSeries: ApiSeries, stats: ApiHistogramStatsList) {
    for (const seriesName of Object.keys(binSeries)) {
      const min = stats.statsResults.min.series;
      const minDetailed = stats.detailedStatsResults.min.series;
      if (min[seriesName] === undefined || min[seriesName] > binSeries[seriesName]) {
        min[seriesName] = binSeries[seriesName];
        minDetailed[seriesName] = { timestamp: timestamp, value: binSeries[seriesName] };
      }

      const max = stats.statsResults.max.series;
      const maxDetailed = stats.detailedStatsResults.max.series;
      if (max[seriesName] === undefined || max[seriesName] < binSeries[seriesName]) {
        max[seriesName] = binSeries[seriesName];
        maxDetailed[seriesName] = { timestamp: timestamp, value: binSeries[seriesName] };
      }
    }
  }

  private getValuesCycleModifier(currentDate: DateTime) {
    const valuesCycleChange = this.mockConfigOfMediaAnalytics.valuesCycleChange;

    if (valuesCycleChange.length < 1) {
      throw new Error(`config.valuesCycleChange must be >= 1`);
    }

    const valuesCycleDurationSeconds = this.mockConfigOfMediaAnalytics.valuesCycleDuration.as("second");
    const timestampInCycle = currentDate.toSeconds() % valuesCycleDurationSeconds;
    const percentOfCycle = timestampInCycle / valuesCycleDurationSeconds;

    let modifierPercent = valuesCycleChange[0].percentOfSeed;
    for (let i = 1; i < this.mockConfigOfMediaAnalytics.valuesCycleChange.length; i++) {
      if (percentOfCycle < this.mockConfigOfMediaAnalytics.valuesCycleChange[i].percentOfSeed) {
        break;
      }

      modifierPercent = valuesCycleChange[i].percentOfSeed;
    }

    return modifierPercent / 100;
  }

  private async getAllSeriesValues(
    fromDate: DateTime,
    toDate: DateTime,
    series: MediaAnalyticsSeries[],
    binInterval: Duration
  ): Promise<ValuesBySeries> {
    const minBinInterval = await this.getMinimumBinIntervalForSeries();

    const minBinIntervalSeconds = minBinInterval.as("second");
    if (fromDate.toSeconds() % minBinIntervalSeconds !== 0) throw new Error(`from % minBinInterval must be 0`);
    if (toDate.toSeconds() % minBinIntervalSeconds !== 0) throw new Error(`to % minBinInterval must be 0`);
    if (+binInterval % minBinIntervalSeconds !== 0) throw new Error(`binInterval % minBinInterval must be 0`);

    const values: ValuesBySeries = new Map();
    for (const serie of series) {
      values.set(serie.name, []);
      for (let currentDate = fromDate; currentDate < toDate; currentDate = currentDate.plus(binInterval)) {
        const nextSubdate = currentDate.plus(binInterval);
        let value = 0;
        for (
          let currentSubDate = currentDate;
          currentSubDate < nextSubdate;
          currentSubDate = currentSubDate.plus(minBinInterval)
        ) {
          let subValue = this.mockConfigOfMediaAnalytics.valueForMinBinInterval;
          subValue = subValue * this.getValuesCycleModifier(currentDate);
          value += subValue;
        }

        // store values already grouped by binInterval - minBinInterval values aren't stored.
        values.get(serie.name)!.push({ timestamp: currentDate, value: value });
      }
    }

    return values;
  }

  // from: https://stackoverflow.com/questions/15298912/javascript-generating-combinations-from-n-arrays-with-m-elements
  private _cartesian(groups: Array<string[]>) {
    const result: Array<string[]> = [];
    const max = groups.length - 1;

    function helper(arr: string[], i: number) {
      for (let j = 0, l = groups[i].length; j < l; j++) {
        const a = arr.slice(0); // clone arr
        a.push(groups[i][j]);
        if (i == max) {
          result.push(a);
        } else {
          helper(a, i + 1);
        }
      }
    }
    helper([], 0);
    return result;
  }

  private getAllFilterCombinations(): FilterCombination[] {
    const configuredFilters = Object.values(this.mockConfigOfMediaAnalytics.possibleFilters);
    const filtersCombinations = this._cartesian(configuredFilters);
    return filtersCombinations.map((filters) => {
      const filtersStrength = _.sumBy(filters, (filter) => this.getFilterStrength(filter));
      return { filters: filters, filtersStrength: filtersStrength };
    });
  }

  private calculateStrengthForFilters(filterGroups: string[][], filterCombinations: FilterCombination[]) {
    const combinationsWithFilters = filterCombinations.filter((combination) => {
      // We're filtering for combination that include the given filters, for example, for these filters:
      // [ [dsg1, dsg2], [systemId1] ]
      // We want only combination that include (dsg1 OR dsg2) AND (system1)
      return filterGroups.every((filterGroup) => {
        return (
          filterGroup.length === 0 ||
          filterGroup.some((filter) => {
            return combination.filters.indexOf(filter) === -1;
          })
        );
      });
    });

    return _.sumBy(combinationsWithFilters, (combination) => combination.filtersStrength);
  }

  private calculateStrengthPercent(filters: FilterValues): number {
    const allFiltersCombination = this.getAllFilterCombinations();
    const configuredFilters = Object.values(filters);

    const totalCombinationStrength = _.sumBy(allFiltersCombination, (combination) => combination.filtersStrength);
    const filtersStrength = this.calculateStrengthForFilters(configuredFilters, allFiltersCombination);

    return Utils.calcPercent(filtersStrength, totalCombinationStrength);
  }

  private calculateStrengthPercentPerGroup(group: FilterNames, filters: FilterValues): Map<string, number> {
    const allFiltersCombination = this.getAllFilterCombinations();
    const totalCombinationStrength = _.sumBy(allFiltersCombination, (combination) => combination.filtersStrength);

    const result = new Map<string, number>();
    for (const groupFilter of this.mockConfigOfMediaAnalytics.possibleFilters[group]) {
      const filtersClone = _.cloneDeep(filters);
      // During group-by, ignore the existing filters for this groupName.
      // For example, if grouping by dsg, then ignore the existing filters on DSG and focus on each group
      filtersClone[group] = [groupFilter];

      const filtersStrength = this.calculateStrengthForFilters(Object.values(filtersClone), allFiltersCombination);
      result.set(groupFilter, Utils.calcPercent(filtersStrength, totalCombinationStrength));
    }
    return result;
  }

  private loadBinsData(
    bins: ApiHistogramBin[],
    seriesNames: string[],
    seriesValues: ValuesBySeries,
    filters: FilterValues,
    statsData: ApiHistogramStatsList
  ) {
    const strengthPercent = this.calculateStrengthPercent(filters);

    for (const [, bin] of bins.entries()) {
      const regularBin = bin as ApiHistogramBin;
      regularBin["series"] = this._generateSeries(bin.timestamp, seriesNames, seriesValues, strengthPercent);
      this._setBinSeriesStats(bin.timestamp, regularBin["series"], statsData);
    }
  }

  private loadGroupBinsData(
    bins: ApiHistogramGroupBin[],
    groupBy: string,
    seriesNames: string[],
    seriesValues: ValuesBySeries,
    filters: FilterValues,
    groupStats: ApiHistogramGroupStatsList
  ) {
    let groupName: string;
    let filterName: FilterNames;

    if (groupBy === "systems") {
      groupName = "system";
      filterName = "systems";
    } else if (groupBy === "geo") {
      groupName = "geo";
      filterName = "geos";
    } else if (groupBy === "sites") {
      groupName = "site";
      filterName = "sites";
    } else if (groupBy === "dsgs") {
      groupName = "dsg";
      filterName = "dsgs";
    } else {
      throw new Error(`unsupported groupBy: ${groupBy}`);
    }

    const strengthPercentPerGroup = this.calculateStrengthPercentPerGroup(filterName, filters);

    for (const [, bin] of bins.entries()) {
      const groupBin = bin as ApiHistogramGroupBin;
      groupBin["group"] = {
        [groupName]: this._generateGroups(
          groupBin.timestamp,
          seriesNames,
          filterName,
          seriesValues,
          strengthPercentPerGroup
        ),
      };

      const groups = Object.values(groupBin)[0];
      for (const group of Object.keys(groups)) {
        if (!groupStats.group[group]) {
          groupStats.group[group] = {
            statsResults: { min: { series: {} }, max: { series: {} } },
            detailedStatsResults: { min: { series: {} }, max: { series: {} } },
          };
        }
        this._setBinSeriesStats(groupBin.timestamp, groups[group]["chartSeriesData"], groupStats.group[group]);
      }
    }
  }

  private async _generateHistogramBody({
    from,
    to,
    binInterval,
    series,
    systems,
    groupBy,
    geos = [],
    sites = [],
    dsgs = [],
    stats = false,
  }: HistogramOptions) {
    const seriesValues: ValuesBySeries = await this.getAllSeriesValues(from, to, series, binInterval);
    const filters: FilterValues = { sites: sites, dsgs: dsgs, systems: systems, geos: geos };

    const fromTimestamp = from.toSeconds();
    const toTimestamp = to.toSeconds();
    const bins: ApiHistogramBin[] | ApiHistogramGroupBin[] = this._generateBins(
      fromTimestamp,
      toTimestamp,
      binInterval.as("second")
    );

    const statsData: ApiHistogramStatsList = {
      statsResults: { min: { series: {} }, max: { series: {} } },
      detailedStatsResults: { min: { series: {} }, max: { series: {} } },
    };
    const groupStats: ApiHistogramGroupStatsList = { group: {} };

    const seriesNames = series.map((serie) => serie.name);
    if (!groupBy) {
      this.loadBinsData(bins as ApiHistogramBin[], seriesNames, seriesValues, filters, statsData);
    } else {
      this.loadGroupBinsData(bins as ApiHistogramGroupBin[], groupBy, seriesNames, seriesValues, filters, groupStats);
    }

    const result: {
      reports: {
        overtime: {
          histogram: { bins: ApiHistogramBin[] | ApiHistogramGroupBin[]; stats: null | ApiHistogramStatsList };
        };
      };
    } = {
      reports: {
        overtime: {
          histogram: {
            bins: bins,
            stats: null,
          },
        },
      },
    };

    if (stats) {
      result.reports.overtime.histogram.stats = statsData;
    }

    return result as ApiHistogramType | ApiHistogramGroupType;
  }

  private getParamArray(params: AnalyticsParams, name: AnalyticsParamsType): string[] {
    const paramValue = params[name];
    let result: string[] = [];
    if (paramValue) {
      result = Array.isArray(paramValue) ? paramValue.map((param) => param.toString()) : [paramValue!.toString()];
    }
    return result;
  }

  private getParamString(params: AnalyticsParams, name: AnalyticsParamsType): string {
    const value = this.getParamArray(params, name);
    return value.join(",");
  }

  protected getMinimumBinIntervalForSeries = async (): Promise<Duration> => {
    return this.mockConfigOfMediaAnalytics.minBinInterval;
  };

  getPercentile = async (
    requestedTimeConfig: TimeConfig,
    series: MediaAnalyticsSeries[],
    additionalParams: AnalyticsParams
  ): Promise<ApiPercentileType> => {
    return {
      reports: {
        overtime: {
          percentiles: {
            percentile: {
              ...Object.fromEntries(
                this.getParamArray(additionalParams, AnalyticsGeneralParamsEnum.PERCENTILES).map((percentile) => [
                  percentile,
                  {
                    percentile: Number.parseFloat(percentile),
                    series: {
                      ...Object.fromEntries(
                        series.map((serie) => [serie.name, mockUtils.randomConsistent(serie.name, Math.pow(10, 10))])
                      ),
                    },
                  },
                ])
              ),
            },
          },
        },
      },
    };
  };

  getHistogram = async (
    requestedTimeConfig: TimeConfig,
    series: MediaAnalyticsSeries[],
    additionalParams: AnalyticsParams = {}
  ): Promise<{ timeConfig: TimeConfig; report: ApiHistogramGroupType | ApiHistogramType }> => {
    await sleep(mockNetworkSleep);

    const timeConfig = this.mockConfigOfMediaAnalytics.autoAdjustTimeConfig
      ? await this.getAdjustedTimeConfig(requestedTimeConfig, series)
      : requestedTimeConfig;

    const systemIdsFilter = this.getParamArray(additionalParams, AnalyticsFilterParamsEnum.SYSTEM_IDS);
    if (!systemIdsFilter) {
      throw new Error(`systemIds are required`);
    }
    let sitesFilter = this.getParamArray(additionalParams, AnalyticsFilterParamsEnum.SITES);
    const dsgsFilter = this.getParamArray(additionalParams, AnalyticsFilterParamsEnum.DSGS);

    const groupBy = this.getParamString(additionalParams, AnalyticsGeneralParamsEnum.GROUP_BY);
    if (groupBy === "sites" && sitesFilter.length === 0) {
      sitesFilter = [mockData.sites[0], mockData.sites[1], mockData.sites[2]];
    }

    return {
      timeConfig: timeConfig,
      report: await this._generateHistogramBody({
        from: timeConfig.fromDate,
        to: timeConfig.toDate,
        binInterval: timeConfig.binInterval,
        stats: true,
        series: series,
        groupBy: groupBy,
        systems: systemIdsFilter,
        sites: sitesFilter,
        dsgs: dsgsFilter,
      }),
    };
  };

  //region [[ Singleton ]]
  protected static _instance: MediaAnalyticsApiMock | undefined;
  static get instance(): MediaAnalyticsApiMock {
    if (!this._instance) {
      this._instance = new MediaAnalyticsApiMock();
    }

    return this._instance;
  }
  //endregion
}
