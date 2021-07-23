import * as React from "react";
import { CommonDsEntity } from "common/components/_projectSpecific/dsDashboardComponents/_domain/commonDsEntity";
import { TextTooltip } from "common/components/textTooltip/TextTooltip";
import _ from "lodash";
import styled from "styled-components";
import { Cell } from "common/components/_projectSpecific/dsDashboardComponents/dsGrid/_styles/cell";
import { GridReactRenderer } from "common/components/qwiltGrid/QwiltGrid";
import { MetadataServiceTypeEnum } from "common/backend/deliveryServices/_types/deliveryServiceMetadataTypes";

const dsTypeVod = require("common/images/dsDashboardImages/serviceTypes/dsTypeVod.svg");
const dsTypeLive = require("common/images/dsDashboardImages/serviceTypes/dsTypeLive.svg");
const dsTypeMusic = require("common/images/dsDashboardImages/serviceTypes/dsTypeMusic.svg");
const dsTypeDownload = require("common/images/dsDashboardImages/serviceTypes/dsTypeDownload.svg");

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
