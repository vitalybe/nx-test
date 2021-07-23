import * as React from "react";
import { ErrorInfo } from "react";
import styled, { css } from "styled-components";
import { Notifier } from "common/utils/notifications/notifier";

const ErrorBoundaryView = styled.div`
  ${(props: { hidden?: boolean }) => css`
    display: ${props.hidden ? "none" : "block"};
  `};
`;

interface Props {
  hidden?: boolean;
  errorStateChildren?: React.ReactChild | React.ReactChildren;
}

const initialState = { hasError: false };
type State = Readonly<typeof initialState>;

export class ErrorBoundary extends React.Component<Props, State> {
  readonly state: State = initialState;

  constructor(props: Props) {
    super(props);
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Display fallback UI
    this.setState({ hasError: true });
    Notifier.error("Error occurred in component: ", { ...error, stack: info?.componentStack });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <ErrorBoundaryView hidden={this.props.hidden}>
          {this.props.errorStateChildren ? (
            this.props.errorStateChildren
          ) : (
            <>
              <h1>An unexpected error occurred</h1>
              <div>Please try reloading the application or contact support</div>
            </>
          )}
        </ErrorBoundaryView>
      );
    }
    return this.props.children;
  }
}
