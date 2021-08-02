function groupBy<T, O>(list: T[], keyGetter: (item: T) => O) {
  const map = new Map();
  list.forEach(item => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

export function groupByToCollections<T, O>(items: T[], keyGetter: (item: T) => O): { key: O; items: T[] }[] {
  const groupedItems = groupBy(items, keyGetter);
  return [...groupedItems.entries()].map(([key, items]) => ({ items: items, key: key }));
}
