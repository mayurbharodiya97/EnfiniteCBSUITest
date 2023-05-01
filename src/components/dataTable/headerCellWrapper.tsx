import { TableCell } from "@mui/material";

export const HeaderCellWrapper = ({ column, children }) => {
  const stickyHeaderCell =
    column.sticky === true
      ? {
          position: "sticky",
          background: "white",
          left: column.totalLeft,
          zIndex: 12,
        }
      : {};
  return (
    <TableCell
      component="div"
      variant="head"
      {...column.TableCellProps}
      {...column.getHeaderProps([
        {
          style: {
            position: "relative",
            display: "flex",
            padding: "0px 10px",
            lineHeight: "34px",
            ...stickyHeaderCell,
          },
        },
      ])}
    >
      {children}
      {/* {console.log(children)} */}
    </TableCell>
  );
};
