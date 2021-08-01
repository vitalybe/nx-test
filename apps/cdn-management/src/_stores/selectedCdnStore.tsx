import * as React from "react";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { CdnEntity } from "../_domain/cdnEntity";
import { ReactNode, useContext } from "react";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

const SelectedCdnContext = React.createContext<CdnEntity | undefined>(undefined);

export function SelectedCdnContextProvider(props: { value: CdnEntity; children: ReactNode }) {
  return <SelectedCdnContext.Provider value={props.value}>{props.children}</SelectedCdnContext.Provider>;
}

export function useSelectedCdn(): CdnEntity {
  const selectedCdn = useContext(SelectedCdnContext);
  if (!selectedCdn) {
    throw new Error(`selected cdn is not defined`);
  }

  return selectedCdn;
}
