import styled from "styled-components";
import { GridValueRenderer, QwiltGrid, QwiltGridColumnDef } from "@qwilt/common/components/qwiltGrid/QwiltGrid";
import { ConfigurationStyles } from "@qwilt/common/components/configuration/_styles/configurationStyles";
import { ServerEntity } from "../../_domain/server/serverEntity";
import { HealthProviderEntity } from "../../_domain/healthProvider/healthProviderEntity";
import { GridOptions } from "ag-grid-community/dist/lib/entities/gridOptions";
import { ICellRendererParams } from "ag-grid-community";
import { HealthProviders } from "../_parts/healthProviders/HealthProviders";
import * as React from "react";
import { darken } from "polished";

export class MonitorsAndRoutersGridUtils {
  static MonitorRouterGrid = styled(QwiltGrid)`
    .ag-row:not(.ag-row-hover) > .ag-cell.readOnly {
      background-color: ${ConfigurationStyles.COLOR_READ_ONLY_COLUMN};
    }

    .ag-row.ag-row-hover > .ag-cell.readOnly {
      background-color: ${darken(0.02, ConfigurationStyles.COLOR_READ_ONLY_COLUMN)};
    }
  ` as typeof QwiltGrid;

  static healthProviderParentGridOptions: GridOptions = {
    groupDefaultExpanded: 0,
    masterDetail: true,
    detailCellRendererFramework: (props: ICellRendererParams) => (
      <HealthProviders entities={props.data.healthProviders} />
    ),
    detailRowHeight: 200,
  };

  static attachHealthProviderExpander<T extends { healthProviders?: HealthProviderEntity[] }>(
    columnHeader: string,
    columns: QwiltGridColumnDef<T>[]
  ): QwiltGridColumnDef<T>[] {
    const column = columns.find((column) => column.headerName === columnHeader);
    if (!column) {
      throw new Error(`column not found: ${columnHeader}`);
    }

    column.colDefOptions = {
      ...column.colDefOptions,
      ...this.getReadonlyColumnOptions().colDefOptions,
      cellRenderer: "agGroupCellRenderer",
      getQuickFilterText: (params) => {
        const entity: T = params.data;
        const serverFields = Object.values(entity);
        const healthProviderFields =
          entity.healthProviders?.flatMap((healthProvider) => Object.values(healthProvider)) ?? [];
        return [...serverFields, ...healthProviderFields]
          .filter((field) => ["string", "number"].includes(typeof field))
          .map((field) => field.toString())
          .join(" ");
      },
    };

    return columns;
  }

  static getAllReadonlyColumns<
    T extends ServerEntity & { healthProviders?: HealthProviderEntity[] }
  >(): QwiltGridColumnDef<T>[] {
    return [
      {
        ...this.getReadonlyColumnOptions(),
        headerName: "Hostname",
        renderer: new GridValueRenderer({ valueGetter: (entity) => entity.hostname }),
      },
      {
        ...this.getReadonlyColumnOptions(),
        headerName: "System ID",
        renderer: new GridValueRenderer({ valueGetter: (entity) => entity.systemId }),
      },

      {
        ...this.getReadonlyColumnOptions(),
        headerName: "Domain",
        renderer: new GridValueRenderer({ valueGetter: (entity) => entity.domain }),
      },
      {
        ...this.getReadonlyColumnOptions(),
        headerName: "IPv4 Address",
        renderer: new GridValueRenderer({ valueGetter: (entity) => entity.ipv4Address }),
      },
      {
        ...this.getReadonlyColumnOptions(),
        headerName: "IPv6 Address",
        renderer: new GridValueRenderer({ valueGetter: (entity) => entity.ipv6Address }),
      },
      {
        ...this.getReadonlyColumnOptions(),
        headerName: "TCP Port",
        renderer: new GridValueRenderer({ valueGetter: (entity) => entity.tcpPort.toString() }),
      },
      {
        ...this.getReadonlyColumnOptions(),
        headerName: "HTTPS Port",
        renderer: new GridValueRenderer({ valueGetter: (entity) => entity.httpsPort.toString() }),
      },
    ];
  }

  private static getReadonlyColumnOptions<T>(): Partial<QwiltGridColumnDef<T>> {
    return {
      colDefOptions: {
        cellClass: "readOnly",
      },
    };
  }
}
