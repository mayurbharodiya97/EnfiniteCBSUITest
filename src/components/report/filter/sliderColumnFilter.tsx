import { Slider } from "@mui/material";
import { useMemo } from "react";

export const SliderColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows, id },
}) => {
  // Calculate the min and max
  // using the preFilteredRows

  const [min, max] = useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    preFilteredRows.forEach((row) => {
      min = Math.min(row.values[id], min);
      max = Math.max(row.values[id], max);
    });
    return [min, max];
  }, [id, preFilteredRows]);

  return (
    <Slider
      min={min}
      max={max}
      value={filterValue || min}
      onChange={(e, value) => {
        //@ts-ignore
        setFilter(parseInt(value));
      }}
    />
  );
};
