import * as _ from "lodash";
import { ContextDiffBaseEntity } from "../_domain/contextDiffDomainShared";
import { ContextDiffEntityTypeEnum } from "../_domain/contextEntityType";
import { ContextDiffPathUtils } from "./contextDiffPathUtils";

function createMockEntity(
  id: string,
  type: ContextDiffEntityTypeEnum,
  name: string,
  children?: ContextDiffBaseEntity[],
  childrenKind?: "known" | "unknown",
  hasModifications?: boolean
): ContextDiffBaseEntity {
  let item: ContextDiffBaseEntity = {
    id: id.toString(),
    name: `${name} ${id}`,
    type: type,
    hasModifications: _.isUndefined(hasModifications) ? true : hasModifications,
  };

  if (children && childrenKind) {
    item = {
      ...item,
      content: {
        children: children,
        kind: childrenKind,
      },
    };
  }

  return item;
}

function createMultipleEntities(
  parentId: string,
  type: ContextDiffEntityTypeEnum,
  name: string,
  amount: number,
  childrenGetter?: (parentId: string) => ContextDiffBaseEntity[],
  hasModifications?: boolean
) {
  return new Array(amount).fill(0).map((_, i) => {
    const id = (parentId ? parentId + "_" : "") + type + "_" + i;
    return createMockEntity(id, type, name, childrenGetter?.(id), "known", hasModifications);
  });
}

