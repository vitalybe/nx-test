import * as React from "react";
import { ChangeEvent } from "react";
import styled, { css } from "styled-components";
import { observer } from "mobx-react";
import { action } from "mobx";
import { devToolsStore } from "common/components/devTools/_stores/devToolsStore";

const DevToolsView = styled.div`
  ${(props: { isMockMode: boolean }) => {
    let colorDark = "#959595";
    let colorLight = "#c8c8c8";
    if (props.isMockMode) {
      colorDark = "black";
      colorLight = "yellow";
    }

    return css`
      --colorDark: ${colorDark};
      --colorLight: ${colorLight};

      position: fixed;
      bottom: 1em;
      right: 0;
      background: repeating-linear-gradient(
        45deg,
        var(--colorLight),
        10px,
        var(--colorDark) 10px,
        var(--colorDark) 20px
      );
      padding: 0.5em;
      border: 1px solid var(--colorDark);
      transform: translateX(120px);
      transition: 0.5s ease;
      &:hover {
        transform: translateX(0);
      }
      .content {
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        border: 1px solid var(--colorDark);
        background-color: var(--colorLight);
        padding: 0.5em;
        color: black;
      }
    `;
  }};
`;

const Row = styled.div`
  margin: 0.5em 0;
`;

const TextInput = styled.input`
  width: 100px;
`;

const Checkbox = styled.input`
  margin-right: 0.5em;
`;

interface Props {}

const initialState = {};
type State = Readonly<typeof initialState>;

@observer
export class DevTools extends React.Component<Props, State> {
  readonly state: State = initialState;

  @action
  onEnvironmentChange = (e: ChangeEvent<HTMLInputElement>) => {
    devToolsStore.environment = e.target.value;
  };

  reload = () => {
    location.reload(true);
  };

  render() {
    return (
      <DevToolsView isMockMode={devToolsStore.isMockMode || devToolsStore.environment.length > 0}>
        <div className="content">
          <Row>
            <Checkbox
              type="checkbox"
              id="mockMode"
              checked={devToolsStore.isMockMode}
              onChange={(e) => {
                devToolsStore.isMockMode = e.target.checked;
                this.reload();
              }}
            />
            <label htmlFor="mockMode">Mock mode</label>
          </Row>
          <Row>
            <TextInput
              type="text"
              id="mockMode"
              placeholder={"env"}
              value={devToolsStore.environment}
              onChange={this.onEnvironmentChange}
              onBlur={this.reload}
            />
          </Row>
        </div>
      </DevToolsView>
    );
  }
}
