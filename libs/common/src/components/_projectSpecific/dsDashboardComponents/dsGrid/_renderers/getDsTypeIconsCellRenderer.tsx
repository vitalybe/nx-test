import * as React from "react";
import { CommonDsEntity } from "../../_domain/commonDsEntity";
import { TextTooltip } from "../../../../textTooltip/TextTooltip";
import _ from "lodash";
import styled from "styled-components";
import { Cell } from "../_styles/cell";
import { GridReactRenderer } from "../../../../qwiltGrid/QwiltGrid";
import { MetadataServiceTypeEnum } from "../../../../../backend/deliveryServices/_types/deliveryServiceMetadataTypes";

const dsTypeVod = require("../../../../../images/dsDashboardImages/serviceTypes/dsTypeVod.svg");
const dsTypeLive = require("../../../../../images/dsDashboardImages/serviceTypes/dsTypeLive.svg");
const dsTypeMusic = require("../../../../../images/dsDashboardImages/serviceTypes/dsTypeMusic.svg");
const dsTypeDownload = require("../../../../../images/dsDashboardImages/serviceTypes/dsTypeDownload.svg");

const ServiceTypeIconImg = styled.img`
  margin-right: 4px;
`;

const dsTypeIcons: { [k in MetadataServiceTypeEnum]: string } = {
  [MetadataServiceTypeEnum.VOD]: dsTypeVod,
  [MetadataServiceTypeEnum.LIVE]: dsTypeLive,
  [MetadataServiceTypeEnum.MUSIC]: dsTypeMusic,
  [MetadataServiceTypeEnum.SOFTWARE_DOWNLOAD]: dsTypeDownload,
};

export function getDsTypeIconsCellRenderer() {
  return new GridReactRenderer<CommonDsEntity>({
    valueGetter: (entity) => entity.serviceTypes?.join(",") ?? "",
    reactRender: ({ entity }) => {
      const value = entity.serviceTypes!;
      return (
        <Cell justify={"flex-start"}>
          {value.map((type: MetadataServiceTypeEnum) => (
            <TextTooltip ignoreBoundaries key={type} content={_.startCase(type)} interactive={false}>
              <ServiceTypeIconImg src={dsTypeIcons[type]} alt={type} />
            </TextTooltip>
          ))}
        </Cell>
      );
    },
  });
}
