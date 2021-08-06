import { MetadataServiceTypeEnum } from "../../../../backend/deliveryServices/_types/deliveryServiceMetadataTypes";
import { CommonColors } from "../../../../styling/commonColors";

export class MonetizationColors {
  static readonly CQDA_COLOR = "#3d77f3";
  static readonly SP_COLOR = "#55e3b4";
  static readonly DA_COLOR = "#8ca2ff";
  static readonly DARKENED_DA_COLOR = "#6c89d4";
  static readonly OVERALL_REVENUE_COLOR = CommonColors.LILAC_BUSH;

  static readonly BW_COLOR = CommonColors.MAYA_BLUE;
  static readonly DARKEN_BW_COLOR = CommonColors.DARKEN_MAYA_BLUE;

  static readonly VOLUME_COLOR = CommonColors.TURQUOISE_BLUE;
  static readonly DARKEN_VOLUME_COLOR = CommonColors.DARKEN_TURQUOISE_BLUE;

  static readonly CE_COLOR = CommonColors.SALMON;
  static readonly DARKEN_CE_COLOR = CommonColors.DARKEN_SALMON;
  static readonly UTILIZATION_COLOR = CommonColors.SALMON;
  static readonly DARKEN_UTILIZATION_COLOR = CommonColors.DARKEN_SALMON;

  static getIndexColor(index: number) {
    const palette = ["#124366", "#1f6599", "#2d87cb", "#3ba9ff", "#b9c9d4"];
    return palette[Math.min(index, palette.length - 1)];
  }

  static getServiceColorPalette(type: MetadataServiceTypeEnum) {
    const dict: {
      [k in MetadataServiceTypeEnum]: string;
    } = {
      [MetadataServiceTypeEnum.LIVE]: CommonColors.LILAC_BUSH,
      [MetadataServiceTypeEnum.SOFTWARE_DOWNLOAD]: CommonColors.PASTEL_GREEN,
      [MetadataServiceTypeEnum.VOD]: CommonColors.TURQUOISE_BLUE,
      [MetadataServiceTypeEnum.MUSIC]: CommonColors.SALMON,
    };

    return dict[type];
  }
}
