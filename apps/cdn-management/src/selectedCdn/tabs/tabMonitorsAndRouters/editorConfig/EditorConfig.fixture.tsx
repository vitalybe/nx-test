import * as React from "react";

import styled from "styled-components";
import { EditorConfig, Props } from "./EditorConfig";
import { SelectedCdnFixtureDecorator } from "../../_utils/SelectedCdnFixtureDecorator";
import { CdnEntity } from "../../../../_domain/cdnEntity";

const View = styled(SelectedCdnFixtureDecorator)`
  margin: 1em;
  width: 400px;
  border: 3px dashed lightgrey;
`;

function getProps(propsOverrides?: Partial<Props>): Props {
  return {
    onClose: () => {},
    mode: "routers",
    cdn: CdnEntity.createMock(),
    config: { a: 1 },
    ...propsOverrides,
  };
}

export default {
  Regular: (
    <View>
      <EditorConfig {...getProps()} />
    </View>
  ),
};
