import * as React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";

const ClickableImageView = styled.img`
  cursor: pointer;

  transition: 0.2s ease;
  &:hover {
    filter: brightness(90%);
  }

  &:active {
    filter: brightness(70%);
  }
`;

export interface Props {
  imagePath: string;
  onClick: () => void;
  className?: string;
}

const initialState = {};

type State = Readonly<typeof initialState>;

@observer
export class ClickableImage extends React.Component<Props & React.ImgHTMLAttributes<HTMLImageElement>, State> {
  static defaultProps = {};
  readonly state: State = initialState;

  render() {
    const { className, imagePath, ...otherProps } = this.props;

    return <ClickableImageView className={className} src={imagePath} {...otherProps} />;
  }
}
