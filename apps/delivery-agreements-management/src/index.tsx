import * as React from "react";
import * as ReactDOM from "react-dom";
import { ProjectFrame } from "@qwilt/common/components/projectFrame/ProjectFrame";
import { DeliveryAgreements } from "./DeliveryAgreements";
import { ProjectUrlParamsMetadata } from "./_stores/projectUrlParams";

ReactDOM.render(
  <ProjectFrame title={"Delivery Agreements"} projectParamsMetadata={ProjectUrlParamsMetadata}>
    <DeliveryAgreements />
  </ProjectFrame>,
  document.getElementById("root") as HTMLElement
);
