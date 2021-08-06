import * as React from "react";
import { observer } from "mobx-react";
import { CardMoreDetailsContainer } from "../_parts/cardMoreDetailsContainer/CardMoreDetailsContainer";
import { CardIspModel } from "./cardIspModel";
import { CardListContainer } from "../_parts/list/cardListContainer/CardListContainer";
import { CardListRow } from "../_parts/list/cardListRow/CardListRow";
import { imageResourcePathProvider } from "../../_providers/imageResourcePathProvider";
import * as _ from "lodash";

export interface Props {
  model: CardIspModel;
  onClose: () => void;
  onEntityClick: (id: string) => void;

  className?: string;
}
export type DefaultPropsKeys = never;

const initialState = {};

type State = Readonly<typeof initialState>;

@observer
export class CardIsp extends React.Component<Props, State> {
  static defaultProps: Pick<Props, DefaultPropsKeys> = {};
  readonly state: State = initialState;

  render() {
    const { model } = this.props;

    return (
      <CardMoreDetailsContainer
        model={model.cardMoreDetailsContainer}
        onClose={this.props.onClose}
        className={this.props.className}>
        <CardListContainer header={"locations"} count={model.ispsInGeo.length}>
          {_.sortBy(model.ispsInGeo, ["id"]).map((entity) => {
            return (
              <CardListRow
                key={entity.id}
                id={entity.id}
                icon={imageResourcePathProvider.provideFlagImageWithFallback(entity)}
                title={entity.name}
                cardTitle={model.entityName}
                parentLocation={entity.parentLocation}
                onClick={this.props.onEntityClick}
              />
            );
          })}
        </CardListContainer>
      </CardMoreDetailsContainer>
    );
  }
}
