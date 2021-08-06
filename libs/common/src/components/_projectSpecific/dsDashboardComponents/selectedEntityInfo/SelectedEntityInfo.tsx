import * as React from "react";
import styled from "styled-components";
import { CommonColors as Colors } from "../../../../styling/commonColors";
import { HierarchyUtils } from "../../../../utils/hierarchyUtils";
import { CommonDsEntity } from "../_domain/commonDsEntity";

const drilldownIcon = require("../../../../images/dsDashboardImages/drill-down-chart.svg");
const closeIcon = require("../../../../images/dsDashboardImages/close-card-large-16-px.svg");

//region [[ Styles ]]

const CloseBtn = styled.button`
  padding: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
  opacity: 0.5;
  transition: 200ms ease-out;
  &:hover {
    opacity: 1;
  }
`;
const ParentNameSpn = styled.button`
  border: none;
  background-color: transparent;
  font-size: 0.75rem;
  margin-right: 4px;
  cursor: pointer;
  padding: 0;
  color: ${Colors.BLUE_WHALE};
  opacity: 0.8;
  transition: 300ms ease-out;
  &:hover {
    opacity: 1;
  }
  &:focus {
    outline: none;
  }
`;
const EntityName = styled.div`
  color: ${Colors.BLUE_WHALE};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  display: flex;
  align-items: center;
  img {
    margin-right: 4px;
  }
`;
const IconImg = styled.img`
  width: 1rem;
  height: 1rem;
`;
const Section = styled.div`
  display: flex;
  align-items: center;
  & > img {
    margin-right: 0.5rem;
  }
`;
const SelectedEntityInfoView = styled.div<{ isHidden?: boolean }>`
  display: flex;
  height: ${(props) => (props.isHidden ? 0 : "2rem")};
  opacity: ${(props) => (props.isHidden ? 0 : 1)};
  align-items: center;
  justify-content: space-between;
  background-color: ${Colors.ICE_BLUE};
  border-radius: 4px;
  padding: 0 0.625rem;
  margin: 0 1.5rem;
  flex: 0 0 auto;
  transition: opacity 900ms, height 300ms ease-in-out, margin-bottom 200ms ease-in-out;
  will-change: transform;
  span {
    font-family: Avenir, sans-serif;
  }
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props<T> {
  isHidden?: boolean;
  selectedEntity: T | undefined;
  setSelectedEntityId: (treeId: string | undefined) => void;
  className?: string;
}

//endregion [[ Props ]]

export function SelectedEntityInfo<T extends CommonDsEntity = CommonDsEntity>({
  selectedEntity,
  setSelectedEntityId,
  isHidden,
  ...props
}: Props<T>) {
  let parents: T[] | undefined;
  if (selectedEntity) {
    parents = HierarchyUtils.getParents(selectedEntity);
  }

  return (
    <SelectedEntityInfoView className={props.className} isHidden={!selectedEntity || isHidden}>
      {selectedEntity && (
        <>
          <Section>
            <IconImg src={drilldownIcon} alt={"drilldown"} />
            {parents?.reverse().map((parent) => (
              <ParentNameSpn onClick={() => setSelectedEntityId(parent.treeId)} key={parent.name}>
                {parent.displayName} /
              </ParentNameSpn>
            ))}
            <EntityName>
              <IconImg src={selectedEntity.icon} alt={selectedEntity.type} /> {selectedEntity?.displayName}
            </EntityName>
          </Section>
          <CloseBtn onClick={() => setSelectedEntityId(undefined)}>
            <IconImg src={closeIcon} alt={"drilldown"} />
          </CloseBtn>
        </>
      )}
    </SelectedEntityInfoView>
  );
}
