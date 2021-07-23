import * as React from "react";
import styled from "styled-components";
import { Props, ProviderDataContainer } from "common/components/providerDataContainer/ProviderDataContainer";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  width: 200px;
`;

const ProviderDataContainerWithSize = styled(ProviderDataContainer)`
  height: 300px;
  background-color: yellow;
  border: 1px solid black;
  padding: 1em;
`;

function getProps(propsOverrides?: Partial<Props>): Props {
  return {
    providerMetadata: {
      isLoading: false,
      isError: false,
      sources: [
        { url: "Source API 1", count: 0, isCached: true },
        { url: "Source API 2", count: 0, isCached: true },
      ],
    },
    children: <div />,
    ...propsOverrides,
  };
}

export default {
  Loading: (
    <View>
      <ProviderDataContainerWithSize
        {...getProps()}
        providerMetadata={{ ...getProps().providerMetadata, isLoading: true }}>
        <>
          <div>Data</div>
        </>
      </ProviderDataContainerWithSize>
    </View>
  ),
  Error: (
    <View>
      <ProviderDataContainerWithSize
        {...getProps()}
        providerMetadata={{ ...getProps().providerMetadata, isError: true }}>
        <>
          <div>Data</div>
        </>
      </ProviderDataContainerWithSize>
    </View>
  ),
  Loaded: (
    <View>
      <ProviderDataContainerWithSize {...getProps()}>
        <>
          <div>Data</div>
          <div>Data</div>
          <div>Data</div>
          <div>Data</div>
        </>
      </ProviderDataContainerWithSize>
    </View>
  ),
};
