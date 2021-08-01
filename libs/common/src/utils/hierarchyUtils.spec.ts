import { HierarchyUtils, SelectableHierarchyEntity, SelectionModeEnum } from "./hierarchyUtils";

function getItems(): SelectableHierarchyEntity[] {
  return [
    {
      id: "A1",
      selection: SelectionModeEnum.NOT_SELECTED,
      children: [
        { id: "B1", selection: SelectionModeEnum.NOT_SELECTED },
        {
          id: "B2",
          selection: SelectionModeEnum.NOT_SELECTED,

          children: [
            { id: "C1", selection: SelectionModeEnum.NOT_SELECTED },
            { id: "C2", selection: SelectionModeEnum.NOT_SELECTED },
            { id: "C3", selection: SelectionModeEnum.NOT_SELECTED },
          ],
        },
        { id: "B3", selection: SelectionModeEnum.NOT_SELECTED },
      ],
    },
    { id: "A2", selection: SelectionModeEnum.NOT_SELECTED },
    { id: "A3", selection: SelectionModeEnum.NOT_SELECTED },
  ];
}

function getById(items: SelectableHierarchyEntity[], id: string) {
  const item = HierarchyUtils.flatEntitiesHierarchy(items).find(item => item.id === id);
  if (!item) {
    throw new Error(`not found`);
  }

  return item;
}

describe("hierarchyUtils", function() {
  describe("toggleSelectionMutate", function() {
    it("should toggle root item correctly", function() {
      const items = getItems();
      HierarchyUtils.toggleSelectionMutate(items, "A1", true);
      const A1 = getById(items, "A1");
      expect(A1.selection).toBe(SelectionModeEnum.SELECTED);
      const a1Children = HierarchyUtils.getChildren(A1);
      expect(a1Children.every(child => child.selection === SelectionModeEnum.SELECTED)).toBe(true);
    });

    it("should toggle item with parents and children correctly", function() {
      const items = getItems();
      HierarchyUtils.toggleSelectionMutate(items, "B2", true);
      const parent = getById(items, "A1");
      expect(parent.selection).toBe(SelectionModeEnum.PARTIAL);

      const sibling = getById(items, "B1");
      expect(sibling.selection).toBe(SelectionModeEnum.NOT_SELECTED);

      const children = HierarchyUtils.getChildren(getById(items, "B2"));
      expect(children.every(child => child.selection === SelectionModeEnum.SELECTED)).toBe(true);
    });

    it("should toggle back and forth correctly", function() {
      const items = getItems();
      HierarchyUtils.toggleSelectionMutate(items, "B2", true);
      HierarchyUtils.toggleSelectionMutate(items, "B2", false);

      const parent = getById(items, "A1");
      expect(parent.selection).toBe(SelectionModeEnum.NOT_SELECTED);

      const sibling = getById(items, "B1");
      expect(sibling.selection).toBe(SelectionModeEnum.NOT_SELECTED);

      const children = HierarchyUtils.getChildren(getById(items, "B2"));
      expect(children.every(child => child.selection === SelectionModeEnum.NOT_SELECTED)).toBe(true);
    });

    it("should toggle mark parent as selected if all its children are selected", function() {
      const items = getItems();
      HierarchyUtils.toggleSelectionMutate(items, "B1", true);
      HierarchyUtils.toggleSelectionMutate(items, "B2", true);
      HierarchyUtils.toggleSelectionMutate(items, "B3", true);

      const parent = getById(items, "A1");
      expect(parent.selection).toBe(SelectionModeEnum.SELECTED);

      const children = HierarchyUtils.getChildren(getById(items, "A1"));
      expect(children.every(child => child.selection === SelectionModeEnum.SELECTED)).toBe(true);
    });
  });

  describe("getTopSelectedEntities", function() {
    it("should return only the selected parents", function() {
      const items = [
        {
          id: "A",
          selection: SelectionModeEnum.NOT_SELECTED,

          children: [
            { id: "A1", selection: SelectionModeEnum.SELECTED },
            {
              id: "A2",
              selection: SelectionModeEnum.SELECTED,

              children: [
                { id: "A21", selection: SelectionModeEnum.SELECTED },
                { id: "A22", selection: SelectionModeEnum.SELECTED },
              ],
            },
          ],
        },
        {
          id: "B",
          selection: SelectionModeEnum.NOT_SELECTED,

          children: [
            { id: "B1", selection: SelectionModeEnum.NOT_SELECTED },
            { id: "B2", selection: SelectionModeEnum.NOT_SELECTED },
          ],
        },
        { id: "C", selection: SelectionModeEnum.SELECTED },
      ];
      const topSelected = HierarchyUtils.getTopSelectedEntities(items);

      // Selected item without children
      expect(topSelected.find(item => item.id === "A1")).toBeDefined();
      // Parent with all selected children
      expect(topSelected.find(item => item.id === "A2")).toBeDefined();
      // Select root item without children
      expect(topSelected.find(item => item.id === "C")).toBeDefined();
      // There should be nothing else
      expect(topSelected.length).toBe(3);
    });
  });
});
