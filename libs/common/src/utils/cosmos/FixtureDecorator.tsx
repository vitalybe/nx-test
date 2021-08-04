import React from "react";
import { RootComponents } from "common/components/RootComponents";
import { QueryClientProvider } from "react-query";
import { GlobalStore } from "common/stores/globalStore";

const queryClient = GlobalStore.instance.queryClient;

// NOTE: Fixture decorators must be not-functional componenets - We get warnings otherwise
export class FixtureDecorator extends React.Component<{ className?: string }> {
  render() {
    return (
      <QueryClientProvider client={queryClient}>
        <div>
          <RootComponents />
          <div className={this.props.className}>{this.props.children}</div>
        </div>
      </QueryClientProvider>
    );
  }
}

export default FixtureDecorator;
