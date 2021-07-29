import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons/faQuestion";
import {
  DnsRouterIcon,
  HealthCollectorIcon,
  HttpRouterIcon,
  HttpRoutersGroupIcon,
  MonitorIcon,
} from "@qwilt/common/components/configuration/configurationIcons";
import styled from "styled-components";
import { ServerType } from "@qwilt/common/backend/trafficRoutersMonitors/_types/trafficRoutersMonitorsTypes";

export interface Props {
  type: ServerType;
  className?: string;
}
const Icon = styled(FontAwesomeIcon)`
  margin-right: 0.5rem;
  flex: 0 0 auto;
`;

export const ServerTypeIcon = ({ type, ...props }: Props) => {
  if (type === ServerType.MONITOR) {
    return <MonitorIcon className={props.className} />;
  }
  if (type === ServerType.DNS_ROUTER) {
    return <DnsRouterIcon className={props.className} />;
  }
  if (type === ServerType.HTTP_ROUTER_GROUP) {
    return <HttpRoutersGroupIcon className={props.className} />;
  }
  if ([ServerType.HTTP_ROUTER, ServerType.MANIFEST_ROUTER].includes(type)) {
    return <HttpRouterIcon className={props.className} />;
  }
  if (type === ServerType.HEALTH_COLLECTOR) {
    return <HealthCollectorIcon className={props.className} />;
  }
  return <Icon className={props.className} icon={faQuestion} />;
};
