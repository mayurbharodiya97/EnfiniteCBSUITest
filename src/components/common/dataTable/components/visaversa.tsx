import { useContext, useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import NumberFormat from "react-number-format";
import { RowContext } from "./rowContext";

let currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

function NumberFormatCustom(props) {
  const { inputRef, onChange, FormatProps, setChange, side, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onChange={(e) => {
        setChange(side);
      }}
      onValueChange={(values) => {
        onChange(
          {
            target: {
              value: values.value,
              formattedValue: values.formattedValue,
            },
          },
          values.formattedValue
        );
      }}
      {...FormatProps}
    />
  );
}

export const DefaultCell = ({ value }) => {
  return (
    <Typography
      component="span"
      variant="subtitle2"
      style={{ whiteSpace: "nowrap" }}
    >
      {currencyFormatter.format(value)}
    </Typography>
  );
};

export const VisaversaCell = (props) => {
  const {
    column: { id: columnName, ViceVersaProps, clearFields },
    row: { id },
    currentEditRow,
  } = props;

  if (currentEditRow === id) {
    return (
      <Visaversa
        columnName={columnName}
        clearFields={clearFields}
        {...ViceVersaProps}
      />
    );
  } else {
    return (
      <DefaultCell {...props} displayStyle={ViceVersaProps.leftAdornment} />
    );
  }
};

const defaultTransform = (value, dependentValue) => value;

export const Visaversa = ({
  columnName,
  rightTransform = defaultTransform,
  leftTransform = defaultTransform,
  //leftAdornment = "",
  //rightAdornment = "",
  dependentField,
  //clearFields,
  leftFormatProps,
  rightFormatProps,
}) => {
  const { error, setCellValue, currentRow, touched, setCellTouched } =
    useContext(RowContext);
  const [computedValue, setComputedValue] = useState("");
  const [change, setChange] = useState("");
  /* eslint-disable  react-hooks/exhaustive-deps */
  useEffect(() => {
    let result = rightTransform(
      currentRow?.[columnName],
      currentRow?.[dependentField]
    );
    setComputedValue(result);
    setCellTouched({ [columnName]: true });
  }, []);

  let cellValue = currentRow?.[columnName];

  useEffect(() => {
    if (cellValue === "") {
      setComputedValue("");
    }
  }, [cellValue]);

  const handleLeftChange = (e) => {
    let value = e?.target?.value ?? e;
    setCellValue({ [columnName]: value });
  };

  const transformLeft = () => {
    if (change !== "left") {
      return;
    }
    let result = rightTransform(
      currentRow?.[columnName],
      currentRow?.[dependentField]
    );
    setComputedValue(result);
  };

  const transformRight = () => {
    if (change !== "right") {
      return;
    }
    let result = leftTransform(computedValue, currentRow?.[dependentField]);
    setCellValue({ [columnName]: result });
  };

  const handleRightChange = (e) => {
    let value = e?.target?.value ?? e;
    setComputedValue(value);
  };

  return (
    <div style={{ display: "flex" }}>
      <TextField
        key="left"
        value={currentRow?.[columnName]}
        onChange={handleLeftChange}
        onBlur={transformLeft}
        helperText={touched?.[columnName] && error?.[columnName]}
        error={Boolean(touched?.[columnName]) && Boolean(error?.[columnName])}
        size="small"
        variant="outlined"
        InputProps={{
          //@ts-ignore
          inputComponent: NumberFormatCustom,
          inputProps: {
            FormatProps: leftFormatProps,
            setChange: setChange,
            side: "left",
          },
        }}
        fullWidth
      />
      <div style={{ padding: "0px 4px" }} />
      <TextField
        key="right"
        value={computedValue}
        onChange={handleRightChange}
        onBlur={transformRight}
        size="small"
        variant="outlined"
        InputProps={{
          //@ts-ignore
          inputComponent: NumberFormatCustom,
          inputProps: {
            FormatProps: rightFormatProps,
            setChange: setChange,
            side: "right",
          },
        }}
        fullWidth
      />
    </div>
  );
};
