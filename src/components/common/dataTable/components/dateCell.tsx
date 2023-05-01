import { useContext } from "react";
import { InputMaskCustom } from "components/derived/inputMask";
import { TextFieldForSelect as TextField } from "components/styledComponent/textfield";
import { RowContext } from "./rowContext";
import Typography from "@material-ui/core/Typography";

export const DisplayCell = ({ value }) => {
  return (
    <Typography
      component="span"
      variant="subtitle2"
      style={{ whiteSpace: "nowrap" }}
    >
      {value}
    </Typography>
  );
};

export const DateCell = (props) => {
  const {
    column: { id: columnName, MaskProps, formattedValue = true, clearFields },
    row: { id },
    currentEditRow,
  } = props;
  if (currentEditRow === id) {
    return (
      <DateInput
        key={columnName}
        columnName={columnName}
        MaskProps={MaskProps}
        formattedValue={formattedValue}
        clearFields={clearFields}
      />
    );
  } else {
    return <DisplayCell {...props} />;
  }
};

export const DateInput = ({
  columnName,
  MaskProps,
  formattedValue,
  clearFields,
}) => {
  const { error, setCellValue, currentRow, touched, setCellTouched } =
    useContext(RowContext);

  return (
    <TextField
      value={currentRow?.[columnName]}
      onChange={(e) =>
        setCellValue({ [columnName]: e.target.value, ...clearFields })
      }
      helperText={touched?.[columnName] ? error?.[columnName] : ""}
      error={Boolean(touched?.[columnName]) && Boolean(error?.[columnName])}
      onBlur={() => setCellTouched({ [columnName]: true })}
      InputLabelProps={{ shrink: true }}
      size="small"
      fullWidth
      margin="none"
      InputProps={{
        //@ts-ignore
        inputComponent: InputMaskCustom,
        inputProps: {
          MaskProps: { ...MaskProps, formattedValue },
        },
      }}
    />
  );
};
