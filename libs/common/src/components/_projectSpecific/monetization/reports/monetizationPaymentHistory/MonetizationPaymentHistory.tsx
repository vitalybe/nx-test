import * as React from "react";
import { ReactElement, useCallback, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import {
  Props as QwiltGridProps,
  QwiltGrid,
  QwiltGridColumnDef,
  TreeData,
} from "common/components/qwiltGrid/QwiltGrid";
import { GridApi, GridOptions } from "ag-grid-community";
import { GlobalFontStore } from "common/components/GlobalFontProvider";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { Fonts } from "common/styling/fonts";
import {
  BackIcon,
  ExportIcon,
  LogoImg,
  SpLogoPlaceholder,
  TopbarBtn,
  TopbarTitle,
} from "common/components/_projectSpecific/monetization/_styled/topbarParts";
import { CurrencyUnitEnum, CurrencyUtils } from "common/components/_projectSpecific/monetization/_utils/currencyUtils";
import { QcButton } from "common/components/qcComponents/_styled/qcButton/QcButton";
import { FormSelectRaw, SelectOption } from "common/components/qcComponents/form/_raw/formSelectRaw/FormSelectRaw";
import { TextTooltip } from "common/components/textTooltip/TextTooltip";
import { ProviderMetadata } from "common/components/providerDataContainer/_providers/useProvider";
import { ProviderDataContainer } from "common/components/providerDataContainer/ProviderDataContainer";
import { CommonColors } from "common/styling/commonColors";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const SelectStyled = styled(FormSelectRaw)`
  max-width: 12rem;
  margin-left: 1rem;
  text-align: left;
`;

const PageTitleContainer = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  width: 100%;
  max-width: 70rem;
  align-items: center;
`;

const QcButtonStyled = styled(QcButton).attrs({ isHighlighted: true })`
  width: max-content;
  justify-self: end;
  &:focus {
    box-shadow: none !important;
  }
` as typeof QcButton;

const PageTitle = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
`;

const QwiltGridStyled = (styled(QwiltGrid)`
  flex: 1 1 auto;
  box-shadow: none;
  border-radius: 0;
  border: 1px solid ${CommonColors.ICE_BLUE};
  width: 100%;
  max-width: 70rem;

  .ag-group-contracted {
    height: 100% !important;
  }

  .ag-header-cell {
    &:hover {
      background-color: white !important;
    }
    .ag-header-cell-label {
      font-family: ${Fonts.FONT_FAMILY};
      color: ${CommonColors.SHERPA_BLUE};
      font-size: 0.75rem;
      font-weight: 500;
    }
  }
  .ag-cell {
    font-family: ${Fonts.FONT_FAMILY};
    color: ${CommonColors.SHERPA_BLUE};
    font-size: 0.75rem;
    font-weight: 600;
  }
  .right-aligned-cell {
    .react-cell-wrapper,
    .ag-header-cell-label {
      justify-content: flex-end !important;
    }
  }
  .ag-row-hover {
    background-color: white !important;
  }
  .ag-row {
    border-color: ${CommonColors.ICE_BLUE} !important;
  }
  .ag-header {
    border-color: ${CommonColors.ICE_BLUE} !important;
  }
  .ag-react-container,
  .ag-group-value {
    height: 100%;
    width: 100%;
  }
  .react-cell-wrapper {
    display: flex;
    align-items: center;
  }
` as unknown) as <T extends {}>(props: QwiltGridProps<T>) => ReactElement;

const PaymentHistoryTopbar = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  grid-gap: 0.5rem;
  padding: 1.875rem 3.5rem 1.875rem 2.5rem;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
`;

const PaymentHistoryView = styled(ProviderDataContainer)`
  display: flex;
  height: 100%;
  max-height: 100vh;
  flex-direction: column;
  align-items: center;
  grid-gap: 4rem;
  padding-bottom: 1rem;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props<T> {
  org: { logoSrc?: string; name: string };
  exportCallback?: () => void;
  rows: T[];
  columns: QwiltGridColumnDef<T>[];
  treeData?: TreeData<T>;
  yearOptions: SelectOption[];
  selectedYear?: number;
  setSelectedYear: (value: number) => void;
  isEditEnabled?: boolean;
  total: number;
  editCallback?: () => Promise<boolean>;
  backFn: () => void;
  refreshFn?: () => void;
  providerMetadata?: ProviderMetadata;
  className?: string;
}

//endregion [[ Props ]]

const staticGridOptions: GridOptions = {
  defaultColDef: {
    sortable: false,
    suppressMenu: true,
    suppressMovable: true,
  },
  rowHeight: GlobalFontStore.instance.remToPixels(3.125),
  headerHeight: GlobalFontStore.instance.remToPixels(3.125),
  suppressCellSelection: true,
  suppressContextMenu: true,
};

export function MonetizationPaymentHistory<T>({
  rows,
  columns,
  treeData,
  editCallback,
  exportCallback,
  yearOptions,
  setSelectedYear,
  selectedYear,
  refreshFn,
  ...props
}: Props<T>) {
  useEffect(() => {
    // default year selection
    if (!selectedYear && yearOptions[0]) {
      setSelectedYear(yearOptions[0]?.value as number);
    }
  }, [selectedYear, yearOptions, setSelectedYear]);

  const gridApiRef = useRef<GridApi | undefined>(undefined);

  const gridOptions = useMemo<GridOptions>(
    () => ({
      ...staticGridOptions,
      onGridReady(event) {
        event.api.forEachNode((node) => node.setExpanded(false));
        gridApiRef.current = event.api;
      },
    }),
    []
  );

  useEffect(() => {
    gridApiRef.current?.forEachNode((node) => node.setExpanded(false));
  }, [rows]);

  const onUpdatePayment = useCallback(async () => {
    const isEdited = await editCallback?.();
    if (isEdited) {
      refreshFn?.();
    }
  }, [refreshFn, editCallback]);

  return (
    <PaymentHistoryView className={props.className} providerMetadata={props.providerMetadata}>
      <PaymentHistoryTopbar>
        <BackIcon onClick={props.backFn} />
        <TopbarTitle>{"Payment History"}</TopbarTitle>
        <TopbarBtn onClick={exportCallback}>
          <ExportIcon />
          {"Export"}
        </TopbarBtn>
        {props.org.logoSrc ? (
          <LogoImg src={props.org.logoSrc} alt={"logo"} />
        ) : (
          <SpLogoPlaceholder>{props.org.name}</SpLogoPlaceholder>
        )}
      </PaymentHistoryTopbar>
      <PageTitleContainer>
        <SelectStyled
          value={selectedYear ?? 0}
          placeholder={"No data"}
          onChange={(value) => setSelectedYear(value as number)}
          options={yearOptions}
        />
        <PageTitle>Total Payments {CurrencyUtils.format(props.total, CurrencyUnitEnum.US_DOLLAR)}</PageTitle>
        {editCallback && (
          <TextTooltip isEnabled={!props.isEditEnabled} content={"No Payments are pending in the selected year"}>
            <QcButtonStyled isClickDisabled={!props.isEditEnabled} onClick={onUpdatePayment}>
              {"Update Invoice Date"}
            </QcButtonStyled>
          </TextTooltip>
        )}
      </PageTitleContainer>
      <QwiltGridStyled theme={"material"} rows={rows} columns={columns} gridOptions={gridOptions} treeData={treeData} />
    </PaymentHistoryView>
  );
}
