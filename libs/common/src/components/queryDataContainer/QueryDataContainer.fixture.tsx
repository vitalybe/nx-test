/* eslint-disable unused-imports/no-unused-vars */
import * as React from "react";
import styled from "styled-components";
import { QueryDataContainer } from "common/components/queryDataContainer/QueryDataContainer";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { useQuery } from "react-query";
import { mockUtils } from "common/utils/mockUtils";
import { sleep } from "common/utils/sleep";

const View = styled(FixtureDecorator)`
  margin: 1em;
  width: 200px;
`;

const QueryDataContainerWithSize = styled(QueryDataContainer)`
  height: 300px;
  background-color: yellow;
  border: 1px solid black;
  padding: 1em;
`;

export default {
  Loading: () => {
    const query = useQuery(mockUtils.sequentialId().toString(), async () => {
      await sleep(100000000000);
    });

    return (
      <View>
        <QueryDataContainerWithSize queryMetadata={query}>{(data) => <div>Data</div>}</QueryDataContainerWithSize>
      </View>
    );
  },
  Error: () => {
    const query = useQuery(mockUtils.sequentialId().toString(), async () => {
      throw new Error(`uh oh`);
    });

    return (
      <View>
        <QueryDataContainerWithSize queryMetadata={query}>{(data) => <div>Data</div>}</QueryDataContainerWithSize>
      </View>
    );
  },
  Loaded: () => {
    const query = useQuery(mockUtils.sequentialId().toString(), async () => {});

    return (
      <View>
        <QueryDataContainerWithSize queryMetadata={query}>{(data) => <div>Data</div>}</QueryDataContainerWithSize>
      </View>
    );
  },
};
