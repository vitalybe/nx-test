/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import styled from "styled-components";
import { StatusPartRaw } from "./StatusPartRaw";
import { StepStateEnum } from "../../../_domain/stepEntity";
import { DateTime } from "luxon";
import FixtureStoreDecorator from "../../../_util/FixtureDecorator";
import { ProvisionFlowsStepsEnum } from "@qwilt/common/backend/provisionFlows";

const View = styled(FixtureStoreDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;
  display: inline-block;
`;

const timestamp = DateTime.fromISO("2018-10-08T21:00:00.000+03:00");

export default {
  "In Progress": (
    <View>
      <StatusPartRaw
        step={{
          state: StepStateEnum.IN_PROGRESS,
          stepId: ProvisionFlowsStepsEnum.SNAPSHOT_REPRESENTATION,
          timestamp: timestamp,
          error: undefined,
        }}
        showTextLabel={true}
      />
    </View>
  ),
  "In Progress - No label": (
    <View>
      <StatusPartRaw
        step={{
          state: StepStateEnum.IN_PROGRESS,
          stepId: ProvisionFlowsStepsEnum.SNAPSHOT_REPRESENTATION,
          timestamp: timestamp,
          error: undefined,
        }}
        showTextLabel={false}
      />
    </View>
  ),
  Success: (
    <View>
      <StatusPartRaw
        step={{
          state: StepStateEnum.SUCCESS,
          stepId: ProvisionFlowsStepsEnum.SNAPSHOT_REPRESENTATION,
          timestamp: timestamp,
          error: undefined,
        }}
        showTextLabel={true}
      />
    </View>
  ),
  Paused: (
    <View>
      <StatusPartRaw
        step={{
          state: StepStateEnum.PAUSED,
          stepId: ProvisionFlowsStepsEnum.SNAPSHOT_REPRESENTATION,
          timestamp: timestamp,
          error: undefined,
        }}
        showTextLabel={true}
      />
    </View>
  ),
  "Error - Large message": (
    <View>
      <StatusPartRaw
        step={{
          state: StepStateEnum.ERROR,
          stepId: ProvisionFlowsStepsEnum.SNAPSHOT_REPRESENTATION,
          timestamp: timestamp,
          error:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Non pulvinar neque laoreet suspendisse interdum consectetur. Pretium viverra suspendisse potenti nullam ac tortor. Velit sed ullamcorper morbi tincidunt ornare massa eget egestas purus. Sed ullamcorper morbi tincidunt ornare massa eget. Donec ac odio tempor orci dapibus ultrices in iaculis. Imperdiet nulla malesuada pellentesque elit eget gravida. Consequat interdum varius sit amet mattis vulputate enim. Eros donec ac odio tempor orci dapibus. Nulla at volutpat diam ut venenatis tellus in metus vulputate. Risus commodo viverra maecenas accumsan lacus vel facilisis volutpat est. Amet cursus sit amet dictum sit amet justo. Volutpat consequat mauris nunc congue nisi vitae. Et netus et malesuada fames ac turpis egestas maecenas. Scelerisque varius morbi enim nunc faucibus a pellentesque sit.",
        }}
        showTextLabel={true}
      />
    </View>
  ),
  Stopped: (
    <View>
      <StatusPartRaw
        step={{
          state: StepStateEnum.STOPPED,
          stepId: ProvisionFlowsStepsEnum.SNAPSHOT_REPRESENTATION,
          timestamp: timestamp,
          error: undefined,
        }}
        showTextLabel={true}
      />
    </View>
  ),
  "Same day time format": (
    <View>
      <StatusPartRaw
        step={{
          state: StepStateEnum.SUCCESS,
          stepId: ProvisionFlowsStepsEnum.SNAPSHOT_REPRESENTATION,
          timestamp: DateTime.local().set({ hour: 10, minute: 5 }),
          error: undefined,
        }}
        showTextLabel={true}
      />
    </View>
  ),
};
