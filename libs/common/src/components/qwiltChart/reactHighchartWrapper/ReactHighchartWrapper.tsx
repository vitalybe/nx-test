import * as React from "react";
import styled from "styled-components";
import * as _ from "lodash";
import Highcharts, { AreaChart, ChartObject, Options, PlotOptions, RendererObject } from "highcharts";
import ReactHighcharts from "react-highcharts";
import { loggerCreator } from "common/utils/logger";
import { Fonts } from "common/styling/fonts";

const patternFillModule = require("highcharts/modules/pattern-fill.src.js");

if (typeof Highcharts === "object") {
  patternFillModule(Highcharts);
}

const moduleLogger = loggerCreator(__filename);

const ReactHighchartWrapperView = styled.div`
  height: 100%;
  width: 100%;
`;

export interface Props {
  chartConfig: Options;

  className?: string;
  drawAdditionsCallback?: (chart: Highcharts.ChartObject, renderer: RendererObject) => void;
  chartReadyCallback?: (chart: ChartObject) => void;
}

const initialState = { sizeKnown: false, width: 0, height: 0 };

type State = Readonly<typeof initialState>;

export class ReactHighchartWrapper extends React.Component<Props, State> {
  static defaultProps = {};
  readonly state: State = initialState;

  viewRef = React.createRef<HTMLDivElement>();

  chartInstance: ChartObject | undefined;

  onResize = _.debounce(() => {
    const viewDOM = this.viewRef.current;
    if (viewDOM && this.chartInstance) {
      this.chartInstance.setSize(viewDOM.offsetWidth, viewDOM.offsetHeight);
      this.chartInstance.redraw(false);
      this.chartInstance.reflow();
      this.drawAdditions();
    }
  }, 100);

  chartIsReady = (chart: ChartObject) => {
    this.chartInstance = chart;
    if (this.props.chartReadyCallback) {
      this.props.chartReadyCallback(chart);
    }
    this.drawAdditions();
  };

  drawAdditions = () => {
    if (this.chartInstance && this.props.drawAdditionsCallback) {
      this.props.drawAdditionsCallback(this.chartInstance, this.chartInstance.renderer);
    }
  };

  // noinspection JSUnusedGlobalSymbols
  isDifferentConfig(newChartConfig: Options) {
    return newChartConfig !== this.props.chartConfig;
  }

  componentDidMount() {
    const viewDOM = this.viewRef.current!;
    window.addEventListener("resize", this.onResize, false);
    this.setState({ sizeKnown: true, height: viewDOM.offsetHeight, width: viewDOM.offsetWidth });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize, false);
  }

  componentDidUpdate() {
    const viewDOM = this.viewRef.current;
    if (viewDOM && viewDOM.offsetWidth !== this.state.width) {
      this.setState({ width: viewDOM.offsetWidth, height: viewDOM.offsetHeight });
      this.onResize();
    }
  }

  // to prevent errors caused by unexpected re-render and break chart instance consistency
  shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>): boolean {
    const sizeIsKnown = this.state.sizeKnown !== nextState.sizeKnown;
    if (sizeIsKnown) {
      moduleLogger.debug("size of chart is now known - will rerender");
      return true;
    } else if (this.isDifferentConfig(nextProps.chartConfig)) {
      moduleLogger.debug("configuration changed - will rerender");
      return true;
    } else {
      return false;
    }
  }

  render() {
    moduleLogger.debug("rendering _parts");
    let highcharts = undefined;
    if (this.state.sizeKnown) {
      const configClone = _.cloneDeep(this.props.chartConfig);
      configClone.chart = {
        ...configClone.chart,
        height: this.state.height,
        width: this.state.width,
        events: {
          ...(configClone.chart ? configClone.chart.events : {}),
          redraw: this.drawAdditions,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;
      highcharts = <ReactHighcharts config={configClone} callback={this.chartIsReady} />;
    }
    return (
      <ReactHighchartWrapperView ref={this.viewRef} className={this.props.className}>
        {highcharts}
      </ReactHighchartWrapperView>
    );
  }
}

// provides a simple default configuration so you're good to go
export function getBaseChartConfig(): Options {
  return {
    chart: {
      animation: false,
      // remove all the margins of the chart
      spacingTop: 0,
      spacingRight: 0,
      spacingBottom: 0,
      spacingLeft: 0,
      plotBorderWidth: 0,
      style: {
        fontFamily: Fonts.FONT_FAMILY,
      },
    },
    series: [],
    plotOptions: {
      series: {
        borderRadiusTopLeft: 5,
        lineWidth: 2,
        cursor: "pointer",
        animation: false,
        states: {
          inactive: {
            opacity: 1,
          },
          hover: {
            enabled: false,
            animation: {
              duration: 2000,
            },
            lineWidth: 1,
            halo: {
              size: 5,
            },
          },
        },
        marker: {
          symbol: "circle",
          lineColor: "black",
          radius: 3,
          // If enabled all the bubbleMarkers show if chart is large enough
          enabled: false,
        },
      } as AreaChart,
    } as PlotOptions,
    title: {
      text: "",
    },
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
  };
}
