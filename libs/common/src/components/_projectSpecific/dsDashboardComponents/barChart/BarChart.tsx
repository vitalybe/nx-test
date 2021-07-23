import * as React from "react";
import { memo, useMemo } from "react";
import styled from "styled-components";
import { Background } from "common/components/_projectSpecific/dsDashboardComponents/barChart/_parts/Background";
import { Plot } from "common/components/_projectSpecific/dsDashboardComponents/barChart/_parts/Plot";
import {
  BarChartDataItem,
  BarChartPlotOptions,
  BarChartYAxisOptions,
} from "common/components/_projectSpecific/dsDashboardComponents/barChart/_types/_types";
import { BarChartModel } from "common/components/_projectSpecific/dsDashboardComponents/barChart/_types/barChartModel";
import { Utils } from "common/utils/utils";
import _ from "lodash";

//region [[ Styles ]]
const BottomLabelsWhiteSpace = styled.div`
  height: 1.5rem;
  width: 100%;
  margin: 0 auto;
`;

const ChartView = styled.div`
  width: 100%;
  flex: 1 1 auto;
  position: relative;
`;

const BarChartView = styled.div<{}>`
  display: flex;
  flex-direction: column;
  font-family: Avenir, sans-serif;
  padding-top: 1.5rem;
  height: 100%;
  width: 100%;
  flex: 1 1 auto;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  data: BarChartDataItem[];
  plotOptions?: BarChartPlotOptions;
  yAxisOptions?: BarChartYAxisOptions;
  drilldownId?: number | string;
  highlightIds?: Array<number | string>;
  noDataComponent?: JSX.Element;
  className?: string;
}

//endregion [[ Props ]]

export const BarChart = memo(
  ({ data, plotOptions = {}, yAxisOptions = {}, drilldownId, highlightIds, ...props }: Props) => {
    const model = useMemo(() => {
      return new BarChartModel({ data });
    }, [data]);

    const itemsList = useMemo(() => {
      const drilldownItem = drilldownId ? model.getItem(drilldownId) : undefined;
      let items = model.data;
      if (drilldownItem) {
        const children = drilldownItem.children || [];
        items = plotOptions.includeDrilldownParent || children.length === 0 ? [drilldownItem, ...children] : children;
      }
      return items.filter((item) => item.isVisible !== false);
    }, [drilldownId, plotOptions, model]);

    const highlightedChildren = useMemo(() => {
      return getHighlightedChildren(model, highlightIds);
    }, [highlightIds, model]);

    return hasData(itemsList) ? (
      <BarChartView className={props.className}>
        <ChartView>
          <Background model={model} yAxisOptions={yAxisOptions} />
          <Plot
            model={model}
            plotOptions={plotOptions}
            yAxisOptions={yAxisOptions}
            itemsList={itemsList}
            isDrilldown={drilldownId !== undefined}
            highlightedChildren={highlightedChildren}
          />
        </ChartView>
        {plotOptions.outsideLabels && <BottomLabelsWhiteSpace />}
      </BarChartView>
    ) : (
      props.noDataComponent || <span>no data</span>
    );
  },
  propsAreEqual
);

function propsAreEqual(prevProps: Props, props: Props) {
  return _.isEqual(prevProps, props);
}

function getHighlightedChildren(model: BarChartModel, ids: Array<string | number> | undefined) {
  return ids?.map((id) => model.getItem(id)).filter(Utils.isTruthy) || [];
}

function hasData(itemsList: BarChartDataItem[]) {
  const sum = _.sumBy(itemsList, (item) => item.value || 0);
  return itemsList && itemsList.length > 0 && sum > 0;
}
