import * as React from "react";
import { observer } from "mobx-react";
import { EntityIconModel } from "./entityIconModel";
import { MarketplaceImageWithFallback } from "../marketplaceImageWithFallback/MarketplaceImageWithFallback";

export interface Props {
  model: EntityIconModel;

  className?: string;
}

export type DefaultPropsKeys = never;

const initialState = {};

type State = Readonly<typeof initialState>;

@observer
export class EntityIcon extends React.Component<Props, State> {
  static defaultProps: Pick<Props, DefaultPropsKeys> = {};
  readonly state: State = initialState;

  render() {
    const { model } = this.props;

    let fallbackElement = undefined;
    if (model.fallbackType === "geo") {
      fallbackElement = <img src={require("@qwilt/common/images/no-flag.svg")} alt={"missing location image"} />;
    } else if (model.fallbackType === "isp") {
      fallbackElement = <img src={require("@qwilt/common/images/no-isp.svg")} alt={"missing isp image"} />;
    }

    return (
      <MarketplaceImageWithFallback
        imagePath={model.iconPath || ""}
        fallbackElement={fallbackElement}
        className={this.props.className}
      />
    );
  }
}
