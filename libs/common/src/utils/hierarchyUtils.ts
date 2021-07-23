import { Utils } from "./utils";

export enum SelectionModeEnum {
  SELECTED = "SELECTED",
  PARTIAL = "PARTIAL",
  NOT_SELECTED = "NOT_SELECTED",
}

export interface HierarchyEntity {
  children?: HierarchyEntity[];
  parent?: HierarchyEntity;
}

export interface SelectableHierarchyEntity {
  id: string;
  selection: SelectionModeEnum;

  children?: SelectableHierarchyEntity[];
}

export class HierarchyUtils {
  static flatEntitiesHierarchy<T extends HierarchyEntity>(items: T[], list: T[] = []) {
    for (const item of items) {
      list.push(item);
      if (item.children !== undefined && item.children.length > 0) {
        this.flatEntitiesHierarchy(item.children, list);
      }
    }
    return list;
  }

  static countLeafEntities<T extends HierarchyEntity>(list: T[], count = 0) {
    for (const { children } of list) {
      if (children && children.length > 0) {
        count += this.countLeafEntities(children);
      } else {
        count += 1;
      }
    }
    return count;
  }

  static getLeafEntities<T extends HierarchyEntity>(
    entities: T[],
    filterCallback?: (entity: T) => boolean,
    list: T[] = []
  ) {
    for (const entity of entities) {
      if (entity.children) {
        HierarchyUtils.getLeafEntities(entity.children as T[], filterCallback, list);
      } else {
        if (filterCallback) {
          if (filterCallback(entity)) {
            list.push(entity);
          }
        } else {
          list.push(entity);
        }
      }
    }

    return list;
  }

  static countEntities<T extends HierarchyEntity>(list: T[], filterCallback?: (entity: T) => boolean, count = 0) {
    for (const entity of list) {
      const children = entity?.children as T[];
      if (children && children.length > 0) {
        count += this.countEntities(children, filterCallback);
      }

      if (filterCallback) {
        count += filterCallback(entity) ? 1 : 0;
      } else {
        count += 1;
      }
    }

    return count;
  }

  static getParents<T extends HierarchyEntity>(entity: T, list: T[] = []): T[] {
    if (entity.parent) {
      list.push(entity.parent as T);
      HierarchyUtils.getParents(entity.parent, list);
    }
    return list;
  }

  static getRootParent<T extends HierarchyEntity>(entity: T): T {
    if (entity.parent) {
      return HierarchyUtils.getRootParent(entity.parent as T);
    }

    return entity;
  }

  static getChildren<T extends HierarchyEntity>(
    entity: T,
    filterCallback?: (entity: T) => boolean,
    list: T[] = []
  ): T[] {
    if (entity.children) {
      for (const child of entity.children) {
        if (!filterCallback || filterCallback(child as T)) {
          list.push(child as T);
        }
        HierarchyUtils.getChildren(child as T, filterCallback, list);
      }
    }
    return list;
  }

  static findParent<T extends HierarchyEntity>(entity: T, filterCallback: (entity: T) => boolean): T | undefined {
    // returns the first parent that returns true, including the entity itself
    if (filterCallback(entity as T)) {
      return entity;
    } else if (entity.parent) {
      return this.findParent(entity.parent as T, filterCallback);
    }
  }

  static someEntities<T extends HierarchyEntity>(
    list: T[],
    filterCallback: (entity: T) => boolean,
    foundSome = false
  ): boolean {
    for (let i = 0; i < list.length && !foundSome; i++) {
      const entity = list[i];
      foundSome = filterCallback(entity);
      if (!foundSome && entity?.children && entity.children.length > 0) {
        foundSome = this.someEntities(entity.children as T[], filterCallback);
      }
    }

    return foundSome;
  }

  static toggleSelectionMutate(rootItems: SelectableHierarchyEntity[], id: string, newSelection: boolean) {
    for (const item of rootItems) {
      this.updateSelectionRecursive(item, id, newSelection);
    }
  }

  // returns parent items if all their children are selected, returns selected children oterhwise, e.g:
  // A
  //    Child A1
  //    Child A2 (Selected)
  // B (Selected)
  //    Child B1 (Selected)
  //    Child B2 (Selected)
  // Would return [A2, B]
  static getTopSelectedEntities(rootItems: SelectableHierarchyEntity[]): SelectableHierarchyEntity[] {
    return rootItems
      .flatMap(item => {
        if (item.selection === SelectionModeEnum.SELECTED) {
          return item;
        } else if (item.children?.length) {
          return this.getTopSelectedEntities(item.children);
        }
      })
      .filter(Utils.isTruthy);
  }

  private static updateSelectionRecursive(item: SelectableHierarchyEntity, selectedId: string, newIsSelected: boolean) {
    //when toggling a specific item, we recursively search for it

    let newSelectionMode = item.selection;
    if (item.id === selectedId) {
      //if id is matching - that is the toggled entity. we toggle it and update descendants to new state.
      newSelectionMode = newIsSelected ? SelectionModeEnum.SELECTED : SelectionModeEnum.NOT_SELECTED;
      this.setChildrenSelectedRecursive(item, newIsSelected);
    } else if (item.children && item.children.length > 0) {
      // updating children selection
      item.children.forEach(child => this.updateSelectionRecursive(child, selectedId, newIsSelected));
      // selection state based on children state
      const areAllChildrenSelected = item.children.every(child => child.selection === SelectionModeEnum.SELECTED);
      const isChildSelected = item.children.some(child => child.selection !== SelectionModeEnum.NOT_SELECTED);

      if (areAllChildrenSelected) {
        newSelectionMode = SelectionModeEnum.SELECTED;
      } else if (isChildSelected) {
        newSelectionMode = SelectionModeEnum.PARTIAL;
      } else {
        newSelectionMode = SelectionModeEnum.NOT_SELECTED;
      }
    }

    item.selection = newSelectionMode;
  }

  private static setChildrenSelectedRecursive(item: SelectableHierarchyEntity, isSelected: boolean) {
    //recursively setting selected state to all descendants of entity
    if (item.children && item.children.length > 0) {
      item.children.forEach(child => {
        this.setChildrenSelectedRecursive(child, isSelected);
        child.selection = isSelected ? SelectionModeEnum.SELECTED : SelectionModeEnum.NOT_SELECTED;
      });
    }
  }
}
