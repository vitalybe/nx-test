import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { QwiltInput } from "@qwilt/common/components/configuration/qwiltForm/qwiltInput/QwiltInput";
import { Checkbox } from "@qwilt/common/components/checkbox/Checkbox";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const ContextDiffGridFilterView = styled.div`
  display: flex;
`;

const FilterInput = styled(QwiltInput)`
  flex: 1;
  margin-right: 1rem;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  onFilterChange: (newFilter: string) => void;
  onShowUnmodifiedChange: (newValue: boolean) => void;

  className?: string;
}

//endregion [[ Props ]]

export const ContextDiffGridFilter = (props: Props) => {
  const [filter, setFilter] = useState("");
  const [isShowUnmodified, setIsShowUnmodified] = useState(true);

  function onFilterChange(newFilter: string) {
    setFilter(newFilter);
    props.onFilterChange(newFilter);
  }

  function onShowUnmodifiedChange(newValue: boolean) {
    setIsShowUnmodified(newValue);
    props.onShowUnmodifiedChange(newValue);
  }

  return (
    <ContextDiffGridFilterView className={props.className}>
      <FilterInput autoComplete={false} label={"Filter"} value={filter} onChange={onFilterChange} />
      <Checkbox isChecked={isShowUnmodified} onClick={() => onShowUnmodifiedChange(!isShowUnmodified)}>
        <div>Show Unmodified</div>
      </Checkbox>
    </ContextDiffGridFilterView>
  );
};
