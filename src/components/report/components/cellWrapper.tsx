import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import ArrowRightSharpIcon from "@material-ui/icons/ArrowRightSharp";
import ArrowDropDownSharpIcon from "@material-ui/icons/ArrowDropDownSharp";

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
