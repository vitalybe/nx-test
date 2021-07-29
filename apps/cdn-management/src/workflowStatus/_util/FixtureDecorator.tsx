import React from "react";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { WorkflowStore, WorkflowStoreContextProvider } from "src/workflowStatus/_stores/workflowStore";
import { CdnEntity } from "src/_domain/cdnEntity";

// NOTE: Fixture decorators must be not-functional componenets - We get warnings otherwise
class FixtureStoreDecorator extends React.Component<{ className?: string }> {
  store = new WorkflowStore(CdnEntity.createMock());

  render() {
    return (
      <FixtureDecorator className={this.props.className}>
        <WorkflowStoreContextProvider store={this.store}>{this.props.children}</WorkflowStoreContextProvider>
      </FixtureDecorator>
    );
  }
}

export default FixtureStoreDecorator;
