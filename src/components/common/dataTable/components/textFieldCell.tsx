import { useContext } from "react";
import { RowContext } from "./rowContext";
import { DefaultCell } from "./defaultCell";
import { TextField } from "@mui/material";

/* eslint-disable  no-self-compare */

export const TextFieldCell = (props) => {
  const {
    column: { id: columnName, type, clearFields, maxLength = NaN },
    row: { id },
    currentEditRow,
  } = props;
  if (currentEditRow === id) {
    return (
      <MyTextField
        key={columnName}
        columnName={columnName}
        type={type ?? "text"}
        clearFields={clearFields}
        maxLength={maxLength}
      />
    );
  } else {
    return <DefaultCell {...props} />;
  }
};

export const MyTextField = ({ columnName, type, clearFields, maxLength }) => {
  const { error, setCellValue, currentRow, touched, setCellTouched } =
    useContext(RowContext);

  return (
    <TextField
      type={type}
      value={currentRow?.[columnName]}
      size="small"
      variant="outlined"
      onChange={(e) => {
        if (maxLength !== maxLength || e.target.value.length <= maxLength) {
          setCellValue({ [columnName]: e.target.value, ...clearFields });
        }
      }}
      helperText={touched?.[columnName] && error?.[columnName]}
      error={Boolean(touched?.[columnName]) && Boolean(error?.[columnName])}
      onBlur={() => setCellTouched({ [columnName]: true })}
      fullWidth
    />
  );
};
