import { Checkbox, TableCell } from "@mui/material";

export const useCheckboxColumn = (allowRowSelection) => (hooks) => {
  if (Boolean(allowRowSelection)) {
    hooks.visibleColumns.push((columns) => [
      {
        id: "selectionCheckbox",
        Header: CheckboxHeaderRenderer,
        Cell: CheckboxCellRenderer,
        minWidth: 40,
        width: 40,
        maxWidth: 40,
        //sticky: true,
      },
      ...columns,
    ]);
  }
};

const CheckboxCellRenderer = ({ row, cell }) => {
  return (
    <TableCell
      component="div"
      variant="head"
      {...cell.getCellProps([
        {
          style: {
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            padding: "0px 10px",
            lineHeight: "34px",
          },
        },
      ])}
    >
      <Checkbox
        size="small"
        {...row.getToggleRowSelectedProps([
          {
            style: {
              padding: 0,
              color: "var(--theme-color1)",
            },
          },
        ])}
      />
    </TableCell>
  );
};

const CheckboxHeaderRenderer = ({ getToggleAllRowsSelectedProps }) => {
  return (
    <Checkbox
      size="small"
      {...getToggleAllRowsSelectedProps([
        { style: { padding: 0, color: "var(--theme-color1)" } },
      ])}
    />
  );
};
