import { IdReplacer } from "./idReplacer";
import { UnknownObject } from "@qwilt/common/utils/typescriptUtils";

describe("IdReplacer should replace IDs", function () {
  it("using string accessors", function () {
    const data = {
      mainObjects: {
        a: { id: "123", name: "a" },
        b: { id: "345", name: "b" },
      },
      objectReferences: [{ objId: "123" }, { objId: "345" }],
    };

    let result: UnknownObject = IdReplacer.replaceIds(data, ["mainObjects", "a"], "id", "name");
    result = IdReplacer.replaceIds(result, ["mainObjects", "b"], "id", "name");

    // Source ID should remain
    expect(result["mainObjects"]["a"]).toMatchObject({ id: "123", name: "a" });
    expect(result["objectReferences"]).toMatchObject([
      { objId_debugFriendyName: "uuid-of-a", objId: "123" },
      { objId_debugFriendyName: "uuid-of-b", objId: "345" },
    ]);
  });

  it("using regex accessors", function () {
    const data = {
      mainObjects: {
        a1: { id: "123", name: "a1" },
        a2: { id: "345", name: "a2" },
      },
      objectReferences: [{ objId: "123" }, { objId: "345" }],
    };

    const result: UnknownObject = IdReplacer.replaceIds(data, ["mainObjects", /a[\d]/], "id", "name");

    // Source ID should remain
    expect(result["mainObjects"]["a1"]).toMatchObject({ id: "123", name: "a1" });
    expect(result["mainObjects"]["a2"]).toMatchObject({ id: "345", name: "a2" });
    expect(result["objectReferences"]).toMatchObject([
      { objId_debugFriendyName: "uuid-of-a1", objId: "123" },
      { objId_debugFriendyName: "uuid-of-a2", objId: "345" },
    ]);
  });

  it("when address target is an array", function () {
    const data = {
      mainObjects: [
        { id: "123", name: "a" },
        { id: "345", name: "b" },
      ],
      objectReferences: [{ objId: "123" }, { objId: "345" }],
    };

    const result: UnknownObject = IdReplacer.replaceIds(data, ["mainObjects"], "id", "name");

    // Source ID should remain
    expect(result["mainObjects"]).toEqual([
      { id: "123", name: "a" },
      { id: "345", name: "b" },
    ]);
    expect(result["objectReferences"]).toMatchObject([
      { objId_debugFriendyName: "uuid-of-a", objId: "123" },
      { objId_debugFriendyName: "uuid-of-b", objId: "345" },
    ]);
  });
});