describe("ContextDiffPathUtils getNextPath", function() {
  it("should initialize correctly", function() {
    const networks = createMultipleEntities("", ContextDiffEntityTypeEnum.NETWORK, "Network", 3, parentId => [
      ...createMultipleEntities(parentId, ContextDiffEntityTypeEnum.CACHE, "Caches", 3, parentId =>
        createMultipleEntities(parentId, ContextDiffEntityTypeEnum.CACHE, "Cache", 3)
      ),
      ...createMultipleEntities(parentId, ContextDiffEntityTypeEnum.CACHE_GROUP, "Cache Groups", 3, parentId =>
        createMultipleEntities(parentId, ContextDiffEntityTypeEnum.CACHE_GROUP, "Cache Group", 3)
      ),
    ]);

    const result = ContextDiffPathUtils.getNextPath(undefined, networks, []);

    const expectedNetwork = networks[0];
    const expectedCaches = expectedNetwork.content!.children[0];
    expectedCaches.content!.children[0].hasModifications = false;
    const expectedCache = expectedCaches.content!.children[1];
    expect(result).toEqual([expectedNetwork, expectedCaches, expectedCache]);
  });

  it("should go to the next child item", function() {
    const networks = createMultipleEntities("", ContextDiffEntityTypeEnum.NETWORK, "Network", 3, parentId => [
      ...createMultipleEntities(parentId, ContextDiffEntityTypeEnum.CACHE, "Caches", 3, parentId =>
        createMultipleEntities(parentId, ContextDiffEntityTypeEnum.CACHE, "Cache", 3)
      ),
      ...createMultipleEntities(parentId, ContextDiffEntityTypeEnum.CACHE_GROUP, "Cache Groups", 3, parentId =>
        createMultipleEntities(parentId, ContextDiffEntityTypeEnum.CACHE_GROUP, "Cache Group", 3)
      ),
    ]);

    const currentNetwork = networks[0];
    const currentCaches = currentNetwork.content!.children[0];
    const currentCache = currentCaches.content!.children[0];

    const result = ContextDiffPathUtils.getNextPath([currentNetwork, currentCaches, currentCache], networks, []);

    const expectedNetwork = networks[0];
    const expectedCaches = expectedNetwork.content!.children[0];
    const expectedCache = expectedCaches.content!.children[1];
    expect(result).toEqual([expectedNetwork, expectedCaches, expectedCache]);
  });

  it("should go to the next child item but skip modified items", function() {
    const networks = createMultipleEntities("", ContextDiffEntityTypeEnum.NETWORK, "Network", 3, parentId => [
      ...createMultipleEntities(parentId, ContextDiffEntityTypeEnum.CACHE, "Caches", 3, parentId =>
        createMultipleEntities(parentId, ContextDiffEntityTypeEnum.CACHE, "Cache", 3)
      ),
      ...createMultipleEntities(parentId, ContextDiffEntityTypeEnum.CACHE_GROUP, "Cache Groups", 3, parentId =>
        createMultipleEntities(parentId, ContextDiffEntityTypeEnum.CACHE_GROUP, "Cache Group", 3)
      ),
    ]);

    const currentNetwork = networks[0];
    const currentCaches = currentNetwork.content!.children[0];
    const currentCache = currentCaches.content!.children[0];
    currentCaches.content!.children[1].hasModifications = false;

    const result = ContextDiffPathUtils.getNextPath([currentNetwork, currentCaches, currentCache], networks, []);

    const expectedNetwork = networks[0];
    const expectedCaches = expectedNetwork.content!.children[0];
    const expectedCache = expectedCaches.content!.children[2];
    expect(result).toEqual([expectedNetwork, expectedCaches, expectedCache]);
  });

  it("should go, when it is the last child, to to first child of next parent", function() {
    const networks = createMultipleEntities("", ContextDiffEntityTypeEnum.NETWORK, "Network", 3, parentId => [
      ...createMultipleEntities(parentId, ContextDiffEntityTypeEnum.CACHE, "Caches", 3, parentId =>
        createMultipleEntities(parentId, ContextDiffEntityTypeEnum.CACHE, "Cache", 3)
      ),
      ...createMultipleEntities(parentId, ContextDiffEntityTypeEnum.CACHE_GROUP, "Cache Groups", 3, parentId =>
        createMultipleEntities(parentId, ContextDiffEntityTypeEnum.CACHE_GROUP, "Cache Group", 3)
      ),
    ]);

    const currentNetwork = networks[0];
    const currentCaches = currentNetwork.content!.children[0];
    const currentCache = currentCaches.content!.children[2];

    const result = ContextDiffPathUtils.getNextPath([currentNetwork, currentCaches, currentCache], networks, []);

    const expectedNetwork = networks[0];
    const expectedCaches = expectedNetwork.content!.children[1];
    const expectedCache = expectedCaches.content!.children[0];
    expect(result).toEqual([expectedNetwork, expectedCaches, expectedCache]);
  });

  it("should go, when it is the last child and parent, to the next grand-parent", function() {
    const networks = createMultipleEntities("", ContextDiffEntityTypeEnum.NETWORK, "Network", 3, parentId =>
      createMultipleEntities(parentId, ContextDiffEntityTypeEnum.CACHE, "Caches", 3, parentId =>
        createMultipleEntities(parentId, ContextDiffEntityTypeEnum.CACHE, "Cache", 3)
      )
    );

    const currentNetwork = networks[0];
    const currentCaches = currentNetwork.content!.children[2];
    const currentCache = currentCaches.content!.children[2];

    const result = ContextDiffPathUtils.getNextPath([currentNetwork, currentCaches, currentCache], networks, []);

    const expectedNetwork = networks[1];
    const expectedCaches = expectedNetwork.content!.children[0];
    const expectedCache = expectedCaches.content!.children[0];
    expect(result).toEqual([expectedNetwork, expectedCaches, expectedCache]);
  });

  it("should go, when it is the last child and parent and grandparent, to the first grand-parent", function() {
    const networks = createMultipleEntities("", ContextDiffEntityTypeEnum.NETWORK, "Network", 3, parentId =>
      createMultipleEntities(parentId, ContextDiffEntityTypeEnum.CACHE, "Caches", 3, parentId =>
        createMultipleEntities(parentId, ContextDiffEntityTypeEnum.CACHE, "Cache", 3)
      )
    );

    const currentNetwork = networks[2];
    const currentCaches = currentNetwork.content!.children[2];
    const currentCache = currentCaches.content!.children[2];

    const result = ContextDiffPathUtils.getNextPath([currentNetwork, currentCaches, currentCache], networks, []);

    const expectedNetwork = networks[0];
    const expectedCaches = expectedNetwork.content!.children[0];
    const expectedCache = expectedCaches.content!.children[0];
    expect(result).toEqual([expectedNetwork, expectedCaches, expectedCache]);
  });

  describe("should go to the previous child item", function() {
    it("successfully", function() {
      const networks = createMultipleEntities("", ContextDiffEntityTypeEnum.NETWORK, "Network", 3, parentId =>
        createMultipleEntities(parentId, ContextDiffEntityTypeEnum.CACHE, "Caches", 3, parentId =>
          createMultipleEntities(parentId, ContextDiffEntityTypeEnum.CACHE, "Cache", 3)
        )
      );

      const currentNetwork = networks[0];
      const currentCaches = currentNetwork.content!.children[0];
      const currentCache = currentCaches.content!.children[1];

      const result = ContextDiffPathUtils.getPrevPath([currentNetwork, currentCaches, currentCache], networks, []);

      const expectedNetwork = networks[0];
      const expectedCaches = expectedNetwork.content!.children[0];
      const expectedCache = expectedCaches.content!.children[0];
      expect(result).toEqual([expectedNetwork, expectedCaches, expectedCache]);
    });

    it("but skip unmodified items", function() {
      const networks = createMultipleEntities("", ContextDiffEntityTypeEnum.NETWORK, "Network", 3, parentId =>
        createMultipleEntities(parentId, ContextDiffEntityTypeEnum.CACHE, "Caches", 3, parentId =>
          createMultipleEntities(parentId, ContextDiffEntityTypeEnum.CACHE, "Cache", 3)
        )
      );

      const currentNetwork = networks[0];
      const currentCaches = currentNetwork.content!.children[0];
      const currentCache = currentCaches.content!.children[1];
      currentCaches.content!.children[0].hasModifications = false;

      const result = ContextDiffPathUtils.getPrevPath([currentNetwork, currentCaches, currentCache], networks, []);

      const expectedNetwork = networks[2];
      const expectedCaches = expectedNetwork.content!.children[2];
      const expectedCache = expectedCaches.content!.children[2];
      expect(result).toEqual([expectedNetwork, expectedCaches, expectedCache]);
    });

    it("if all the possible items are unmodified", function() {
      const networks = createMultipleEntities(
        "",
        ContextDiffEntityTypeEnum.NETWORK,
        "Network",
        3,
        parentId =>
          createMultipleEntities(
            parentId,
            ContextDiffEntityTypeEnum.CACHE,
            "Caches",
            3,
            parentId => createMultipleEntities(parentId, ContextDiffEntityTypeEnum.CACHE, "Cache", 3, undefined, false),
            false
          ),
        false
      );

      const currentNetwork = networks[0];
      const currentCaches = currentNetwork.content!.children[0];
      const currentCache = currentCaches.content!.children[1];

      const result = ContextDiffPathUtils.getPrevPath([currentNetwork, currentCaches, currentCache], networks, []);

      const expectedNetwork = networks[0];
      const expectedCaches = expectedNetwork.content!.children[0];
      const expectedCache = expectedCaches.content!.children[1];
      expect(result).toEqual([expectedNetwork, expectedCaches, expectedCache]);
    });
  });
});
