import { useEffect, useState } from "react";
import {
  CommonDsEntity,
  DsEntityType,
} from "common/components/_projectSpecific/dsDashboardComponents/_domain/commonDsEntity";

interface Options {
  selectedEntity: CommonDsEntity | undefined;
  hoveredEntity: CommonDsEntity | undefined;
  disabled?: boolean;
}
export function useBarChartSelection({ selectedEntity, hoveredEntity, disabled }: Options) {
  const [barChartHighlightedIds, setBarChartHighlightedIds] = useState<string[]>([]);
  const [barChartDrilldownId, setBarChartDrilldownId] = useState<string>();

  useEffect(() => {
    if (!disabled) {
      if (!selectedEntity && hoveredEntity) {
        if (hoveredEntity.type === DsEntityType.DSG && hoveredEntity.children) {
          setBarChartHighlightedIds(hoveredEntity.children.map(child => child.treeId));
        } else {
          setBarChartHighlightedIds([hoveredEntity.treeId]);
        }
      } else {
        setBarChartHighlightedIds([]);
      }
      setBarChartDrilldownId(selectedEntity?.treeId);
    }
  }, [selectedEntity, hoveredEntity, disabled]);

  return { barChartHighlightedIds, barChartDrilldownId };
}
