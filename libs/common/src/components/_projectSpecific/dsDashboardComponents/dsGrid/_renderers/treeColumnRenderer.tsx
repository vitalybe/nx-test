import * as React from "react";
import { Cell } from "common/components/_projectSpecific/dsDashboardComponents/dsGrid/_styles/cell";
import { CommonDsEntity } from "common/components/_projectSpecific/dsDashboardComponents/_domain/commonDsEntity";
import styled from "styled-components";
import { GridReactRenderer } from "common/components/qwiltGrid/QwiltGrid";

const EntityTypeIconImg = styled.img`
  width: 16px;
  height: 16px;
  display: flex;
`;

export function getTreeColumnRenderer(): GridReactRenderer<CommonDsEntity> {
  const getTextContent = (entity: CommonDsEntity) =>
    `${entity.displayName} ${entity.children ? `(${entity.children.length})` : ""}`;

  return new GridReactRenderer<CommonDsEntity>({
    valueGetter: (entity: CommonDsEntity) => getTextContent(entity),
    reactRender: ({ entity, value }) => {
      const { icon, type } = entity;
      return (
        <Cell justify={"flex-start"} fontWeight={600}>
          {icon && <EntityTypeIconImg src={icon} alt={type} />}
          <span>{value}</span>
        </Cell>
      );
    },
  });
}
