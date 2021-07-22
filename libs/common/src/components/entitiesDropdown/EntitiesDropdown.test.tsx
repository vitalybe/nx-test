import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EntitiesDropdown, Props } from "common/components/entitiesDropdown/EntitiesDropdown";
import { EntitiesDropdownMocks } from "common/components/entitiesDropdown/_util/entitiesDropdownMocks";
import {
  DropdownSelectorRenderer,
  MAXIMUM_SHOWN_ICONS,
} from "common/components/entitiesDropdown/_overrideableParts/dropdownSelectorRenderer/DropdownSelectorRenderer";
import { DropdownEntity } from "common/components/entitiesDropdown/_domain/dropdownEntity";
import { SelectionModeEnum } from "common/utils/hierarchyUtils";

const allItemsSelectedText = "all items selected";

function getDefaultProps(): Props<DropdownEntity> {
  return {
    items: EntitiesDropdownMocks.entitiesList(),
    componentThemeType: "light",
    dropdownSelectorRenderer: <DropdownSelectorRenderer allItemsSelectedText={allItemsSelectedText} />,
    onSelectionChanged: () => null,
    selectionMode: "multipleApplyOnButton",
  };
}
describe("EntitiesDropdown component", function () {
  it("should display all selected title", async () => {
    const defaultProps = getDefaultProps();
    const { getByText } = render(
      <EntitiesDropdown
        {...defaultProps}
        items={EntitiesDropdownMocks.entitiesList(() => ({ selection: SelectionModeEnum.SELECTED }))}
      />
    );
    expect(getByText(allItemsSelectedText)).toBeDefined();
  });

  it("should display no selection title", async () => {
    const { getByText } = render(<EntitiesDropdown {...getDefaultProps()} />);
    expect(getByText("no selection")).toBeDefined();
  });

  it("should display single entity title", async () => {
    const items = EntitiesDropdownMocks.entitiesList((entity, index) => ({
      selection: index === 0 ? SelectionModeEnum.SELECTED : SelectionModeEnum.NOT_SELECTED,
    }));
    const { getByText } = render(<EntitiesDropdown {...getDefaultProps()} items={items} />);
    expect(getByText(items[0].label)).toBeDefined();
  });

  it("should display the singular type in sub title for count of 1", async () => {
    const itemsSingular = EntitiesDropdownMocks.entitiesList((entity, index) => ({
      selection: index === 0 ? SelectionModeEnum.SELECTED : SelectionModeEnum.NOT_SELECTED,
    }));
    const renderSingular = render(
      <EntitiesDropdown {...getDefaultProps()} items={itemsSingular} itemTypePlural={"ISPs"} itemType={"ISP"} />
    );
    expect(renderSingular.getByText("ISP")).toBeDefined();
    expect(renderSingular.getByText("ISP").parentElement?.childElementCount).toBe(2);
    expect([...renderSingular.getByText("ISP").parentElement?.childNodes.entries()!][0][1].textContent).toBe("1");
  });

  it("should display the plural type in sub title for count of more than 1", async () => {
    const itemsPlural = EntitiesDropdownMocks.entitiesList((entity, index) => ({
      selection: index <= 1 ? SelectionModeEnum.SELECTED : SelectionModeEnum.NOT_SELECTED,
    }));
    const renderPlural = render(
      <EntitiesDropdown {...getDefaultProps()} items={itemsPlural} itemTypePlural={"ISPs"} itemType={"ISP"} />
    );
    expect(renderPlural.getByText("ISPs")).toBeDefined();
    expect(renderPlural.getByText("ISPs").parentElement?.childElementCount).toBe(2);
    expect(renderPlural.getByText("ISPs").parentElement?.childElementCount).toBe(2);
    expect([...renderPlural.getByText("ISPs").parentElement?.childNodes.entries()!][0][1].textContent).toBe("2");
  });

  it("should display overflow icons count", async () => {
    const MAX_ICONS_COUNT = MAXIMUM_SHOWN_ICONS;
    const OVERFLOW_COUNT = 2;
    const itemsPlural = EntitiesDropdownMocks.entitiesList((entity, index) => ({
      selection: index < MAX_ICONS_COUNT + OVERFLOW_COUNT ? SelectionModeEnum.SELECTED : SelectionModeEnum.NOT_SELECTED,
    }));
    const renderPlural = render(
      <EntitiesDropdown {...getDefaultProps()} items={itemsPlural} itemTypePlural={"ISPs"} itemType={"ISP"} />
    );
    expect(renderPlural.getByText(`+${OVERFLOW_COUNT}`)).toBeDefined();
  });

  describe("should be able to select item(s)", function () {
    it("in single-select mode", async () => {
      const items = [
        DropdownEntity.createMock({ id: "unique-sp1", label: "SP1" }),
        DropdownEntity.createMock({ id: "unique-sp2", label: "SP2" }),
      ];
      render(<EntitiesDropdown {...getDefaultProps()} selectionMode={"single"} items={items} />);

      const dropdownSelector = within(screen.getByTestId("dropdown-selector"));
      userEvent.click(dropdownSelector.getByText("no selection"));

      const dropdownOptions = within(await screen.findByTestId("dropdown-options"));
      userEvent.click(dropdownOptions.getByText(items[0].label));

      expect(dropdownSelector.getByText(items[0].label)).toBeDefined();
    });

    it("in multi-select mode with apply button", async () => {
      const items = [
        DropdownEntity.createMock({ id: "unique-sp1", label: "SP1" }),
        DropdownEntity.createMock({ id: "unique-sp2", label: "SP2" }),
      ];
      render(<EntitiesDropdown {...getDefaultProps()} selectionMode={"multipleApplyOnButton"} items={items} />);

      const dropdownSelector = within(screen.getByTestId("dropdown-selector"));
      userEvent.click(dropdownSelector.getByText("no selection"));

      const dropdownOptions = within(await screen.findByTestId("dropdown-options"));
      userEvent.click(dropdownOptions.getByText(items[0].label));
      userEvent.click(dropdownOptions.getByText(items[1].label));
      userEvent.click(dropdownOptions.getByText("Apply"));

      expect(dropdownSelector.getByText("all items selected")).toBeDefined();
    });

    it("in multi-select mode without apply button", async () => {
      const items = [
        DropdownEntity.createMock({ id: "unique-sp1", label: "SP1" }),
        DropdownEntity.createMock({ id: "unique-sp2", label: "SP2" }),
      ];
      render(<EntitiesDropdown {...getDefaultProps()} selectionMode={"multipleApplyOnClose"} items={items} />);

      const dropdownSelector = within(screen.getByTestId("dropdown-selector"));
      userEvent.click(dropdownSelector.getByText("no selection"));

      const dropdownOptions = within(await screen.findByTestId("dropdown-options"));
      userEvent.click(dropdownOptions.getByText(items[0].label));
      userEvent.click(dropdownOptions.getByText(items[1].label));
      userEvent.click(screen.getByTestId("dropdown-selector"));

      expect(dropdownSelector.getByText("all items selected")).toBeDefined();
    });

    it("when clicking select all", async function () {
      const items = [
        DropdownEntity.createMock({ id: "unique-sp1", label: "SP1" }),
        DropdownEntity.createMock({ id: "unique-sp2", label: "SP2" }),
      ];
      render(<EntitiesDropdown {...getDefaultProps()} selectionMode={"multipleApplyOnClose"} items={items} />);

      const dropdownSelector = within(screen.getByTestId("dropdown-selector"));
      userEvent.click(dropdownSelector.getByText("no selection"));

      const dropdownOptions = within(await screen.findByTestId("dropdown-options"));
      userEvent.click(dropdownOptions.getByText("Select all"));

      expect(dropdownSelector.getByText("all items selected")).toBeDefined();
    });

    it("when clicking clear all", async function () {
      const items = [
        DropdownEntity.createMock({ id: "unique-sp1", label: "SP1", selection: SelectionModeEnum.SELECTED }),
        DropdownEntity.createMock({ id: "unique-sp2", label: "SP2", selection: SelectionModeEnum.SELECTED }),
      ];
      render(<EntitiesDropdown {...getDefaultProps()} selectionMode={"multipleApplyOnClose"} items={items} />);

      const dropdownSelector = within(screen.getByTestId("dropdown-selector"));
      userEvent.click(dropdownSelector.getByText("all items selected"));

      const dropdownOptions = within(await screen.findByTestId("dropdown-options"));
      userEvent.click(dropdownOptions.getByText("Clear all"));

      expect(dropdownSelector.getByText("no selection")).toBeDefined();
    });
  });
});
