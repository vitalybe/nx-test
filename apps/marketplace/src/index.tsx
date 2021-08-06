import * as React from "react";
import * as ReactDOM from "react-dom";
import { Marketplace } from "./Marketplace";
import { MarketplaceModel } from "./marketplaceModel";
import { MarketplaceStore } from "./_stores/marketplaceStore";
import { UrlStore } from "@qwilt/common/stores/urlStore/urlStore";
import { ProjectFrame } from "@qwilt/common/components/projectFrame/ProjectFrame";
import { ProjectUrlParamsMetadata } from "./_stores/projectUrlParams";

const urlStore = UrlStore.getInstance();
const marketplaceModel = new MarketplaceModel(new MarketplaceStore(urlStore));

ReactDOM.render(
  <ProjectFrame title={"Marketplace"} showCopyright={false} projectParamsMetadata={ProjectUrlParamsMetadata}>
    <Marketplace model={marketplaceModel} />
  </ProjectFrame>,
  document.getElementById("root") as HTMLElement
);
