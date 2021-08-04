import * as React from "react";
import * as ReactDOM from "react-dom";
import { Marketplace } from "src/Marketplace";
import { MarketplaceModel } from "src/marketplaceModel";
import { MarketplaceStore } from "src/_stores/marketplaceStore";
import { UrlStore } from "common/stores/urlStore/urlStore";
import { ProjectFrame } from "common/components/projectFrame/ProjectFrame";
import { ProjectUrlParamsMetadata } from "./_stores/projectUrlParams";

const urlStore = UrlStore.getInstance();
const marketplaceModel = new MarketplaceModel(new MarketplaceStore(urlStore));

ReactDOM.render(
  <ProjectFrame title={"Marketplace"} showCopyright={false} projectParamsMetadata={ProjectUrlParamsMetadata}>
    <Marketplace model={marketplaceModel} />
  </ProjectFrame>,
  document.getElementById("root") as HTMLElement
);
