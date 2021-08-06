import * as React from "react";
import { observer } from "mobx-react";
import { CardIspLocationModel } from "./cardIspLocationModel";
import { CardMoreDetailsContainer } from "../_parts/cardMoreDetailsContainer/CardMoreDetailsContainer";
import { CardHistogram } from "./_parts/cardHistogram/CardHistogram";

export interface Props {
  model: CardIspLocationModel;
  onClose: () => void;

  className?: string;
}
export type DefaultPropsKeys = never;

const initialState = {};

type State = Readonly<typeof initialState>;

@observer
export class CardIspLocation extends React.Component<Props, State> {
  static defaultProps: Pick<Props, DefaultPropsKeys> = {};
  readonly state: State = initialState;

  render() {
    const { model } = this.props;

    return (
      <CardMoreDetailsContainer
        model={model.cardMoreDetailsContainer}
        onClose={this.props.onClose}
        className={this.props.className}>
        <CardHistogram qoeValues={model.qoeValues} hasError={model.status.hasError} />
      </CardMoreDetailsContainer>
    );
  }
}
