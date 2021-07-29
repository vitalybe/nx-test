import * as React from "react";
import styled from "styled-components";
import { ItemWithActions, Props } from "./ItemWithActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import FixtureDecorator from "../../../utils/cosmos/FixtureDecorator";

import { mockUtils } from "../../../utils/mockUtils";
import { Icons } from "../../../styling/icons";
import { ItemWithActionsIcon } from "./itemWithActionsIcon/ItemWithActionsIcon";

const View = styled(FixtureDecorator)`
  margin: 1em;
  width: 200px;
`;

function getProps(propsOverrides?: Partial<Props>): Props {
  return {
    title: "Mock",
    icon: <ItemWithActionsIcon icon={Icons.EDIT} />,
    actionButtons: [
      { icon: <FontAwesomeIcon icon={Icons.EDIT} />, onClick: mockUtils.mockAction("action button 1") },
      { icon: <FontAwesomeIcon icon={Icons.DELETE} />, onClick: mockUtils.mockAction("action button 2") },
    ],
    ...propsOverrides,
  };
}

export default {
  Regular: (
    <View>
      <ItemWithActions {...getProps()} />
    </View>
  ),
  "No actions": (
    <View>
      <ItemWithActions
        {...getProps({
          actionButtons: [],
        })}
      />
    </View>
  ),
  "No icon": (
    <View>
      <ItemWithActions
        {...getProps({
          icon: undefined,
        })}
      />
    </View>
  ),
  Selectable: (
    <View>
      <ItemWithActions
        {...getProps({
          isSelectable: true,
        })}
      />
    </View>
  ),
  Selected: (
    <View>
      <ItemWithActions
        {...getProps({
          isSelected: true,
        })}
      />
    </View>
  ),
  Disabled: (
    <View>
      <ItemWithActions
        {...getProps({
          disabled: true,
        })}
      />
    </View>
  ),
};
