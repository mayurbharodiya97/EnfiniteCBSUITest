import TextField from "@material-ui/core/TextField";

export const DefaultColumnFilter = ({
  column: { filterValue, preFilteredRows, setFilter },
}) => {
  const count = preFilteredRows.length;

  return (
    <TextField
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      fullWidth
      size="small"
      variant="outlined"
      placeholder={`Search ${count} records...`}
    />
  );
};
