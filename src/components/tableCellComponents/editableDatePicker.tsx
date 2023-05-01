import FormHelperText from "@material-ui/core/FormHelperText";
import { useState, useEffect } from "react";
import { CellWrapper } from "./cellWrapper";
import {
  ThemeProvider,
  unstable_createMuiStrictModeTheme,
} from "@material-ui/core/styles";
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { theme2 } from "app/audit/theme";

const themeObj = unstable_createMuiStrictModeTheme(theme2);
export const EditableDatePicker = (props) => {
  const {
    value: initialValue,
    rows,
    row: { index, original },
    column: { id, options, validation, requestProps, dateFormat },
    updateGridData,
    gridProps,
    hiddenFlag,
    loading,
  } = props;
  const externalTouched = Boolean(original?._touched?.[id]);
  const externalError = original?._error?.[id] ?? "";
  const [loadingcall, setLoading] = useState(false);
  const [value, setValue] = useState(initialValue);

  const prevRows = rows
    .slice(0, index)
    .map((one) => one?.original)
    .filter((one) => Boolean(one[hiddenFlag]) !== true);

  const nextRows = rows
    .slice(index + 1)
    .map((one) => one?.original)
    .filter((one) => Boolean(one[hiddenFlag]) !== true);

  const onChange = (date) => {
    //console.log("e.target.value", e.target.checked);
    setValue(date);
    //onBlur();
  };

  const onBlur = () => {
    setLoading(true);
    validation(value, original, prevRows, nextRows).then((result) => {
      setLoading(false);
      updateGridData(index, id, value, true, result);
    });
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  return (
    <CellWrapper showBorder {...props}>
      <ThemeProvider theme={themeObj}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            format={dateFormat ?? "dd/MM/yyyy HH:mm:ss"}
            KeyboardButtonProps={{
              "aria-label": "Select Date",
            }}
            name={id}
            onChange={onChange}
            value={value}
            InputLabelProps={{ shrink: true }}
            color="primary"
            autoComplete="off"
            autoOk={true}
            showTodayButton={true}
            onBlur={onBlur}
            disabled={loadingcall || loading}
            // error={Boolean(externalTouched) && Boolean(externalError)}
          />
        </MuiPickersUtilsProvider>
      </ThemeProvider>
      {Boolean(externalTouched) && Boolean(externalError) ? (
        <FormHelperText style={{ whiteSpace: "break-spaces" }} error={true}>
          {externalError}
        </FormHelperText>
      ) : null}
    </CellWrapper>
  );
};
