import { Checkbox, TableCell } from "@mui/material";
export const HeaderCellWrapper = ({
  column,
  children,
  SelectAllColumn = false,
}) => {
  const stickyHeaderCell =
    column.sticky === true
      ? {
          position: "sticky",
          background: "white",
          left: column.totalLeft,
          zIndex: 12,
        }
      : {};
  const handleSelectAll = (e) => {
    children?.props?.updateGridData(
      0,
      children?.props?.column?.id,
      e.target.checked,
      true,
      "",
      "A"
    );
  };
  return (
    <TableCell
      component="div"
      variant="head"
      sx={{
        padding: column?.cellHeaderAlinment ? column?.cellHeaderAlinment : null,
      }}
      {...column.TableCellProps}
      {...column.getHeaderProps([
        {
          style: {
            position: "relative",
            display: "flex",
            padding: "0px 10px",
            lineHeight: "34px",
            ...stickyHeaderCell,
            borderBottom: "none",
          },
        },
      ])}
    >
      {SelectAllColumn ? (
        <Checkbox
          style={{ color: "var(--theme-color1)" }}
          onChange={handleSelectAll}
        />
      ) : null}
      {children}
      {/* {console.log(children)} */}
    </TableCell>
  );
};
