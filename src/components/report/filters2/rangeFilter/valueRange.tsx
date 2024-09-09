import { useState, useEffect } from "react";
import { InputLabel } from "components/styledComponent/inputLabel";
import { Input } from "components/styledComponent/input";
import { FormControl, FormHelperText, Grid } from "@mui/material";

export const ValueRange = ({
  filterValue,
  id,
  columnName,
  gridProps,
  dispatch,
}) => {
  const [minValue, setMinValue] = useState(
    Array.isArray(filterValue?.value) ? filterValue?.value[0] ?? 0 : 0
  );
  const [maxValue, setMaxValue] = useState(
    Array.isArray(filterValue?.value) ? filterValue?.value[1] ?? 0 : 0
  );
  const [error, setError] = useState("");
  useEffect(() => {
    if (Number(minValue) > Number(maxValue)) {
      setError("Min value is greater than max");
    } else {
      setError("");
    }
  }, [minValue, maxValue]);

  const handleBlur = (e) => {
    if (e.currentTarget.contains(e.relatedTarget)) {
      return;
    }
    if (
      !isNaN(Number(minValue)) &&
      !isNaN(Number(maxValue)) &&
      minValue <= maxValue
    ) {
      dispatch({
        type: "setValue",
        payload: {
          condition: "between",
          value: [minValue, maxValue],
          id,
          columnName,
        },
      });
    } else {
      dispatch({
        type: "removeValue",
        payload: {
          id,
        },
      });
    }
  };
  return (
    <Grid item xs={12} sm={6} md={6} {...gridProps}>
      <FormControl
        fullWidth={true}
        error={Boolean(error)}
        tabIndex={1}
        onBlur={handleBlur}
      >
        <InputLabel shrink={true}>{columnName}</InputLabel>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Input
            style={{ width: "45%" }}
            placeholder="min"
            value={minValue}
            onChange={(e) => {
              if (!isNaN(Number(e.target.value))) {
                setMinValue(e.target.value);
              }
            }}
          />
          <Input
            style={{ width: "45%" }}
            placeholder="max"
            value={maxValue}
            onChange={(e) => {
              if (!isNaN(Number(e.target.value))) {
                setMaxValue(e.target.value);
              }
            }}
          />
        </div>
        {Boolean(error) ? <FormHelperText>{error}</FormHelperText> : null}
      </FormControl>
    </Grid>
  );
};
