import * as React from "react";
import styled, { css } from "styled-components";
import { observer } from "mobx-react";
import transparentize from "polished/lib/color/transparentize";
import { Colors } from "src/_styling/colors";
import { DrillDownTableStyles } from "src/drillDown/table/drillDownTableStyles";
import { MetricTypesEnum } from "src/_domain/metricTypes";
import { TableMetricType } from "src/drillDown/table/drillDownTableModel";
import { BwPeakIcon } from "common/components/metrics/icons/bwPeakIcon/BwPeakIcon";
import { BwAvgIcon } from "common/components/metrics/icons/bwAvgIcon/BwAvgIcon";

const DrillDownHeaderView = styled.thead`
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12);
`;

const HeaderRow = styled.tr`
  cursor: pointer;
`;

const SubHeaderRow = styled.tr``;

const Th = styled.th`
  ${(props: { isHighlighted?: boolean }) => css`
    ${DrillDownTableStyles.CELL_STYLE};

    ${props.isHighlighted &&
    css`
      background-color: ${DrillDownTableStyles.HIGHLIGHT_COLOR};
    `};

    min-width: 50px;
    ${SubHeaderRow} & {
      font-weight: normal;
    }

    padding-top: 12px;
    padding-bottom: 0.5em;
    font-size: 14px;
    text-transform: uppercase;

    &:hover {
      ${SortIconImg} {
        opacity: 0.6;
      }
    }
  `};
`;

const ThExport = styled(Th)`
  text-align: right;
`;

const AvailableTh = styled(Th)`
  color: ${Colors.BLUE_3};
`;

const SubheaderContainer = styled.div<{}>`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SortIconImg = styled.span`
  ${(props: { enabled: boolean }) => css`
    opacity: ${props.enabled ? 1 + "!important" : 0};
    margin-left: 5px;
    transition: 0.2s ease-out;
  `};
`;

const SortIconComponent = styled.img`
 ${(props: { black: boolean }) => css`
   width: 10px;
   height: 10px;
   flex: 0 1 auto;
   cursor: pointer;
   filter: ${props.black ? "brightness(0%)" : "none"};
 `};
}

`;

const sortIconPath = require("common/images/sort.svg");

const SortIcon = (props: { metricType?: MetricTypesEnum; enabled: boolean; className?: string; black?: boolean }) => {
  return (
    <SortIconImg enabled={props.enabled}>
      <SortIconComponent alt={"sort"} src={sortIconPath} black={props.black ? props.black : false} />
    </SortIconImg>
  );
};

const PeakIconStyled = styled(BwPeakIcon).attrs({ iconTheme: "dark" })`
  height: 16px;
  width: 16px;
`;
const AvgIconStyled = styled(BwAvgIcon).attrs({ iconTheme: "dark" })`
  height: 16px;
  width: 16px;
`;
const HeaderTitle = styled.span<{ isAvailable: boolean }>`
  color: ${(props) => (props.isAvailable ? transparentize(0.4, Colors.BLUE_3) : "inherit")};
  font-size: 10px;
  margin-left: 0.2em;
`;

export interface Props {
  highlightedMetricsColumn: MetricTypesEnum;
  setSort: (type: TableMetricType) => void;
  currentSort: TableMetricType | undefined;
  className?: string;
}

const initialState = {};

type State = Readonly<typeof initialState>;

@observer
export class DrillDownTableHeader extends React.Component<Props, State> {
  static defaultProps = {};
  readonly state: State = initialState;

  render() {
    const { highlightedMetricsColumn, currentSort } = this.props;
    return (
      <DrillDownHeaderView className={this.props.className}>
        <HeaderRow>
          <Th rowSpan={2} />
          <Th rowSpan={2}>Selection</Th>
          <AvailableTh
            isHighlighted={highlightedMetricsColumn === MetricTypesEnum.AVAILABLE_BW}
            onClick={() => this.props.setSort(MetricTypesEnum.AVAILABLE_BW)}
            colSpan={2}>
            available bandwidth
            <SortIcon
              metricType={MetricTypesEnum.AVAILABLE_BW}
              enabled={currentSort === MetricTypesEnum.AVAILABLE_BW}
            />
          </AvailableTh>
          <AvailableTh
            isHighlighted={highlightedMetricsColumn === MetricTypesEnum.AVAILABLE_TPS}
            onClick={() => this.props.setSort(MetricTypesEnum.AVAILABLE_TPS)}
            colSpan={2}>
            available tps
            <SortIcon
              metricType={MetricTypesEnum.AVAILABLE_TPS}
              enabled={currentSort === MetricTypesEnum.AVAILABLE_TPS}
            />
          </AvailableTh>
          <Th
            isHighlighted={highlightedMetricsColumn === MetricTypesEnum.BITRATE}
            onClick={() => this.props.setSort(MetricTypesEnum.BITRATE)}
            colSpan={2}>
            bitrate
            <SortIcon
              metricType={MetricTypesEnum.BITRATE}
              enabled={currentSort === MetricTypesEnum.BITRATE}
              black={true}
            />
          </Th>
          <Th rowSpan={2} onClick={() => this.props.setSort("coverage")}>
            coverage
            <SortIcon enabled={currentSort === "coverage"} black={true} />
          </Th>
          <Th rowSpan={2} onClick={() => this.props.setSort("ispCount")}>
            isp
            <SortIcon enabled={currentSort === "ispCount"} black={true} />
          </Th>
          <ThExport rowSpan={2} />
        </HeaderRow>
        <SubHeaderRow>
          <AvailableTh isHighlighted={highlightedMetricsColumn === MetricTypesEnum.AVAILABLE_BW}>
            <SubheaderContainer>
              <AvgIconStyled />
              <HeaderTitle isAvailable={true}>AVERAGE</HeaderTitle>
            </SubheaderContainer>
          </AvailableTh>
          <AvailableTh isHighlighted={highlightedMetricsColumn === MetricTypesEnum.AVAILABLE_BW}>
            <SubheaderContainer>
              <PeakIconStyled />
              <HeaderTitle isAvailable={true}>PEAK</HeaderTitle>
            </SubheaderContainer>
          </AvailableTh>
          <AvailableTh isHighlighted={highlightedMetricsColumn === MetricTypesEnum.AVAILABLE_TPS}>
            <SubheaderContainer>
              <AvgIconStyled />
              <HeaderTitle isAvailable={true}>AVERAGE</HeaderTitle>
            </SubheaderContainer>
          </AvailableTh>
          <AvailableTh isHighlighted={highlightedMetricsColumn === MetricTypesEnum.AVAILABLE_TPS}>
            <SubheaderContainer>
              <PeakIconStyled />
              <HeaderTitle isAvailable={true}>PEAK</HeaderTitle>
            </SubheaderContainer>
          </AvailableTh>
          <Th isHighlighted={highlightedMetricsColumn === MetricTypesEnum.BITRATE}>
            <SubheaderContainer>
              <AvgIconStyled />
              <HeaderTitle isAvailable={false}>AVERAGE</HeaderTitle>
            </SubheaderContainer>
          </Th>
          <Th isHighlighted={highlightedMetricsColumn === MetricTypesEnum.BITRATE}>
            <SubheaderContainer>
              <AvgIconStyled />
              <HeaderTitle isAvailable={false}>PEAK</HeaderTitle>
            </SubheaderContainer>
          </Th>
        </SubHeaderRow>
        <tr />
      </DrillDownHeaderView>
    );
  }
}
