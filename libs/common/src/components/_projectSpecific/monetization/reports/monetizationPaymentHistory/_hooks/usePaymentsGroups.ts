import { MonetizationPaymentEntity } from "../../../_domain/monetizationPaymentEntity";
import { useMemo, useState } from "react";
import _ from "lodash";

const groupByYear = ({ date }: MonetizationPaymentEntity) => date.year;

export function usePaymentsGroups<T extends MonetizationPaymentEntity>(payments: T[], groupByFn = groupByYear) {
  const groups = useMemo(() => {
    return _.groupBy(payments, groupByFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payments]);
  const options = _.orderBy(
    Object.keys(groups).map((groupKey) => ({
      value: _.toNumber(groupKey),
      label: groupKey.toString(),
    })),
    ({ value }) => value,
    "desc"
  );
  const [selected, setSelected] = useState(options[0]?.value);

  const total = useMemo(() => {
    return _.sumBy(groups[selected], ({ amount }) => amount);
  }, [groups, selected]);

  const currentPayments = groups[selected];

  return { total, currentPayments, groups, options, selected, setSelected };
}
