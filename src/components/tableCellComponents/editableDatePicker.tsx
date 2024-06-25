import FormHelperText from "@mui/material/FormHelperText";
import { useState, useEffect, useMemo, useContext } from "react";
import { CellWrapper } from "./cellWrapper";
import {
  ThemeProvider,
  unstable_createMuiStrictModeTheme,
} from "@mui/material/styles";
// import DateFnsUtils from "@date-io/date-fns";
// import {
//   KeyboardDatePicker,
//   MuiPickersUtilsProvider,
// } from "@material-ui/pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { theme2 } from "app/audit/theme";
import { KeyboardDatePicker } from "components/styledComponent/datetime";
import { makeStyles } from "@mui/styles";
import { CustomPropertiesConfigurationContext } from "components/propertiesconfiguration/customPropertiesConfig";
const useStyles = makeStyles({
  root: {
    "& .MuiInputBase-root.MuiOutlinedInput-root input": {
      padding: "8px 7px",
    },
    "& .css-1sizj2k-MuiInputBase-root-MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
      {
        borderColor: "rgba(0, 0, 0, 0.23)",
      },
  },
});
const themeObj = unstable_createMuiStrictModeTheme(theme2);

export const EditableDatePicker = (props) => {
  const classes = useStyles();
  const customParameter = useContext(CustomPropertiesConfigurationContext);

  const {
    dynamicAccountNumberField,
    dynamicAmountSymbol,
    dynamicAmountGroupStyle,
    decimalCount,
    commonDateFormat,
    commonDateTimeFormat,
  } = customParameter;
  const {
    value: initialValue,
    rows,
    row: { index, original },
    column: { id, validation, dateFormat, mindate, isReadOnly, __EDIT__ },
    updateGridData,
    hiddenFlag,
    loading,
  } = props;
  const externalTouched = Boolean(original?._touched?.[id]);
  const externalError = original?._error?.[id] ?? "";
  const [loadingcall, setLoading] = useState(false);
  const [value, setValue] = useState(initialValue);

  const isReadOnlyLocal = useMemo(() => {
    if (original?._isNewRow === true) {
      return false;
    }
    if (isReadOnly) {
      return true;
    }
    if (original?._isNewRow === false && __EDIT__?.isReadOnly === true) {
      return true;
    }
    return false;
  }, [isReadOnly, original?._isNewRow, __EDIT__]);

  const prevRows = rows
    .slice(0, index)
    .map((one) => one?.original)
    .filter((one) => Boolean(one[hiddenFlag]) !== true);

  const nextRows = rows
    .slice(index + 1)
    .map((one) => one?.original)
    .filter((one) => Boolean(one[hiddenFlag]) !== true);

  const onChange = (date) => {
    setValue(date);
    // setLoading(true);
    validation(date, original, prevRows, nextRows).then((result) => {
      // setLoading(false);
      updateGridData(index, id, date, true, result);
    });
  };

  const onBlur = () => {
    setLoading(true);
    validation(value, original, prevRows, nextRows).then((result) => {
      setLoading(false);
      updateGridData(index, id, value, true, result);
    });
  };

  useEffect(() => {
    let initialDate = initialValue;
    if (!initialDate) {
      initialDate = new Date();
    }
    setValue(initialDate);
  }, [initialValue]);

  useEffect(() => {
    onBlur();
  }, []);

  return (
    <CellWrapper showBorder {...props}>
      <ThemeProvider theme={themeObj}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <KeyboardDatePicker
            format={
              (Boolean(dateFormat) ? dateFormat : commonDateFormat) ||
              "dd/MM/yyyy"
            }
            onChange={onChange}
            className={classes.root}
            value={new Date(value)}
            disabled={loadingcall || loading || isReadOnlyLocal}
            readOnly={isReadOnlyLocal}
            minDate={mindate || new Date("1900-01-01")}
            disablePast
            // error={Boolean(externalTouched) && Boolean(externalError)}
            slotProps={{
              textField: {
                onBlur,
                "aria-label": "Select Date",
                name: id,
                autoComplete: "off",
                InputLabelProps: { shrink: true },
                InputProps: { disableUnderline: true },
              },
              actionBar: {
                actions: ["today", "accept", "cancel"],
              },
            }}
          />
        </LocalizationProvider>
      </ThemeProvider>
      {Boolean(externalTouched) && Boolean(externalError) ? (
        <FormHelperText style={{ whiteSpace: "break-spaces" }} error={true}>
          {externalError}
        </FormHelperText>
      ) : null}
    </CellWrapper>
  );
};
