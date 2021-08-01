import { groupByToCollections } from "common/utils/groupByToCollecitons";

describe("groupByToCollecitons", function() {
  it("should group by string key", function() {
    const groups = [
      { group: "a", value: 1 },
      { group: "a", value: 2 },
      { group: "b", value: 2 },
    ];

    const groupedGroups = groupByToCollections(groups, group => group.group);
    expect(groupedGroups).toHaveLength(2);
    const aGroup = groupedGroups.find(group => group.key === "a");
    expect(aGroup!.items).toHaveLength(2);
    const bGroup = groupedGroups.find(group => group.key === "b");
    expect(bGroup!.items).toHaveLength(1);
  });

  it("should group by an object", function() {
    const groupA = { group: "a" };
    const groupB = { group: "b" };

    const groups = [
      { group: groupA, value: 1 },
      { group: groupA, value: 2 },
      { group: groupB, value: 2 },
    ];

    const groupedGroups = groupByToCollections(groups, group => group.group);
    expect(groupedGroups).toHaveLength(2);
    const aGroup = groupedGroups.find(group => group.key === groupA);
    expect(aGroup!.items).toHaveLength(2);
    const bGroup = groupedGroups.find(group => group.key === groupB);
    expect(bGroup!.items).toHaveLength(1);
  });
});
