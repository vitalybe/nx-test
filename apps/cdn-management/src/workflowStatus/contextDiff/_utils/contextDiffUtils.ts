import * as _ from "lodash";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { GridValueRenderer } from "@qwilt/common/components/qwiltGrid/QwiltGrid";
import { Colors } from "../../../_styling/colors";
import { ContextDiffBaseEntity } from "../_domain/contextDiffDomainShared";
import { ContextDiffItemEntity } from "../_domain/contextDiffItemEntity";

const moduleLogger = loggerCreator("__filename");

export class ContextDiffUtils {
  static isEntityReviewed(entity: ContextDiffBaseEntity, reviewedIds: Set<string>): boolean {
    const allJsonDiffEntities = this.getEntityLeafItems([entity]).filter(
      item => item instanceof ContextDiffItemEntity && item.hasModifications
    );
    const entityIds = allJsonDiffEntities.map(entity => entity.id);

    return _.difference(entityIds, [...reviewedIds]).length === 0;
  }

  static getEntityLeafItems(entities: ContextDiffBaseEntity[]): ContextDiffBaseEntity[] {
    return entities.flatMap(entity => (entity.content ? this.getEntityLeafItems(entity.content.children) : entity));
  }

  static getGridReviewColumn(reviewedIds: Set<string>) {
    return {
      headerName: "Review Completed?",
      renderer: new GridValueRenderer<ContextDiffBaseEntity>({
        valueGetter: entity =>
          entity.hasModifications ? (ContextDiffUtils.isEntityReviewed(entity, reviewedIds) ? "️✔" : "x") : "",
      }),
      colDefOptions: {
        cellStyle: (row: { data: ContextDiffBaseEntity }) => {
          const entity = row.data;
          return ContextDiffUtils.isEntityReviewed(entity, reviewedIds) ? { color: Colors.GREEN } : undefined;
        },
      },
    };
  }

  static getGridRowStyle(params: { data: ContextDiffBaseEntity }) {
    return params.data.hasModifications
      ? undefined
      : {
          color: "#bbbbbb",
        };
  }

  constructor() {}
}
