/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import { ReactNode } from "react";
import styled from "styled-components";
import { Props, RepresentationDiff } from "./RepresentationDiff";
import { DiffMetadataEntity } from "./_domain/diffMetadataEntity";
import FixtureStoreDecorator from "../_util/FixtureDecorator";
import { WorkflowEntity } from "../_domain/workflowEntity";
import { WorkflowStore, WorkflowStoreContextProvider } from "../_stores/workflowStore";
import { JsonDiffEntity } from "../_domain/jsonDiffEntity";
import * as _ from "lodash";
import { CdnEntity } from "../../_domain/cdnEntity";

const View = styled(FixtureStoreDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1300px;
  height: 500px;
  // without 'grid' the child item won't get the dimensions of the parent
  display: grid;
`;

function getProps(): Props {
  return {
    diffMetadata: DiffMetadataEntity.createMock({
      left: WorkflowEntity.createMock(),
      right: WorkflowEntity.createMock(),
    }),
    workflowControlEvents: { onContinueWorkflow: () => {}, onStopWorkflow: () => {} },
    onClose: () => {},
  };
}

const StoreView = (props: { children: ReactNode; store?: WorkflowStore }) => (
  <View>
    <WorkflowStoreContextProvider store={new WorkflowStore(CdnEntity.createMock())}>
      <View>{props.children}</View>
    </WorkflowStoreContextProvider>
  </View>
);

export default {
  regular: () => {
    const props = getProps();
    return (
      <StoreView>
        <RepresentationDiff {...props} />
      </StoreView>
    );
  },
  "long text": (
    <StoreView>
      <RepresentationDiff {...getProps()} />
    </StoreView>
  ),
  "no workflow events": (
    <StoreView>
      <RepresentationDiff {...getProps()} workflowControlEvents={undefined} />
    </StoreView>
  ),
  "cdn locked": () => {
    const props = getProps();

    const workflowStore = new WorkflowStore(CdnEntity.createMock());
    workflowStore.isCdnLocked = true;

    return (
      <StoreView store={workflowStore}>
        <WorkflowStoreContextProvider store={workflowStore}>
          <RepresentationDiff {...props} />
        </WorkflowStoreContextProvider>
      </StoreView>
    );
  },
  "many sections": () => {
    const props = getProps();
    const diff = new JsonDiffEntity({ left: { a: 1 }, right: { b: 2 }, idGetter: undefined });
    props.diffMetadata.sections = [
      { name: "section 1", diff },
      { name: "section 2", diff },
      { name: "section 3", diff },
      { name: "section 4", diff },
      { name: "section 5", diff },
      { name: "section 6", diff },
      { name: "section 7", diff },
      { name: "section 8", diff },
      { name: "section 9", diff },
      { name: "section 10", diff },
      { name: "section 11", diff },
      { name: "section 12", diff },
      { name: "section 13", diff },
      { name: "section 14", diff },
      { name: "section 15", diff },
      { name: "section 16", diff },
      { name: "section 17", diff },
      { name: "section 18", diff },
    ];
    return (
      <StoreView>
        <RepresentationDiff {...props} />
      </StoreView>
    );
  },
  "no left side": () => {
    const props = getProps();
    props.diffMetadata = DiffMetadataEntity.createMock({
      left: undefined,
      sections: [
        DiffMetadataEntity.createDiffSection(
          undefined,
          {
            main: {
              "all-servers": Object.fromEntries(_.range(11, 55).map((i) => [i.toString(), i.toString()])),
            },
          },
          "all-servers"
        ),
      ],
    });

    return (
      <StoreView>
        <RepresentationDiff {...props} />
      </StoreView>
    );
  },
};
