/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import FixtureDecorator from "../../../../../utils/cosmos/FixtureDecorator";
import { ExportDialog, Props } from "./ExportDialog";
import { forwardRef, Ref } from "react";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 500px;
`;

function getProps(): Props {
  return {
    xlsxExportCallback(): void {},
    closeFn(): void {},
    isPdfPreview: true,
    hasData: true,
  };
}
const ExportPageExample = forwardRef((props, ref: Ref<HTMLDivElement>) => {
  return (
    <div ref={ref} style={{ display: "flex", width: "900px", height: "1400px" }}>
      <span>
        PDF Example <img src={require("../../../../../images/orgs/british-telecom.png")} alt={"img"} />
      </span>
    </div>
  );
});

export default {
  "regular - pdf preview": (
    <View>
      <ExportDialog {...getProps()}>
        <ExportPageExample />
      </ExportDialog>
    </View>
  ),
  "pdf save file": (
    <View>
      <ExportDialog {...getProps()} isPdfPreview={false} isPdfSave={true}>
        <ExportPageExample />
      </ExportDialog>
    </View>
  ),
  "no pdf child": (
    <View>
      <ExportDialog {...getProps()} />
    </View>
  ),
  "no report data": (
    <View>
      <ExportDialog {...getProps()} hasData={false} />
    </View>
  ),
};
