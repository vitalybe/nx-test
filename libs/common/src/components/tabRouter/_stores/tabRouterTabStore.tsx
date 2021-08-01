import * as React from "react";
import { loggerCreator } from "common/utils/logger";
import { ReactNode, useContext } from "react";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator(__filename);

const TabRouterTabStoreContext = React.createContext<TabRouterTabStore | undefined>(undefined);

export class TabRouterTabStore {
  constructor(public isSelected: boolean) {}
}

export function TabRouterTabStoreContextProvider(props: { store: TabRouterTabStore; children: ReactNode }) {
  return <TabRouterTabStoreContext.Provider value={props.store}>{props.children}</TabRouterTabStoreContext.Provider>;
}

export function useTabRouterTabStore(): TabRouterTabStore {
  const store = useContext(TabRouterTabStoreContext);
  if (!store) {
    throw new Error(`no store defined`);
  }

  return store;
}
