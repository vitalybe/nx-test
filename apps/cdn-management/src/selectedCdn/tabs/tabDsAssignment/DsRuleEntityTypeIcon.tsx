import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons/faQuestion";
import { Icons } from "@qwilt/common/styling/icons";
import { CacheIcon, CacheGroupIcon, HttpRouterIcon } from "@qwilt/common/components/configuration/configurationIcons";
import styled from "styled-components";
import { RuleType } from "./_domain/dsRuleEntity";
import { IspPlaceholderIcon } from "@qwilt/common/components/svg/entityIcons/IspPlaceholderIcon";
import { Colors } from "../../../_styling/colors";
import _ from "lodash";
import { TextTooltip } from "@qwilt/common/components/textTooltip/TextTooltip";

export interface Props {
  type: RuleType;
  className?: string;
}
const Icon = styled(FontAwesomeIcon)`
  margin-right: 0.5rem;
  flex: 0 0 auto;
`;

export const DsRuleEntityTypeIcon = ({ type, ...props }: Props) => {
  let icon = <Icon className={props.className} icon={faQuestion} />;

  if (type === "cdn") {
    icon = <Icon className={props.className} icon={Icons.CDN} />;
  }
  if (type === "network") {
    icon = <IspPlaceholderIcon className={props.className} color={Colors.NAVY_8} />;
  }
  if (type === "manifest-router") {
    icon = <HttpRouterIcon className={props.className} />;
  }
  if (type === "cache") {
    icon = <CacheIcon className={props.className} />;
  }
  if (type === "cache-group-edge" || type === "cache-group-mid" || type === "cache-group-both") {
    icon = <CacheGroupIcon className={props.className} />;
  }
  return (
    <TextTooltip content={_.startCase(type)} delay={[200, 0]} arrow={false} distance={2} followCursor={"initial"}>
      {icon}
    </TextTooltip>
  );
};
