import ArrowRightSharpIcon from "@mui/icons-material/ArrowRightSharp";
import ArrowDropDownSharpIcon from "@mui/icons-material/ArrowDropDownSharp";

import { IconButton, TableCell } from "@mui/material";

export const CellWrapper = ({ children, ...others }) => {
  const {
    value,
    cell,
    column: { color = "initial", TableCellProps },
    row,
  } = others;

  let myColor = typeof color === "function" ? color(value) : color;
  let style = {};
  if (row?.isGrouped && row?.isExpanded) {
    style = { ...style, fontWeight: 800 };
  }
  let result = children;
  if (cell?.isGrouped) {
    result = (
      <>
        <IconButton
          {...row.getToggleRowExpandedProps([{ style: { padding: 0 } }])}
        >
          {row.isExpanded ? (
            <ArrowDropDownSharpIcon />
          ) : (
            <ArrowRightSharpIcon />
          )}
        </IconButton>
        {children}
        <i>({row.subRows.length})</i>
      </>
    );
  } else if (cell?.isPlaceholder) {
    result = null;
  }

  return (
    <TableCell
      component="div"
      variant="head"
      {...cell?.getCellProps?.([
        { ...(TableCellProps ?? {}) },
        {
          style: {
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            padding: "0px 20px 0px 10px",
            lineHeight: "34px",
            color: myColor,
            textAlign: cell?.column?.alignment ?? "unset",
            ...style,
          },
        },
      ])}
    >
      {result}
    </TableCell>
  );
};
