import { useMemo } from "react";

let currencyFormatter = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  style: "currency",
  currency: "INR",
});

export const FooterCellWithNumber = (props) => {
  const {
    rows,
    column: { id: columnName },
  } = props;
  const total = useMemo(
    () =>
      rows.reduce((sum, row) => Number(row.values?.[columnName] ?? 0) + sum, 0),
    [rows, columnName]
  );

  return `${isNaN(total) ? "" : currencyFormatter.format(total)}`;
};
