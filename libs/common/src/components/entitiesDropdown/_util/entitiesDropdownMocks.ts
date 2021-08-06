import { DropdownEntity } from "../_domain/dropdownEntity";
import { SelectionModeEnum } from "../../../utils/hierarchyUtils";

type TransformFunction = (entity: DropdownEntity, index: number, array: DropdownEntity[]) => Partial<DropdownEntity>;

function doTransform(list: DropdownEntity[], transformFn: TransformFunction) {
  return list.map((entity, ...args) => {
    return new DropdownEntity({
      ...entity,
      ...transformFn(entity, ...args),
    });
  });
}

export class EntitiesDropdownMocks {
  static entitiesList(transformFn?: TransformFunction) {
    const list = [
      DropdownEntity.createMock({ id: "unique-mediacom", label: "Mediacom" }),
      DropdownEntity.createMock({ label: "PTCL" }),
      DropdownEntity.createMock(),
      DropdownEntity.createMock(),
      DropdownEntity.createMock(),
      DropdownEntity.createMock(),
      DropdownEntity.createMock(),
      DropdownEntity.createMock(),
    ];

    return transformFn ? doTransform(list, transformFn) : list;
  }

  static treeList(transformFn?: TransformFunction) {
    const list = [
      DropdownEntity.createMock({
        id: "parent-entity",
        selection: SelectionModeEnum.PARTIAL,
        children: [
          DropdownEntity.createMock({ selection: SelectionModeEnum.SELECTED }),
          DropdownEntity.createMock({ selection: SelectionModeEnum.NOT_SELECTED }),
        ],
      }),
      DropdownEntity.createMock({
        selection: SelectionModeEnum.SELECTED,
        children: [
          DropdownEntity.createMock({
            selection: SelectionModeEnum.SELECTED,
            children: [DropdownEntity.createMock({ selection: SelectionModeEnum.SELECTED })],
          }),
        ],
      }),
    ];
    return transformFn ? doTransform(list, transformFn) : list;
  }
}
