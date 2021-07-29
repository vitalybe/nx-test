import { ChartObject, PlotPoint } from "highcharts";
import { MetadataServiceTypeEnum } from "common/backend/deliveryServices/_types/deliveryServiceMetadataTypes";
import _ from "lodash";
import { enumValues } from "common/utils/typescriptUtils";
import { CommonColors } from "common/styling/commonColors";

export function tooltipDynamicPositioner(
  this: { chart: ChartObject },
  labelWidth: number,
  labelHeight: number,
  point: PlotPoint
) {
  const chart = this.chart;
  if (!chart) {
    return { x: 0, y: 0 };
  }

  let tooltipY;

  if (point.plotY - labelHeight - 100 > 0) {
    tooltipY = point.plotY - labelHeight - 54;
  } else {
    tooltipY = point.plotY + 20;
  }

  return {
    x: point.plotX - labelHeight / 2,
    y: tooltipY,
  };
}

// Indexing services to get mapped into x Axis number values
export function getServicesList(data: { [k in MetadataServiceTypeEnum]?: number }) {
  return _.orderBy(
    _.filter(enumValues(MetadataServiceTypeEnum), (key) => !!data[key]),
    (key) => data[key],
    "desc"
  );
}

// Service Types stuff

export function getServiceColorPallet(type: MetadataServiceTypeEnum) {
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

export function getServiceTypeDataLabelHtml(type: MetadataServiceTypeEnum, colorOverride?: string) {
  const typeColor = colorOverride ?? getServiceColorPallet(type);
  const commonSvgHtmlContainer = (innerHtml: string) => `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <g fill="none" fill-rule="evenodd">
      <g fill="${typeColor}">
        <g>
          <g>
            <g>
              <g>
                <g>
                  <g>
                    <g>
                        ${innerHtml}
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
  `;

  const dict: { [k in MetadataServiceTypeEnum]?: string } = {
    [MetadataServiceTypeEnum.SOFTWARE_DOWNLOAD]: commonSvgHtmlContainer(`
      <path d="M16.8 16.8V18H7.2v-1.2h9.6zM12.914 6v6.11l1.829-1.746 1.371 1.309L12 15.6l-4.114-3.927 1.371-1.31 1.829 1.746V6h1.828z" transform="translate(-991 -2031) translate(119 248) translate(0 1472) translate(0 77) translate(430) translate(391 182) translate(46 28) translate(5 24)"/>
    `),
    [MetadataServiceTypeEnum.MUSIC]: commonSvgHtmlContainer(`
      <path d="M16.5 9.027v6.074c-.028.75-.648 1.343-1.4 1.337h-.548c-.736-.011-1.331-.602-1.348-1.337v-.55c-.006-.75.598-1.362 1.348-1.368H15.505V9.711L10.8 11.183v5.307c-.006.757-.621 1.368-1.379 1.368h-.539c-.759 0-1.377-.61-1.389-1.368v-.55c0-.755.613-1.368 1.368-1.368H9.805V8.354c-.002-.217.136-.41.342-.477l5.7-1.772c.151-.055.32-.027.446.072.128.09.206.237.207.394v2.456z" transform="translate(-1129 -1801) translate(119 248) translate(0 1472) translate(0 77) translate(430) translate(496) translate(80) translate(4 4)"/>
   `),
  };
  return dict[type] ?? `<span class="data-label-type" style="color: ${typeColor}">${_.upperCase(type)}</span>`;
}
