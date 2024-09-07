import { useMemo } from "react";

const renderStyle = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

export const DefaultFooterCell = ({
  rows,
  column: { id: columnName, footerRenderStyle },
}) => {
  const total = useMemo(
    () =>
      rows.reduce((sum, row) => Number(row.values?.[columnName] ?? 0) + sum, 0),
    [rows, columnName]
  );
  let renderResult = isNaN(total) ? "" : total;
  if (footerRenderStyle === "currency") {
    renderResult = renderStyle.format(total);
  }
  return (
    <span
      style={{
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {renderResult}
    </span>
  );
};
