import { useMemo } from "react";

export const FooterCell = ({
  rows,
  column: { id: columnName, isDisplayTotal = false, totalDecimalCount, isSelectedTotal = false },
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
  // Filter rows where isSelected is true
  const selectData = rows.filter((row) => row.isSelected)
  // Compute total for selected rows
  const totalForSelected = useMemo(
    () =>
      selectData.reduce(
        (sum, row) => Number(row.values?.[columnName] ?? 0) + sum,
        0
      ),
    [selectData, columnName]
  );
  const formattedTotal = isNaN(total)
    ? ""
    : totalDecimalCount
      ? total.toFixed(totalDecimalCount)
      : total;

  const formattedTotalForSelected = isNaN(totalForSelected)
    ? ""
    : totalDecimalCount
      ? totalForSelected.toFixed(totalDecimalCount)
      : totalForSelected;

  // Return both totals based on conditions
  return (
    <>
      {isDisplayTotal && formattedTotal !== "" && (
        <span style={{ margin: "10px" }}>
          Total: {formattedTotal}
        </span>
      )}
      {isSelectedTotal && formattedTotalForSelected !== "" && (
        <span style={{ margin: "10px" }}>
          Selected Total: {formattedTotalForSelected}
        </span>
      )}
    </>
  );
};
