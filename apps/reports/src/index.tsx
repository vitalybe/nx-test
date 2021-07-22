import * as React from "react";
import * as ReactDOM from "react-dom";
import { ProjectFrame } from "@qwilt/common";
import { ReportsScreenContainer } from "./reportsScreen/ReportsScreenContainer";
import { ProjectUrlParamsMetadata } from "./_stores/projectUrlParams";

ReactDOM.render(
  <ProjectFrame title={"Reports"} projectParamsMetadata={ProjectUrlParamsMetadata}>
    <ReportsScreenContainer />
  </ProjectFrame>,
  document.getElementById("root") as HTMLElement
);
