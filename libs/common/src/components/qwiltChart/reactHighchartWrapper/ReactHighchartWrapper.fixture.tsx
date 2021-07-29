import * as React from "react";
import * as _ from "lodash";
import styled from "styled-components";
import { Props, ReactHighchartWrapper } from "common/components/qwiltChart/reactHighchartWrapper/ReactHighchartWrapper";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

let lastData: number[] | undefined;
let lastProps: Props | undefined;

function createProps(data: number[]): Props {
  if (!lastProps || !_.isEqual(lastData, data)) {
    lastData = data;
    lastProps = {
      chartConfig: {
        plotOptions: {
          series: {
            animation: true,
          },
        },
        series: [
          {
            data: data,
          },
        ],
      },
    };
  }

  return lastProps;
}

const View = styled(FixtureDecorator)`
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  width: 500px;
  height: 200px;
`;

export default {
  "Re-renders only on config change": (
    <View>
      <Container>
        <ReactHighchartWrapper {...createProps([92, 45, 91, 53])} />
      </Container>
    </View>
  ),
};
