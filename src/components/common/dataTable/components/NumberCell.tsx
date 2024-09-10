import { useContext } from "react";
import { NumberFormatCustom } from "components/derived/numberFormat";
import { TextFieldForSelect as TextField } from "components/styledComponent/textfield";
import { RowContext } from "./rowContext";
import { numWords } from "components/common/utils";
import { Typography } from "@mui/material";

let currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

export const DisplayCell = ({ value, displayStyle }) => {
  let finalNode = "-";
  if (!isNaN(value)) {
    switch (displayStyle) {
      case "currency":
        finalNode = currencyFormatter.format(value);
        break;
      case "percentage":
        finalNode = `${value}%`;
        break;
      case "squareFeet":
        finalNode = new Intl.NumberFormat().format(value);
        break;
      default:
        finalNode = value;
    }
  }
  return (
    <Typography
      component="span"
      variant="subtitle2"
      style={{ whiteSpace: "nowrap" }}
    >
      {finalNode}
    </Typography>
  );
};

export const NumberCell = (props) => {
  const {
    column: {
      id: columnName,
      FormatProps,
      formattedValue,
      displayStyle,
      clearFields,
      enableNumWords,
    },
    row: { id },
    currentEditRow,
  } = props;
  if (currentEditRow === id) {
    return (
      <CurrencyInput
        key={columnName}
        columnName={columnName}
        FormatProps={FormatProps}
        formattedValue={formattedValue}
        clearFields={clearFields}
        enableNumWords={enableNumWords}
      />
    );
  } else {
    return <DisplayCell {...props} displayStyle={displayStyle} />;
  }
};

export const CurrencyInput = ({
  columnName,
  FormatProps,
  formattedValue,
  clearFields,
  enableNumWords,
}) => {
  const { error, setCellValue, currentRow, touched, setCellTouched } =
    useContext(RowContext);

  let numWordsVar: any = null;
  try {
    if (enableNumWords && Boolean(currentRow?.[columnName])) {
      let amountArray = String(currentRow?.[columnName]).split(".");
      let amountPart = Number(amountArray[0]);
      if (amountPart < 0) {
        amountPart = Math.abs(Number(amountPart));
        numWordsVar = `Negative ${numWords(amountPart)} Rupees`;
      } else {
        numWordsVar = `${numWords(amountPart)} Rupees`;
      }
      if (amountArray.length === 2 && Boolean(amountArray[1])) {
        numWordsVar = `${numWordsVar} and ${numWords(amountArray[1])} paise`;
      }
    }
  } catch (e) {}

  return (
    <TextField
      value={currentRow?.[columnName]}
      onChange={(e) =>
        setCellValue({ [columnName]: e.target.value, ...clearFields })
      }
      helperText={
        Boolean(error?.[columnName]) ? error?.[columnName] : numWordsVar
      }
      error={Boolean(touched?.[columnName]) && Boolean(error?.[columnName])}
      onBlur={() => setCellTouched({ [columnName]: true })}
      InputLabelProps={{ shrink: true }}
      size="small"
      fullWidth
      margin="none"
      InputProps={{
        //@ts-ignore
        inputComponent: NumberFormatCustom,
        inputProps: {
          FormatProps: { ...FormatProps, formattedValue },
        },
      }}
    />
  );
};
