import {
  SelectedItemsData,
  useSelectedItems,
} from "common/components/entitiesDropdown/_parts/entitiesSelectionMenu/_hooks/useSelectedItems";
import { EntitiesDropdownMocks } from "common/components/entitiesDropdown/_util/entitiesDropdownMocks";
import { act, renderHook as renderHookLib } from "@testing-library/react-hooks";
import { DropdownEntity } from "common/components/entitiesDropdown/_domain/dropdownEntity";
import { SelectionModeEnum } from "common/utils/hierarchyUtils";

interface HookParams {
  originalItems: DropdownEntity[];
}
function getDefaultProps(originalItems?: DropdownEntity[]): HookParams {
  return {
    originalItems: originalItems || EntitiesDropdownMocks.entitiesList(),
  };
}

function renderHook(originalItems?: DropdownEntity[]) {
  return renderHookLib<HookParams, SelectedItemsData>(
    ({ originalItems }) => {
      return useSelectedItems(originalItems);
    },
    { initialProps: getDefaultProps(originalItems) }
  );
}

describe("useSelectedItems hook", function() {
  describe("general functionality", function() {
    it("should sort entities by selection", function() {
      const { result } = renderHook([
        DropdownEntity.createMock({
          id: "partial-selected",
          selection: SelectionModeEnum.PARTIAL,
        }),
        DropdownEntity.createMock({
          id: "non-selected",
        }),
        DropdownEntity.createMock({
          id: "selected",
          selection: SelectionModeEnum.SELECTED,
        }),
      ]);
      // selected > partial selected > not selected
      expect(result.current.rootItems[0].id).toBe("selected");
      expect(result.current.rootItems[1].id).toBe("partial-selected");
      expect(result.current.rootItems[2].id).toBe("non-selected");
    });
  });

  describe("multi selection", function() {
    it("should select entities by id", function() {
      const { result } = renderHook();

      act(() => {
        result.current.toggleItem(result.current.rootItems[0].id, true);
      });

      act(() => {
        result.current.toggleItem(result.current.rootItems[1].id, true);
      });

      expect(result.current.rootItems[0].selection).toBe(SelectionModeEnum.SELECTED);
      expect(result.current.rootItems[1].selection).toBe(SelectionModeEnum.SELECTED);
    });

    it("should clear all entities selection", function() {
      const { result } = renderHook();

      act(() => {
        result.current.toggleItem(result.current.rootItems[0].id, true);
      });

      act(() => {
        result.current.toggleItem(result.current.rootItems[1].id, true);
      });

      expect(result.current.rootItems[0].selection).toBe(SelectionModeEnum.SELECTED);
      expect(result.current.rootItems[1].selection).toBe(SelectionModeEnum.SELECTED);
    });
  });

  describe("tree structure", function() {
    it("should recursively select all children", function() {
      const { result } = renderHook(EntitiesDropdownMocks.treeList());

      act(() => {
        result.current.toggleAllItems(true);
      });

      expect(result.current.leafItems).toHaveLength(result.current.selectedLeafItems.length);
    });

    it("should recursively select children of selected parent", function() {
      const { result } = renderHook([
        DropdownEntity.createMock({
          children: [
            DropdownEntity.createMock(),
            DropdownEntity.createMock({
              children: [
                DropdownEntity.createMock(),
                DropdownEntity.createMock(),
                DropdownEntity.createMock(),
                DropdownEntity.createMock(),
              ],
            }),
          ],
        }),
      ]);

      expect(result.current.rootItems).toHaveLength(1);
      expect(result.current.rootItems[0].selection).toBe(SelectionModeEnum.NOT_SELECTED);
      expect(result.current.rootItems[0].children).toHaveLength(2);
      expect(result.current.rootItems[0].children![1].children).toHaveLength(4);
      expect(result.current.selectedLeafItems).toHaveLength(0);

      act(() => {
        result.current.toggleItem(result.current.rootItems[0].id, true);
      });

      expect(result.current.rootItems[0].selection).toBe(SelectionModeEnum.SELECTED);
      expect(result.current.selectedLeafItems).toHaveLength(5);
    });

    it("should include only searched children of search containing parents", function() {
      const { result } = renderHook([
        DropdownEntity.createMock({
          children: [DropdownEntity.createMock({ label: "search-me" }), DropdownEntity.createMock()],
        }),
      ]);

      act(() => {
        result.current.setSearchInput("search-me");
      });

      expect(result.current.searchedItems).toHaveLength(1);
      expect(result.current.searchedItems[0].children).toHaveLength(1);
    });
  });

  describe("searchable", function() {
    it("should return searched items", async () => {
      const { result } = renderHook();

      act(() => {
        result.current.setSearchInput("mediacom");
      });

      expect(result.current.searchedItems).toHaveLength(1);
    });
  });
});
