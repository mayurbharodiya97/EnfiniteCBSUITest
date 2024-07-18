import { useMemo } from "react";

export const FooterCell = ({
  rows,
  column: { id: columnName, isDisplayTotal = false, totalDecimalCount },
}) => {
  let newrowdata = rows.filter((item) => !item.original.ignoreValue);
  const total = useMemo(
    () =>
      newrowdata.reduce(
        (sum, row) => Number(row.values?.[columnName] ?? 0) + sum,
        0
      ),
    [newrowdata, columnName]
  );
  return `${
    isNaN(total) || !Boolean(isDisplayTotal)
      ? ""
      : totalDecimalCount
      ? total.toFixed(totalDecimalCount)
      : total
  }`;
};
