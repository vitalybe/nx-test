import * as React from "react";
import { loggerCreator } from "../../../../utils/logger";
import { Icons } from "../../../../styling/icons";
import { ItemWithActionsIcon } from "../../../configuration/itemWithActions/itemWithActionsIcon/ItemWithActionsIcon";
import { TextTooltip } from "../../../textTooltip/TextTooltip";

const moduleLogger = loggerCreator("__filename");

//region [[ Props ]]

export interface Props {
  isActive: boolean;
  className?: string;
}

//endregion [[ Props ]]

const COLOR_INACTIVE = "#d42323";

export const DeliveryServiceIcon = (props: Props) => {
  return (
    <TextTooltip isEnabled={!props.isActive} content={"Delivery Service is inactive"}>
      <ItemWithActionsIcon
        className={props.className}
        color={props.isActive ? undefined : COLOR_INACTIVE}
        icon={Icons.DELIVERY_SERVICE}
      />
    </TextTooltip>
  );
};
