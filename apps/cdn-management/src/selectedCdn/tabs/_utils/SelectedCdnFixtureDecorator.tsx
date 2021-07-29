import * as React from "react";
import { SelectedCdnContextProvider } from "src/_stores/selectedCdnStore";
import { CdnEntity } from "src/_domain/cdnEntity";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { TabRouterTabStoreContextProvider } from "common/components/tabRouter/_stores/tabRouterTabStore";

export interface Props {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
}

//endregion [[ Props ]]

const cdn = CdnEntity.createMock();

export const SelectedCdnFixtureDecorator = (props: Props) => {
  return (
    <SelectedCdnContextProvider value={cdn}>
      <TabRouterTabStoreContextProvider store={{ isSelected: true }}>
        <FixtureDecorator className={props.className}>{props.children}</FixtureDecorator>
      </TabRouterTabStoreContextProvider>
    </SelectedCdnContextProvider>
  );
};
