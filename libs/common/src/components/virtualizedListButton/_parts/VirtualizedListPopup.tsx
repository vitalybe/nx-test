import * as React from "react";
import { useCallback } from "react";
import styled from "styled-components";
import { UnitKindEnum, unitsFormatter } from "../../../utils/unitsFormatter";
import { TruncatedSpn } from "../../styled/TruncatedSpn";
import { DynamicVirtualizedList } from "../../virtualizedList/DynamicVirtualizedList";
import { transparentize } from "polished";
import { CommonColors } from "../../../styling/commonColors";
import { CurrencyUnitEnum, CurrencyUtils } from "../../_projectSpecific/monetization/_utils/currencyUtils";
import _ from "lodash";

const NO_DATA_CHILD_TEXT = "NO DATA";

// region [[Styles]]
const CenteredTextDiv = styled.div`
  max-width: 100%;
  text-align: center;
  padding: 0.25rem 0.75rem;
`;

const SubSpn = styled.span`
  font-size: 0.6875rem;
  opacity: 0.6;
  color: ${CommonColors.HEATHER};
  width: 100%;
  font-weight: 500;
`;

const ChildValueSpn = styled.span<{ hasData?: boolean }>`
  flex: 1 0 auto;
  text-align: end;
  font-weight: 600;
  opacity: ${(props) => (props.hasData ? 1 : 0.5)};
  font-size: ${(props) => (props.hasData ? "0.75rem" : "0.625rem")};
`;
const ChildNameSpn = styled(TruncatedSpn)`
  flex: 0 1 auto;
  font-weight: 600;
  max-width: 10rem;
  &:first-child {
    margin-right: 0.5rem;
  }
`;
export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.3125rem 0.75rem;
  min-width: 11.25rem;
  width: 100%;
  max-width: 100%;
`;

const Header = styled(Row)`
  font-size: 0.875rem;
  font-weight: 600;
  border-bottom: 1px solid ${transparentize(0.8, "#979797")};
  margin-bottom: 0.3125rem;
`;

const VirtualizedListPopupView = styled.div`
  width: 100%;
  max-width: 18.75rem;
  display: flex;
  flex-direction: column;
`;

//endregion

// region [[Props]]
export type ListItem = { name: string; value: number; percentage: number };
export interface Props {
  childrenData: Array<ListItem>;
  title?: string;
  currency?: CurrencyUnitEnum;
  relativeTotal?: number;
  maxChildCount?: number;
  unit?: UnitKindEnum;
  className?: string;
}
// endregion

export function VirtualizedListPopup({
  childrenData,
  maxChildCount,
  unit,
  title,
  relativeTotal,
  currency,
  ...props
}: Props) {
  const childrenSum = _.sumBy(childrenData ?? [], ({ value }) => value);

  const visibleChildren = maxChildCount ? childrenData.slice(0, maxChildCount) : childrenData;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const renderer = useCallback(listRenderer(visibleChildren, unit, currency), [visibleChildren, unit]);

  const formattedSum = childrenSum ? unitsFormatter.format(childrenSum, unit).getPrettyWithUnit(true) : "";

  const sumTitle = `${formattedSum} ${
    childrenSum > 0 && relativeTotal ? `(${_.round((childrenSum / relativeTotal) * 100, 2)}%)` : ""
  }`;

  return (
    <VirtualizedListPopupView className={props.className}>
      {title && (
        <Header>
          <span>{title}</span>
          {sumTitle && (
            <span>
              {currency && CurrencyUtils.getCurrencySign(currency)}
              {sumTitle}
            </span>
          )}
        </Header>
      )}
      <DynamicVirtualizedList totalCount={visibleChildren.length} renderer={renderer} />
      {maxChildCount && childrenData!.length - maxChildCount > 0 && (
        <CenteredTextDiv key={name}>
          <SubSpn>+ {childrenData!.length - maxChildCount} more</SubSpn>
        </CenteredTextDiv>
      )}
    </VirtualizedListPopupView>
  );
}

function listRenderer(list: ListItem[], unit = UnitKindEnum.COUNT, currency?: CurrencyUnitEnum) {
  return (index: number) => {
    const child = list[index];
    const formattedValue = unitsFormatter.format(child.value, unit).getPrettyWithUnit(true);
    const valueCurrencyPrefix = currency ? CurrencyUtils.getCurrencySign(currency) : "";
    return (
      <Row key={child.name}>
        <ChildNameSpn>{child.name}</ChildNameSpn>
        <ChildValueSpn hasData={child.value > 0}>
          {child.value > 0
            ? `${valueCurrencyPrefix}${formattedValue} (${formatPercentage(child.percentage)}%)`
            : NO_DATA_CHILD_TEXT}
        </ChildValueSpn>
      </Row>
    );
  };
}
function formatPercentage(percentage: number) {
  return percentage >= 1 ? Math.floor(percentage) : "<1";
}
