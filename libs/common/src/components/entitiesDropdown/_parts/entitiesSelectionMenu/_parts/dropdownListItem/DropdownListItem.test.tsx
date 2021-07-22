import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { DropdownListItem } from "common/components/entitiesDropdown/_parts/entitiesSelectionMenu/_parts/dropdownListItem/DropdownListItem";
import { DropdownEntity } from "common/components/entitiesDropdown/_domain/dropdownEntity";

describe("DropdownListItem component", function () {
  it("should display title", async () => {
    const entity = DropdownEntity.createMock({ label: "my special title" });

    const { getByText } = render(<DropdownListItem entity={entity} onSelect={() => null} />);

    expect(getByText("my special title")).toBeDefined();
  });

  it("should show children of a parent when parent expanded", async () => {
    const treeEntity = DropdownEntity.createMock({
      isExpanded: true,
      children: [DropdownEntity.createMock(), DropdownEntity.createMock(), DropdownEntity.createMock()],
    });

    const { container } = render(<DropdownListItem entity={treeEntity} onSelect={() => null} />);

    expect(container.firstChild!.childNodes).toHaveLength(treeEntity.children!.length + 1);

    fireEvent.click(container.querySelector("svg")!);

    expect(container.firstChild!.childNodes).toHaveLength(1);
  });
});
