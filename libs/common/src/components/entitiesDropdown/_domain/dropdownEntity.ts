import { mockUtils } from "../../../utils/mockUtils";
import { CommonColors } from "../../../styling/commonColors";
import { ReactNode } from "react";
import { Props as RowItemProps, RowItem } from "../_common/rowItem/RowItem";
import { OnlyData } from "../../../utils/typescriptUtils";
import { SelectionModeEnum } from "../../../utils/hierarchyUtils";

export class DropdownEntity {
  id!: string;
  label!: string;
  rowRenderer?: (entity: DropdownEntity) => ReactNode = (entity) => RowItem({ entity });
  selection!: SelectionModeEnum;
  isExpanded?: boolean = true;
  // return icon path based on entity's current attributes (will override icon path)
  iconGetter?: ((selection: SelectionModeEnum) => string) | undefined;
  // static icon path
  iconPath?: string | undefined;
  // custom return value for selecting this item.
  // for example - a select all option that returns all other items as selected
  customSelectionCallback?: (items: DropdownEntity[]) => DropdownEntity[];
  // adding children to an entity will cause it to appear in a tree structure
  children?: DropdownEntity[];
  //used to tag value in addition to all other props
  tag?: string;
  //force to hide the checkbox even on multiple selection mode
  isSingleSelection?: boolean;
  //allow perfect ordering when using grouping (0 - highest rank)
  groupRank?: number;
  constructor(data: OnlyData<DropdownEntity>) {
    Object.assign(this, data);
  }

  icon = () => {
    if (this.iconGetter) {
      return this.iconGetter(this.selection);
    } else {
      return this.iconPath;
    }
  };

  // Mock
  static createMock(
    overrides?: Partial<DropdownEntity>,
    rowRenderProps?: Partial<RowItemProps>,
    id: number = mockUtils.sequentialId()
  ) {
    const colors = [undefined, undefined, undefined, CommonColors.DODGER_BLUE];
    const icons: Array<string | undefined> = [
      require("../../../images/isps/icons/rgnAmerica_cnUsa_nwkCox.png"),
      require("../../../images/isps/icons/rgnAmerica_cnUsa_nwkCharterUber.png"),
      require("../../../images/isps/icons/rgnAmerica_cnUsa_nwkKernValley.png"),
      undefined,
    ];

    const label = overrides?.label;

    return new DropdownEntity({
      id: id.toString(),
      label: label ?? "entity " + id,
      rowRenderer: (entity) => RowItem({ entity, color: colors[id % colors.length], ...rowRenderProps }),
      iconPath: icons[id % icons.length],
      selection: SelectionModeEnum.NOT_SELECTED,
      ...overrides,
    });
  }
}
