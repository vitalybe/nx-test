import * as React from "react";
import { ReactElement } from "react";
import { loggerCreator } from "../../../utils/logger";
import { ColDef, QwiltGridColumnDef, ReactRendererProps } from "../QwiltGrid";
import { ICellRendererParams } from "ag-grid-community";
import { ReactCellWrapper } from "../reactCellWrapper/ReactCellWrapper";

const moduleLogger = loggerCreator("__filename");

//region [[ Props ]]

type Props = ICellRendererParams & {
  innerCellRenderer: (props: ReactRendererProps<unknown>) => ReactElement;
};

//endregion [[ Props ]]

// AgGrid by default, when refreshing React rendered cell components, unmounts and remounts them
// You can avoid this by providing a refresh() function in a *class* component.
// To handle that in a generic manner and use functional components, ReactCellContainer wraps
// every react component and implements refresh itself by calling setState with the updated entity/value.
// Read more here: https://www.ag-grid.com/javascript-grid-cell-rendering-components/#handling-refresh
export class ReactCellContainer extends React.Component<Props, ReactRendererProps<unknown>> {
  constructor(props: Props) {
    super(props);
    this.state = {
      entity: props.data,
      value: props.value,
      cellRendererProps: props,
    };
  }

  refresh() {
    this.setState({
      entity: this.props.data,
      value: this.props.value,
      cellRendererProps: this.props,
    });

    return true;
  }

  render() {
    if (this.props.innerCellRenderer) {
      const colDef = this.state.cellRendererProps.colDef as ColDef | undefined;
      const qwiltColDef = colDef?.userData as QwiltGridColumnDef<unknown> | undefined;
      return (
        <ReactCellWrapper cellRendererParams={this.props} tooltipText={this.state.value}>
          {this.props.innerCellRenderer({ ...this.state, coreValue: qwiltColDef?.coreValueGetter?.(this.props.data) })}
        </ReactCellWrapper>
      );
    } else {
      return (
        <ReactCellWrapper cellRendererParams={this.props} tooltipText={this.state.value}>
          {this.state.value}
        </ReactCellWrapper>
      );
    }
  }
}
