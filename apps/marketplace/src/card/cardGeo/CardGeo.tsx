import * as React from "react";
import { observer } from "mobx-react";
import { CardMoreDetailsContainer } from "src/card/_parts/cardMoreDetailsContainer/CardMoreDetailsContainer";
import { CardListContainer } from "src/card/_parts/list/cardListContainer/CardListContainer";
import { CardListRow } from "src/card/_parts/list/cardListRow/CardListRow";
import { imageResourcePathProvider } from "src/_providers/imageResourcePathProvider";
import { CardGeoModel } from "src/card/cardGeo/cardGeoModel";
import * as _ from "lodash";

export interface Props {
  model: CardGeoModel;
  onClose: () => void;
  onEntityClick: (id: string) => void;

  className?: string;
}
export type DefaultPropsKeys = never;

const initialState = {};

type State = Readonly<typeof initialState>;

@observer
export class CardGeo extends React.Component<Props, State> {
  static defaultProps: Pick<Props, DefaultPropsKeys> = {};
  readonly state: State = initialState;

  render() {
    const { model } = this.props;

    return (
      <CardMoreDetailsContainer
        model={model.cardMoreDetailsContainer}
        onClose={this.props.onClose}
        className={this.props.className}>
        <CardListContainer header={"isps"} count={model.ispsInGeo.length}>
          {_.sortBy(model.ispsInGeo, ["id"]).map((entity) => (
            <CardListRow
              key={entity.id}
              id={entity.id}
              icon={imageResourcePathProvider.provideIspImageWithFallback(entity)}
              title={entity.name}
              parentLocation={entity.parentLocation}
              cardTitle={model.entityName}
              onClick={this.props.onEntityClick}
            />
          ))}
        </CardListContainer>
      </CardMoreDetailsContainer>
    );
  }
}
