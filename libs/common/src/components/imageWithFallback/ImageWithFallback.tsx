import React, { MouseEvent } from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { CommonColors } from "../../styling/commonColors";
// @ts-ignore
import ReactImage from "react-image";

const ImageWithFallbackView = styled.div`
  height: 100%;
  display: flex;
  img {
    max-height: 100%;
    max-width: 100%;
  }
`;

export interface Props {
  imagePath: string;
  fallbackElement?: JSX.Element;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  className?: string;
}

const initialState = {};

type State = Readonly<typeof initialState>;

const NoImage = () => (
  <svg height={"100%"} width={"100%"} viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
    <rect x={0} y={0} width={500} height={300} fill={CommonColors.GRAY_4} />
    <text x="50%" y="60%" alignmentBaseline="middle" textAnchor="middle" fontSize={300}>
      ...
    </text>
  </svg>
);

@observer
export class ImageWithFallback extends React.Component<Props, State> {
  static defaultProps: Pick<Props, "fallbackElement"> = { fallbackElement: <NoImage /> };
  readonly state: State = initialState;

  render() {
    const imagePath = this.props.imagePath;

    return (
      <ImageWithFallbackView className={this.props.className} onClick={this.props.onClick}>
        <ReactImage src={imagePath} loader={this.props.fallbackElement} unloader={this.props.fallbackElement} />
      </ImageWithFallbackView>
    );
  }
}
