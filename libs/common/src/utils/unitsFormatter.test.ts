import { UnitKindEnum, UnitNameEnum, unitsFormatter } from "common/utils/unitsFormatter";

describe("unitsFormatter", function() {
  describe("format", function() {
    it("should format volume correctly", function() {
      const result = unitsFormatter.format(1000, UnitKindEnum.VOLUME);
      expect(result.getPretty()).toBe("1.00");
      expect(result.unit).toBe("KB");
    });

    it("should format volume correctly", function() {
      const result = unitsFormatter.format(1_000_000, UnitKindEnum.VOLUME);
      expect(result.getPretty()).toBe("1.00");
      expect(result.unit).toBe("MB");
    });

    it("should format large bandwidth values", function() {
      const result = unitsFormatter.format(15_000_100, UnitKindEnum.TRAFFIC);
      expect(result.getPretty()).toBe("15.0");
      expect(result.unit).toBe("Mbps");
    });

    it("should format large numeric values", function() {
      const result = unitsFormatter.format(15_000_100, UnitKindEnum.COUNT);
      expect(result.getPretty()).toBe("15.0");
      expect(result.unit).toBe("M");
    });

    it("should handle negative values", function() {
      const result = unitsFormatter.format(-15_000_100, UnitKindEnum.TRAFFIC);
      expect(result.getPretty()).toBe("-15.0");
      expect(result.unit).toBe("Mbps");
    });

    it("should handle zero bandwidth values", function() {
      const result = unitsFormatter.format(0, UnitKindEnum.TRAFFIC);
      expect(result.getPretty()).toBe("0.00");
      expect(result.unit).toBe("bps");
    });

    it("should handle zero number values", function() {
      const result = unitsFormatter.format(0, UnitKindEnum.COUNT);
      expect(result.getPretty()).toBe("0.00");
      expect(result.unit).toBe("");
    });

    it("should handle small number values", function() {
      const result = unitsFormatter.format(10, UnitKindEnum.COUNT);
      expect(result.getPretty()).toBe("10.0");
      expect(result.unit).toBe("");
    });
  });

  describe("convert", function() {
    it("should convert a value", function() {
      const result = unitsFormatter.convert(1_000_000, UnitNameEnum.COUNT_K);
      expect(result.getPretty()).toBe("1000");
      expect(result.unit).toBe(UnitNameEnum.COUNT_K);
    });

    it("should convert to a value with less than 1 result", function() {
      const result = unitsFormatter.convert(500_000, UnitNameEnum.COUNT_MILLION);
      expect(result.getPretty()).toBe("0.50");
      expect(result.unit).toBe(UnitNameEnum.COUNT_MILLION);
    });

    it("should convert negative values", function() {
      const result = unitsFormatter.convert(-500_000, UnitNameEnum.COUNT_MILLION);
      expect(result.getPretty()).toBe("-0.50");
      expect(result.unit).toBe(UnitNameEnum.COUNT_MILLION);
    });

    it("should throw error on unrecognized unit name", function() {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        unitsFormatter.convert(0, "what" as any);
      }).toThrow(Error);
    });
  });
});
