import * as React from "react";
import styled from "styled-components";
import { ItemWithActions, Props } from "common/components/configuration/itemWithActions/ItemWithActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

import { mockUtils } from "common/utils/mockUtils";
import { Icons } from "common/styling/icons";
import { ItemWithActionsIcon } from "common/components/configuration/itemWithActions/itemWithActionsIcon/ItemWithActionsIcon";

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
