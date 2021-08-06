import * as React from "react";
import styled from "styled-components";
import { ImageWithFallback, Props } from "./ImageWithFallback";
import FixtureDecorator from "../../utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)``;

function getProps(): Props {
  return {
    imagePath: "isps/cox.png",
  };
}

export default {
  Regular: (
    <View>
      <div
        style={{
          width: 300,
        }}>
        <ImageWithFallback {...getProps()} />
      </div>
    </View>
  ),
  Broken: (
    <View>
      <div
        style={{
          width: 300,
        }}>
        <ImageWithFallback {...getProps()} imagePath={"fff"} />
      </div>
    </View>
  ),
  Small: (
    <View>
      <div
        style={{
          height: 30,
        }}>
        <ImageWithFallback {...getProps()} />
      </div>
    </View>
  ),
};
