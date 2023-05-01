import Checkbox from "@material-ui/core/Checkbox";
import TableCell from "@material-ui/core/TableCell";

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
    <>
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
        {Boolean(row?.original?.__isRowSelection ?? true) ? (
          <Checkbox
            size="small"
            {...row.getToggleRowSelectedProps([
              {
                style: {
                  padding: 0,
                },
              },
            ])}
          />
        ) : null}
      </TableCell>
    </>
  );
};

const CheckboxHeaderRenderer = ({ getToggleAllRowsSelectedProps }) => {
  return (
    <Checkbox
      size="small"
      {...getToggleAllRowsSelectedProps([{ style: { padding: 0 } }])}
    />
  );
};
