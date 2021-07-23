import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { openConfirmModal } from "common/components/qwiltModal/QwiltModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "common/styling/icons";
import { Clickable } from "common/components/configuration/clickable/Clickable";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const DeleteButtonView = styled(Clickable).attrs({})`
  font-size: 1.2rem;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  showDeletePrompt: boolean;
  onClick: () => void;

  className?: string;
}

//endregion [[ Props ]]

export const DeleteButton = (props: Props) => {
  return (
    <DeleteButtonView
      className={props.className}
      onClick={async () => {
        let toDelete = true;
        if (props.showDeletePrompt !== undefined && props.showDeletePrompt) {
          toDelete = await openConfirmModal(`Are you sure want to delete item?`);
        }
        if (toDelete) {
          props.onClick();
        }
      }}>
      <FontAwesomeIcon icon={Icons.DELETE} />
    </DeleteButtonView>
  );
};
