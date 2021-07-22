import * as React from "react";
import * as ReactDOM from "react-dom";
import { ProjectFrame } from "common/index";
import { ReportsScreenContainer } from "src/reportsScreen/ReportsScreenContainer";
import { ProjectUrlParamsMetadata } from "src/_stores/projectUrlParams";

ReactDOM.render(
  <ProjectFrame title={"Reports"} projectParamsMetadata={ProjectUrlParamsMetadata}>
    <ReportsScreenContainer />
  </ProjectFrame>,
  document.getElementById("root") as HTMLElement
);
