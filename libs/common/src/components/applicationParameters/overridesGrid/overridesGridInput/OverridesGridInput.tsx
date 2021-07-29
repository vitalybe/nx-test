import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { Input } from "antd";
import { ChangeEvent } from "react";
import { CommonColors } from "common/styling/commonColors";
import { useUrlState } from "common/utils/hooks/useUrlState";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const OverridesGridInputView = styled.div`
  width: 10rem;
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
  param: string;
  className?: string;
}

//endregion [[ Props ]]

export const OverridesGridInput = (props: Props) => {
  const [value, setValue] = useUrlState<string, string>(props.param, false);

  const onChange = (newValue: string) => {
    setValue(newValue);
  };

  return (
    <OverridesGridInputView className={props.className}>
      <InputStyled
        style={{ color: CommonColors.BLUE_LAGOON }}
        allowClear
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
      />
    </OverridesGridInputView>
  );
};
