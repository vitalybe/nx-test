/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import { DiffSectionView, Props } from "src/workflowStatus/representationDiff/diffSectionView/DiffSectionView";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { DiffMetadataEntity } from "src/workflowStatus/representationDiff/_domain/diffMetadataEntity";
import { WorkflowEntity } from "src/workflowStatus/_domain/workflowEntity";
import { JsonDiffEntity } from "src/workflowStatus/_domain/jsonDiffEntity";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;
  background-color: #e9e9ff;

  width: 1000px;
  height: 500px;
`;

function getProps(): Props {
  const diffMetadata = DiffMetadataEntity.createMock({
    left: WorkflowEntity.createMock(),
    right: WorkflowEntity.createMock(),
  });

  return {
    section: diffMetadata.sections[0],
    onBack: () => {},
  };
}

export default {
  regular: (
    <View>
      <DiffSectionView {...getProps()}></DiffSectionView>
    </View>
  ),
  "no left pane": () => {
    const props = getProps();
    return (
      <View>
        <DiffSectionView
          {...props}
          section={{
            name: "No changes",
            diff: new JsonDiffEntity({ left: { a: 1 }, right: { a: 1 }, idGetter: undefined }),
          }}
        />
      </View>
    );
  },
  "many sections": () => {
    const props = getProps();

    const oldCode = {
      main: {
        "all-servers": Object.fromEntries(_.range(10, 50).map((i) => [i.toString(), i.toString()])),
      },
    };

    const newCode = {
      main: {
        "all-servers": Object.fromEntries(_.range(11, 55).map((i) => [i.toString(), i.toString()])),
      },
    };

    props.section = DiffMetadataEntity.createDiffSection(oldCode, newCode, "all-servers");
    return (
      <View>
        <DiffSectionView {...props} />
      </View>
    );
  },
};
