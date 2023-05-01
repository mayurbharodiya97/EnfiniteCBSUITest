import { MenuItem, TextField } from "@mui/material";
import { useMemo } from "react";

export const SelectColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows, id, multiple },
}) => {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  if (multiple && !Array.isArray(filterValue)) {
    filterValue = [filterValue];
  }
  return (
    <TextField
      value={filterValue ?? ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      fullWidth
      variant="outlined"
      size="small"
      select={true}
      SelectProps={{
        multiple: multiple,
      }}
    >
      <MenuItem key="default" value="">
        All
      </MenuItem>
      {options.map((option: any, i) => (
        <MenuItem key={i} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
};
