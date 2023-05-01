import Checkbox from "@material-ui/core/Checkbox";

export const useCheckboxColumn = (visible) => (hooks) => {
  if (Boolean(visible)) {
    hooks.visibleColumns.push((columns) => [
      {
        id: "selectionCheckbox",
        Header: CheckboxHeaderRenderer,
        Cell: CheckboxCellRenderer,
        minWidth: 25,
        width: 25,
        maxWidth: 25,
        sticky: true,
        Footer: () => (
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              paddingRight: "10px",
            }}
          >
            Total
          </span>
        ),
      },
      ...columns,
    ]);
  }
};

const CheckboxCellRenderer = ({ row }) => {
  return (
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
