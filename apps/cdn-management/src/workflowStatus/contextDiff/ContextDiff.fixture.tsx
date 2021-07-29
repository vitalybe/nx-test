/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { ContextDiff, Props } from "./ContextDiff";
import FixtureDecorator from "@qwilt/common/utils/cosmos/FixtureDecorator";
import { ContextDiffSegmentEntity } from "./_domain/contextDiffSegmentEntity";
import { WorkflowEntity } from "../_domain/workflowEntity";
import { ContextDiffSegmentsProvider } from "./_providers/contextDiffSegmentsProvider";
import { AjaxMetadata } from "@qwilt/common/utils/ajax";
import { ProvisionFlowsApiMock } from "@qwilt/common/backend/provisionFlows";
import { StepOutputApiResult } from "@qwilt/common/backend/provisionFlows/_types/provisionFlowsTypes";

const fixtureData = require("./ContextDiff.fixture.data.json");

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 800px;
`;

function getProps(): Props {
  return {
    cdnName: "OpenCaching CDN",
    segments: [
      ContextDiffSegmentEntity.createMock(),
      ContextDiffSegmentEntity.createMock(),
      ContextDiffSegmentEntity.createMock({ changeCount: 0 }),
    ],
    left: WorkflowEntity.createMock(),
    right: WorkflowEntity.createMock(),
    workflowControlEvents: {
      onStopWorkflow: () => {},
      onContinueWorkflow: () => {},
    },
    isReviewEnabled: true,
    onClose: () => {},
  };
}

export default {
  regular: (
    <View>
      <ContextDiff {...getProps()}></ContextDiff>
    </View>
  ),
  "view-mode": (
    <View>
      <ContextDiff {...getProps()} isReviewEnabled={false} workflowControlEvents={undefined}></ContextDiff>
    </View>
  ),
  "no changes": (
    <View>
      <ContextDiff
        {...getProps()}
        segments={[
          ContextDiffSegmentEntity.createMock({ changeCount: 0 }),
          ContextDiffSegmentEntity.createMock({ changeCount: 0 }),
          ContextDiffSegmentEntity.createMock({ changeCount: 0 }),
        ]}
      />
    </View>
  ),
  realistic: () => {
    const props = useMemo(() => getProps(), []);
    const [segments, setSegments] = useState<ContextDiffSegmentEntity[]>();

    useEffect(() => {
      const fetchData = async () => {
        const contextDiffSegmentsProviderResult = await ContextDiffSegmentsProvider.instance.provide(
          "1234",
          props.left,
          props.right,
          new AjaxMetadata(),
          new (class extends ProvisionFlowsApiMock {
            async listStepOutput(cdnId: string, workflowId: string): Promise<StepOutputApiResult> {
              if (workflowId === props.left?.id) {
                return fixtureData.differentOutput.left;
              } else if (workflowId === props.right.id) {
                return fixtureData.differentOutput.right;
              }

              throw new Error(`unepxected`);
            }
          })()
        );
        setSegments(contextDiffSegmentsProviderResult.segments);
      };

      fetchData();
    }, [props.left, props.right]);

    return segments ? (
      <View>
        <ContextDiff {...getProps()} segments={segments} />
      </View>
    ) : null;
  },
};
