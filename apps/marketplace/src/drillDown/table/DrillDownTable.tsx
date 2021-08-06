import * as React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { DrillDownTableModel } from "./drillDownTableModel";
import { DrillDownTableRow } from "./row/DrillDownTableRow";
import { DrillDownTableHeader } from "./header/DrillDownTableHeader";
import { ErrorBoundary } from "@qwilt/common/components/ErrorBoundary";
import { Colors } from "../../_styling/colors";
import { LoadingSpinner } from "@qwilt/common/components/loadingSpinner/loadingSpinner/LoadingSpinner";

const DrillDownTableView = styled.div`
  position: relative;
`;

export interface Props {
  model: DrillDownTableModel;

  className?: string;
}

const initialState = {};

type State = Readonly<typeof initialState>;

const Table = styled.table`
  text-align: center;
  width: 100%;
  font-size: 12px;
  border-collapse: collapse;
  background-color: white;
`;
const LoadingView = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  background-color: ${Colors.WHITE};
`;
const SeparatingLabel = styled.div`
  border: 1px solid #e5e5e5;
  text-transform: uppercase;
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${Colors.WHITE};
  span {
    color: ${Colors.NAVY_4};
    font-weight: 300;
    font-size: 12px;
  }
`;
@observer
export class DrillDownTable extends React.Component<Props, State> {
  static defaultProps = {};
  readonly state: State = initialState;

  render() {
    const model = this.props.model;
    return (
      <DrillDownTableView className={this.props.className}>
        <SeparatingLabel>
          <span>{model.dataTimeSpan === "month" ? "last 30 days summary" : "last 24 hours summary"}</span>
        </SeparatingLabel>
        {model.isLoading ? (
          <LoadingView>
            <LoadingSpinner />
          </LoadingView>
        ) : (
          <Table>
            <DrillDownTableHeader
              highlightedMetricsColumn={model.highlightedMetricsColumn}
              currentSort={model.sortRowsBy}
              setSort={model.setSortBy}
            />
            <tbody>
              {model.rows.map((row) => (
                <ErrorBoundary key={row.id} hidden={true}>
                  <DrillDownTableRow model={row} highlightedMetricsColumn={model.highlightedMetricsColumn} />
                </ErrorBoundary>
              ))}
            </tbody>
          </Table>
        )}
      </DrillDownTableView>
    );
  }
}
