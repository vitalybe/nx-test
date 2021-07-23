import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { ParamsGridItem } from "../ParamsGrid";
import { Input, Switch } from "antd";
import { ChangeEvent } from "react";
import { CommonColors } from "common/styling/commonColors";
import { useUrlBooleanState, useUrlState } from "common/utils/hooks/useUrlState";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const ParamsGridInputView = styled.div`
  width: 8rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InputStyled = styled(Input)`
  input {
    color: ${CommonColors.BLUE_LAGOON};
    text-overflow: ellipsis;
    font-weight: lighter;
  }
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  item: ParamsGridItem;
  onChange: (param: string, value: string) => void;
  className?: string;
}

//endregion [[ Props ]]

export const ParamsGridInput = (props: Props) => {
  const [value, setValue] = useUrlState<string, string>(props.item.param);
  const [isExists, setIsExists] = useUrlBooleanState<string>(props.item.param);

  const onChange = (newValue: string) => {
    setValue(newValue);
    props.onChange(props.item.param, newValue);
  };

  const onBoolChange = (newValue: boolean) => {
    setIsExists(newValue);
    props.onChange(props.item.param, String(newValue));
  };

  return (
    <ParamsGridInputView className={props.className}>
      {props.item.type != "boolean" ? (
        <InputStyled
          style={{ color: CommonColors.BLUE_LAGOON }}
          allowClear
          value={value}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        />
      ) : (
        <Switch checked={isExists} onChange={(checked: boolean) => onBoolChange(checked)} />
      )}
    </ParamsGridInputView>
  );
};
