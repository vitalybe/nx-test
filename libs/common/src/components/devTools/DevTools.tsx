import * as React from "react";
import { observer } from "mobx-react";

const initialState = {};
type State = Readonly<typeof initialState>;

@observer
export class DevTools extends React.Component<{}, State> {
  readonly state: State = initialState;

  render() {
    return null;
  }
}
