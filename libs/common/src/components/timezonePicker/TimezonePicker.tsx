import * as React from "react";
import { useRef, useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "../../utils/logger";
import { Zone } from "luxon";
import { TimezoneUtil } from "./_utils/timezoneUtil";
import { Tooltip } from "../Tooltip";
import { TimezoneDropdown } from "./timezoneDropdown/TimezoneDropdown";
import { Instance } from "tippy.js";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const TimezonePickerView = styled.div<{}>`
  cursor: pointer;
  display: inline-block;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  currentZone: Zone;
  onZoneChange: (zone: Zone) => void;

  labelColor?: string;

  className?: string;
}

//endregion [[ Props ]]

export const TimezonePicker = ({ ...props }: Props) => {
  const tippyRef = useRef<Instance>();
  const [isTippyShown, setIsTippyShown] = useState(false);

  const zoneMetadata = TimezoneUtil.getZoneMetadata(props.currentZone);
  const prettyOffset = "GMT" + TimezoneUtil.getPrettyOffset(zoneMetadata);

  function onTippyShow(tippyInstance: Instance) {
    tippyRef.current = tippyInstance;
    setIsTippyShown(true);
  }

  function onTippyHide() {
    tippyRef.current = undefined;
    setIsTippyShown(false);
  }

  function onTimezoneSelected(zone: Zone) {
    if (tippyRef.current) {
      tippyRef.current.hide();
    }

    props.onZoneChange(zone);
  }

  return (
    <Tooltip
      content={isTippyShown ? <TimezoneDropdown onTimezoneSelected={onTimezoneSelected} /> : ""}
      placement={"bottom-start"}
      hideOnClick={true}
      interactive={true}
      trigger={"click"}
      autoFocus={false}
      onShow={onTippyShow}
      onHide={onTippyHide}>
      <TimezonePickerView className={props.className}>{prettyOffset}</TimezonePickerView>
    </Tooltip>
  );
};
