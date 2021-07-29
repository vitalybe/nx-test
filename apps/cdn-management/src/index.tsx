import { ProjectFrame } from "@qwilt/common/components/projectFrame/ProjectFrame";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { CdnManagement } from "./CdnManagement";
import { ProjectUrlParamsMetadata } from "./_stores/projectUrlParams";

ReactDOM.render(
  <ProjectFrame title="CDN management" projectParamsMetadata={ProjectUrlParamsMetadata}>
    <CdnManagement />
  </ProjectFrame>,
  document.getElementById("root") as HTMLElement
);
