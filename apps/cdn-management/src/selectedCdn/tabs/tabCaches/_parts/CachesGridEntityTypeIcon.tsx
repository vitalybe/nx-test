import * as React from "react";
import { CachesGridEntity } from "src/selectedCdn/tabs/tabCaches/_domain/cachesGridEntity";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons/faQuestion";
import { CacheIcon, CacheGroupIcon, OfflineQnIcon } from "common/components/configuration/configurationIcons";
import styled from "styled-components";
import { IspPlaceholderIcon } from "common/components/svg/entityIcons/IspPlaceholderIcon";
import { Colors } from "src/_styling/colors";
import { TextTooltip } from "common/components/textTooltip/TextTooltip";
import _ from "lodash";

export interface Props {
  entity: CachesGridEntity;
  className?: string;
}
const Icon = styled(FontAwesomeIcon)`
  margin-right: 0.5rem;
  flex: 0 0 auto;
`;

export const CachesGridEntityTypeIcon = ({ entity: { type, isOnline }, ...props }: Props) => {
  let icon = <Icon className={props.className} icon={faQuestion} />;
  if (type === "network") {
    icon = <IspPlaceholderIcon className={props.className} color={Colors.NAVY_8} />;
  }
  if (type === "cache") {
    if (isOnline) {
      icon = <CacheIcon className={props.className} />;
    } else {
      icon = <OfflineQnIcon className={props.className} />;
    }
  }
  if (type === "cache-group") {
    icon = <CacheGroupIcon className={props.className} />;
  }

  return (
    <TextTooltip content={_.startCase(type)} delay={[200, 0]} arrow={false} distance={2} followCursor={"initial"}>
      {icon}
    </TextTooltip>
  );
};
