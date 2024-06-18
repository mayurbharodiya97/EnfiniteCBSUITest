import { Checkbox, TableCell } from "@mui/material";
export const HeaderCellWrapper = ({ column, children,SelectAllColumn = false,rows=[],updateGridData=(rowIndex: number, id: any, isChecked: any, p0: boolean, p1: string)=>{}}) => {
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
        const isChecked = e.target.checked;
        if (column?.Cell?.name === "EditableCheckbox") {
          rows.forEach((row:any,rowIndex) => {
            updateGridData(rowIndex,column?.id,isChecked,true,"");
          });
        }
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
      ) :null}
      {children}
      {/* {console.log(children)} */}
    </TableCell>
  );
};
