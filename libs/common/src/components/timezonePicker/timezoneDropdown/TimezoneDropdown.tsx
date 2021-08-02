import * as React from "react";
import { useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { TimezoneUtil, ZoneMetadata } from "common/components/timezonePicker/_utils/timezoneUtil";
import Downshift, { DownshiftState, StateChangeOptions } from "downshift";
import { CommonColors } from "common/styling/commonColors";
import { Zone } from "luxon";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const TimezoneDropdownView = styled.div`
  width: 400px;
`;

const DropdownContainer = styled.div`
  width: 100%;
  padding: 0.5em;
  background-color: white;
`;

const ItemsContainer = styled.div`
  height: 200px;
  overflow-y: scroll;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.9em 1.5em 0.7em 0.5em;
  outline: 0;
  border-radius: 5px;
`;

const ZoneContainer = styled.div<{ isHighlighted: boolean }>`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  padding: 0.5em;

  ${(props) =>
    props.isHighlighted &&
    css`
      background-color: ${CommonColors.LILY_WHITE};
    `}

  &:hover {
    background-color: ${CommonColors.LILY_WHITE};
  }
`;

const Text = styled.div``;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  onTimezoneSelected: (zone: Zone) => void;
  className?: string;
}

//endregion [[ Props ]]

export const TimezoneDropdown = ({ ...props }: Props) => {
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  return (
    <TimezoneDropdownView>
      <Downshift
        initialInputValue={""}
        stateReducer={downshiftStateReducer}
        itemToString={(item: ZoneMetadata) => (item ? item.offsetNameLong : "")}
        onSelect={(zoneMetadata: ZoneMetadata | null) => zoneMetadata && props.onTimezoneSelected(zoneMetadata.zone)}>
        {({ getRootProps, getInputProps, inputValue, getItemProps, highlightedIndex }) => (
          <DropdownContainer {...getRootProps()} className={props.className}>
            <SearchInput {...getInputProps()} ref={searchInputRef} tabIndex={0} />
            <ItemsContainer>
              {TimezoneUtil.getAllZonesMetadata()
                .map(getDropdownItemData)
                .filter(({ inputMatcher }) => inputMatcher.includes((inputValue || "").toLowerCase()))
                .map(({ zoneMetadata, zoneName, offsetString }, i) => (
                  <ZoneContainer
                    key={zoneName}
                    {...getItemProps({ item: zoneMetadata })}
                    isHighlighted={i === highlightedIndex}>
                    <Text>{zoneName}</Text>
                    <Text>{offsetString}</Text>
                  </ZoneContainer>
                ))}
            </ItemsContainer>
          </DropdownContainer>
        )}
      </Downshift>
    </TimezoneDropdownView>
  );
};

interface DropdownItemData {
  zoneMetadata: ZoneMetadata;
  zoneName: string;
  offsetString: string;
  inputMatcher: string;
}

function getDropdownItemData(zoneMetadata: ZoneMetadata): DropdownItemData {
  const prettyZoneName = TimezoneUtil.getPrettyName(zoneMetadata);
  const prettyOffset = TimezoneUtil.getPrettyOffset(zoneMetadata);
  const inputMatcher = (prettyZoneName + " " + prettyOffset).toLowerCase();
  return { zoneMetadata, zoneName: prettyZoneName, offsetString: prettyOffset, inputMatcher: inputMatcher };
}

function downshiftStateReducer(state: DownshiftState<ZoneMetadata>, changes: StateChangeOptions<ZoneMetadata>) {
  // don't modify the input on selection
  switch (changes.type) {
    case Downshift.stateChangeTypes.keyDownEnter:
    case Downshift.stateChangeTypes.clickItem:
      return {
        ...changes,
        inputValue: "",
      };
    case Downshift.stateChangeTypes.blurInput:
      return {
        ...changes,
        inputValue: state.inputValue,
      };
    default:
      return changes;
  }
}
