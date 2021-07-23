/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import { useRef, useState } from "react";
import styled from "styled-components";
import {
  AffectedEntitiesDropdown,
  Props,
} from "common/components/_projectSpecific/systemUpdatesManagement/systemUpdatesForm/affectedEntitiesDropdown/AffectedEntitiesDropdown";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { EntityTypeEnum } from "common/backend/qnDeployment/_types/entitiesApiType";
import { DeploymentEntityWithChildren } from "common/domain/qwiltDeployment/deploymentEntityWithChildren";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;
  background-color: #e6edf0;

  width: 1000px;
  height: 500px;
`;

function getProps(): Props {
  return {
    affectedIds: [1],
    networksHierarchy: [
      DeploymentEntityWithChildren.createMock({
        name: "Internets Ltd",
        id: 1,
        children: [
          DeploymentEntityWithChildren.createMock({ id: 11, name: "QF82171", type: EntityTypeEnum.QN }),
          DeploymentEntityWithChildren.createMock({ id: 12, name: "QA85171", type: EntityTypeEnum.QN }),
        ],
        type: EntityTypeEnum.NETWORK,
      }),
      DeploymentEntityWithChildren.createMock({
        name: "FastNet",
        type: EntityTypeEnum.NETWORK,
        children: [DeploymentEntityWithChildren.createMock({ name: "NF35171", type: EntityTypeEnum.QN })],
      }),
    ],
    onSelectionChanged: () => {},
  };
}

export default {
  regular: () => {
    const props = getProps();
    const items = useRef(props.networksHierarchy).current;
    const [affectedEntitiesIds, setAffectedEntitiesIds] = useState<number[]>([]);

    return (
      <View>
        <AffectedEntitiesDropdown
          networksHierarchy={items}
          affectedIds={affectedEntitiesIds}
          onSelectionChanged={(affectedIds) => setAffectedEntitiesIds(affectedIds)}
        />
      </View>
    );
  },
  "1 QN selected": () => {
    const props = getProps();
    const items = useRef(props.networksHierarchy).current;
    const [affectedEntitiesIds, setAffectedEntitiesIds] = useState<number[]>([1]);

    return (
      <View>
        <AffectedEntitiesDropdown
          networksHierarchy={items}
          affectedIds={affectedEntitiesIds}
          onSelectionChanged={(affectedIds) => setAffectedEntitiesIds(affectedIds)}
        />
      </View>
    );
  },
};
