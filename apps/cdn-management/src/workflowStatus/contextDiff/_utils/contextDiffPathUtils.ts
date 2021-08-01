import { loggerCreator } from "@qwilt/common/utils/logger";
import { ContextDiffBaseEntity } from "../_domain/contextDiffDomainShared";
import { ContextDiffSegmentEntity } from "../_domain/contextDiffSegmentEntity";

const moduleLogger = loggerCreator("__filename");

export class ContextDiffPathUtils {
  private static addFirstChildren(currentPath: ContextDiffBaseEntity[]) {
    let currentPathCopy = currentPath.slice();

    if (currentPathCopy.length > 0) {
      const lastItem = currentPathCopy[currentPathCopy.length - 1];
      const lastItemChildren = lastItem.content?.children;
      if (lastItemChildren && lastItemChildren.length > 0) {
        currentPathCopy = this.addFirstChildren([...currentPathCopy, lastItemChildren[0]]);
      }
    }

    return currentPathCopy;
  }

  private static getNextPathRaw(currentPath: ContextDiffBaseEntity[], rootItems: ContextDiffBaseEntity[]) {
    if (currentPath.length < 2) {
      throw new Error(`path can't be too short`);
    }

    let fullPathCopy = currentPath.slice();
    const child = fullPathCopy.pop();
    const parent = fullPathCopy[fullPathCopy.length - 1];

    if (!parent.content) {
      throw new Error(`unexpected - parent should always have children`);
    }

    const allChildren = parent.content.children;
    const childIndex = allChildren.findIndex((childInParent) => child === childInParent);
    if (childIndex === -1) {
      throw new Error(`invalid - child wasn't found it parent`);
    }

    // The
    if (childIndex < allChildren.length - 1) {
      fullPathCopy.push(allChildren[childIndex + 1]);
      fullPathCopy = this.addFirstChildren(fullPathCopy);
    } else if (fullPathCopy.length >= 2) {
      fullPathCopy = this.getNextPathRaw(fullPathCopy, rootItems);
    } else {
      const rootItemIndex = rootItems.findIndex((rootItem) => rootItem === parent);
      // We reached the end - No more items to iterate, go back to the beginning
      const nextRootItemIndex = rootItemIndex < rootItems.length - 1 ? rootItemIndex + 1 : 0;
      fullPathCopy = this.addFirstChildren([rootItems[nextRootItemIndex]]);
    }

    return fullPathCopy;
  }

  static getNextPath(
    currentPath: ContextDiffBaseEntity[] | undefined,
    rootItems: ContextDiffBaseEntity[],
    selectedSegmentsIds: string[]
  ) {
    let nextPath: ContextDiffBaseEntity[] | undefined;
    const iteratedItemIds = new Set<string>();
    if (currentPath) {
      iteratedItemIds.add(currentPath[currentPath.length - 1].id);
    }

    if (!rootItems.length) {
      throw new Error(`at least 1 root item is required`);
    }

    if (!currentPath) {
      nextPath = this.addFirstChildren([rootItems[0]]);
    } else {
      nextPath = currentPath;
    }

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const currentLeafItem = nextPath[nextPath.length - 1];
      iteratedItemIds.add(currentLeafItem.id);

      nextPath = this.getNextPathRaw(nextPath, rootItems);
      const nextLeafItem = nextPath[nextPath.length - 1];

      // When segments are selected, we only want to switch between its selected leaf items
      let isSelectedSegment = true;
      if (selectedSegmentsIds.length > 0) {
        isSelectedSegment = !!nextPath.find(
          (item) => item instanceof ContextDiffSegmentEntity && selectedSegmentsIds.includes(item.id)
        );
      }

      if ((isSelectedSegment && nextLeafItem.hasModifications) || iteratedItemIds.has(nextLeafItem.id)) {
        // A complete cycle was completed
        break;
      }
    }

    return nextPath;
  }

  static getPrevPath(
    currentPath: ContextDiffBaseEntity[],
    rootItems: ContextDiffBaseEntity[],
    selectedSegmentsIds: string[]
  ) {
    const allPaths = [currentPath];

    const iteratedItemIds = new Set<string>();
    iteratedItemIds.add(currentPath[currentPath.length - 1].id);

    let nextPath = currentPath;
    do {
      nextPath = this.getNextPath(nextPath, rootItems, selectedSegmentsIds);
      const nextPathLeafItem = nextPath[nextPath.length - 1];
      if (iteratedItemIds.has(nextPathLeafItem.id)) {
        break;
      }

      allPaths.push(nextPath);
      iteratedItemIds.add(nextPathLeafItem.id);
      // eslint-disable-next-line no-constant-condition
    } while (true);

    return allPaths[allPaths.length - 1];
  }

  private constructor() {}
}
