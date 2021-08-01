/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import {
  MissingAgreemenentError,
  Props,
} from "src/selectedCdn/tabs/tabDsAssignment/_parts/missingAgreemenentError/MissingAgreemenentError";
import { MissingAgreementLinkEntity } from "src/_domain/missingAgreementLinkEntity";
import { SelectedCdnFixtureDecorator } from "src/selectedCdn/tabs/_utils/SelectedCdnFixtureDecorator";

const View = styled(SelectedCdnFixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 500px;
`;

function getProps(): Props {
  return {
    missingAgreementLink: MissingAgreementLinkEntity.createMock(),
  };
}

export default {
  regular: (
    <View>
      <MissingAgreemenentError {...getProps()}></MissingAgreemenentError>
    </View>
  ),
};
