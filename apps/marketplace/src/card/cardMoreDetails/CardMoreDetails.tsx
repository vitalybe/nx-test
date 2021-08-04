import * as React from "react";
import { observer } from "mobx-react";
import { CardMoreDetailsModel } from "src/card/cardMoreDetails/cardMoreDetailsModel";
import { CardIspLocation } from "src/card/cardIspLocation/CardIspLocation";
import { CardIsp } from "src/card/cardIsp/CardIsp";
import { CardGeo } from "src/card/cardGeo/CardGeo";

export interface Props {
  model: CardMoreDetailsModel;
  onClose: () => void;
  onEntityClick: (id: string) => void;

  className?: string;
}
export type DefaultPropsKeys = never;

const initialState = {};

type State = Readonly<typeof initialState>;

@observer
export class CardMoreDetails extends React.Component<Props, State> {
  static defaultProps: Pick<Props, DefaultPropsKeys> = {};
  readonly state: State = initialState;

  render() {
    const { model } = this.props;

    if (model.moreDetailsIspLocation) {
      return (
        <CardIspLocation
          model={model.moreDetailsIspLocation}
          onClose={this.props.onClose}
          className={this.props.className}
        />
      );
    } else if (model.moreDetailsIsp) {
      return (
        <CardIsp
          model={model.moreDetailsIsp}
          onClose={this.props.onClose}
          onEntityClick={this.props.onEntityClick}
          className={this.props.className}
        />
      );
    } else if (model.moreDetailsGeo) {
      return (
        <CardGeo
          model={model.moreDetailsGeo}
          onClose={this.props.onClose}
          onEntityClick={this.props.onEntityClick}
          className={this.props.className}
        />
      );
    }
  }
}
