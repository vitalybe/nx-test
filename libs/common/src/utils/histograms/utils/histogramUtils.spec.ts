import { HistogramUtils } from "./histogramUtils";

describe("histogramUtils", function() {
  describe("groupAdjacentPoints", function() {
    it("should group correctly", function() {
      const groups = HistogramUtils.groupAdjacentPoints([
        { index: 1, x: 0, y: 0 },
        { index: 2, x: 0, y: 0 },
        { index: 5, x: 0, y: 0 },
        { index: 6, x: 0, y: 0 },
      ]);

      expect(groups).toHaveLength(2);
      expect(groups[0].map(point => point.index)).toEqual([1, 2]);
      expect(groups[1].map(point => point.index)).toEqual([5, 6]);
    });

    it("should group correctly when a group has only 1 point", function() {
      const groups = HistogramUtils.groupAdjacentPoints([
        { index: 1, x: 0, y: 0 },
        { index: 5, x: 0, y: 0 },
        { index: 6, x: 0, y: 0 },
      ]);

      expect(groups).toHaveLength(2);
      expect(groups[0].map(point => point.index)).toEqual([1]);
      expect(groups[1].map(point => point.index)).toEqual([5, 6]);
    });
  });
});
