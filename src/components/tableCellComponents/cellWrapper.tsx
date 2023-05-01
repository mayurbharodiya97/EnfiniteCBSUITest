import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import ArrowRightSharpIcon from "@material-ui/icons/ArrowRightSharp";
import ArrowDropDownSharpIcon from "@material-ui/icons/ArrowDropDownSharp";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    "&:focus-within": {
      border: "1px solid rgba(25, 118, 210, 0.5)",
    },
    borderLeft: "0.5px solid #BABABA",
    borderRight: "0.5px solid #BABABA",
  },
});

export const CellWrapper = ({
  children,
  showBorder,
  positionRelative,
  ...others
}) => {
  const {
    value,
    cell,
    column: {
      color = "initial",
      TableCellProps,
      isVisibleField = (data) => {
        return true;
      },
    },
    row,
  } = others;

  const classes = useStyles();
  let myColor = typeof color === "function" ? color(value, row) : color;
  let result = children;
  let isVisibleData = isVisibleField(row?.original);
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
      className={showBorder ? classes.root : ""}
      {...cell.getCellProps([
        { ...(TableCellProps ?? {}) },
        {
          style: {
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            padding: "0px 10px",
            lineHeight: "34px",
            color: myColor,
            position: positionRelative ? "relative" : "static",
          },
        },
      ])}
    >
      {isVisibleData ? result : null}
    </TableCell>
  );
};
