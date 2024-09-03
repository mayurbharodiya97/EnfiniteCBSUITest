import { FC, useRef, useEffect, useContext } from "react";
import { useField, UseFieldHookProps ,transformDependentFieldsState } from "packages/form";
import { KeyboardDatePicker } from "components/styledComponent/datetime";
import { Omit, Merge } from "../types";
import { theme2 } from "app/audit/theme";
import "./style.css";
import { unstable_createMuiStrictModeTheme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { Button, Grid, GridProps, InputLabel } from "@mui/material";
import { DatePickerProps } from "@mui/lab/DatePicker";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { utilFunction } from "components/utils";
import { TextField } from "components/styledComponent";
import { usePopupContext } from "components/custom/popupContext";
import { AuthContext } from "pages_audit/auth";
import { geaterThanDate, lessThanDate } from "registry/rulesEngine";
const themeObj: any = unstable_createMuiStrictModeTheme(theme2);

const useStyles: any = makeStyles({
  root: {
    "& .MuiInputBase-root.MuiOutlinedInput-root input": {
      padding: "8px 7px",
    },
    "& .css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
      borderColor: "1px solid #BABABA",
    },
  },

  // labelStyle: {
  //   color: "rgba(0, 0, 0, 0.6)",
  //   fontSize: "0.875rem",
  //   lineHeight: "1.4375em",
  //   fontWeight: "600",
  //   transform: "translate(0, 1.5px) scale(1)",
  //   marginBottom: "8px",
  //   maxWidth: "calc(133% - 32px)",
  // },
});

type KeyboardDatePickerPropsSubset = Omit<
  DatePickerProps<any>,
  "onChange" | "value"
>;

interface MyGridExtendedProps {
  GridProps?: GridProps;
  disableTimestamp?: boolean;
  enableGrid: boolean;
  disablePast?: boolean;
  disableFuture?: boolean;
  isWorkingDate?: boolean;
  isMaxWorkingDate?: boolean;
  isMinWorkingDate?: boolean;
  ignoreInSubmit?: Function | boolean;
}

export type MyDataPickerAllProps = Merge<
  Merge<KeyboardDatePickerPropsSubset, MyGridExtendedProps>,
  UseFieldHookProps
>;
export const MyDatePicker: FC<MyDataPickerAllProps> = ({
  name: fieldName,
  validate,
  validationRun,
  shouldExclude,
  isReadOnly,
  postValidationSetCrossFieldValues,
  runPostValidationHookAlways,
  dependentFields,
  fieldKey: fieldID,
  type,
  GridProps,
  enableGrid,
  fullWidth = false,
  //@ts-ignore
  isFieldFocused,
  label,
  InputProps,
  inputProps,
  runValidationOnDependentFieldsChange,
  skipValueUpdateFromCrossFieldWhenReadOnly,
  isWorkingDate = false,
  setValueOnDependentFieldsChange,
  format,
  ignoreInSubmit = false,
  //disableTimestamp,
  ...others
}) => {
  const classes = useStyles();
  const { authState } = useContext(AuthContext);
  const {
    value,
    error,
    touched,
    handleChange,
    handleBlur,
    isSubmitting,
    fieldKey,
    name,
    excluded,
    readOnly,
    incomingMessage,
    whenToRunValidation,
    runValidation,
    dependentValues,
    setIgnoreInSubmit
  } = useField({
    name: fieldName,
    fieldKey: fieldID,
    dependentFields,
    validate,
    // uncomment this line if there is any issue while validating
    // validationRun: "onChange",
    validationRun,
    runPostValidationHookAlways,
    postValidationSetCrossFieldValues,
    isReadOnly,
    shouldExclude,
    runValidationOnDependentFieldsChange,
    skipValueUpdateFromCrossFieldWhenReadOnly,
    //@ts-ignore
  });


  useEffect(() => {
    if (typeof setValueOnDependentFieldsChange === "function") {
      let result = setValueOnDependentFieldsChange(
        transformDependentFieldsState(dependentValues)
      );
      if (result !== undefined && result !== null) {
        handleChange(result);
      }
    }
  }, [dependentValues, handleChange, setValueOnDependentFieldsChange]);
  // below code added for run validation if max or min date specified in metadata
  useEffect(() => {
    if (geaterThanDate(value, others?.maxDate)) {
      runValidation({ value, _maxDt: others?.maxDate });
    }
    if (lessThanDate(value, others?.minDate)) {
      runValidation({ value, _minDt: others?.minDate });
    }
  }, [value]);
  useEffect(() => {
    if(typeof ignoreInSubmit === "function") {
      let result = ignoreInSubmit(transformDependentFieldsState(dependentValues), { isSubmitting, value })
      setIgnoreInSubmit(result);
    }
    else {
      setIgnoreInSubmit(ignoreInSubmit)
    }
  }, [ignoreInSubmit, dependentValues]);

  useEffect(() => {
    if (typeof value === "string") {
      let result = new Date(value);
      //@ts-ignore
      if (!isNaN(result)) {
        handleChange(result);
      }
    }
  }, [value, handleChange]);

  // chnages for min-max date with Altaf
  useEffect(() => {
    if (geaterThanDate(value, others?.maxDate)) {
      runValidation({ value, _maxDt: others?.maxDate }, true);
    }
    if (lessThanDate(value, others?.minDate)) {
      runValidation({ value, _minDt: others?.minDate }, true);
    }
  }, [value]);

  const focusRef = useRef<any>();
  const getFocus = () => {
    setTimeout(() => {
      focusRef?.current?.focus?.();
    }, 50);
  };

  useEffect(() => {
    if (isFieldFocused) {
      setTimeout(() => {
        focusRef?.current?.focus?.();
      }, 1);
    }
  }, [isFieldFocused]);
  useEffect(() => {
    if (incomingMessage !== null && typeof incomingMessage === "object") {
      const { isFieldFocused, value, ignoreUpdate } = incomingMessage;
      if (isFieldFocused) {
        getFocus();
      }
      if (Boolean(value) || value === "") {
        handleChange(value);
        if (!ignoreUpdate && whenToRunValidation === "onBlur") {
          runValidation({ value: value }, true);
        }
      }
    }
  }, [incomingMessage, handleChange, runValidation, whenToRunValidation]);

  const isError = touched && (error ?? "") !== "";

  if (excluded) {
    return null;
  }

  // console.log(fieldKey, value, touched, isError, error);
  const result = (
    // <ThemeProvider theme={themeObj}>
    <>
      {/* <InputLabel className={classes.labelStyle}>{label}</InputLabel> */}
      <KeyboardDatePicker
        {...others}
        key={fieldKey}
        format={format || "dd/MM/yyyy"}
        // className={classes.root}
        id={fieldKey}
        label={label}
        name={name}
        value={value === "" || value === null ? null : new Date(value)}
        // value={
        //   value === ""
        //     ? null
        //     : utilFunction.isValidDate(value)
        //     ? new Date(value)
        //     : null
        // } //make sure to pass null when input is empty string
        error={!isSubmitting && isError}
        helperText={!isSubmitting && isError ? error : null}
        //@ts-ignore
        onChange={handleChange}
        sx={{
          "& .MuiInputBase-root": {
            background: Boolean(readOnly)
              ? "var(--theme-color7) !important"
              : "",
          },
        }}
        slots={{
          textField: TextField,
        }}
        slotProps={{
          textField: {
            fullWidth: true,
            error: !isSubmitting && isError,
            helperText:
              new Date(value) <= new Date(authState?.minDate)
                ? "Date is out of period"
                : !isSubmitting && isError
                ? error
                : null,
            onBlur: handleBlur,
            InputLabelProps: { shrink: true },
            // add by parag for if you use datepicker component and pass required props, the star will appear at the end (label end)
            required: others.required,
          },
          actionBar: {
            actions: ["today", "accept", "cancel"],
          },
        }}
        tabIndex={readOnly ? -1 : undefined}
        onBlur={handleBlur}
        // allowKeyboardControl={true}
        //option 2 if validationRun: "onChange" is not set, uncomment this code
        onClose={() => {
          setTimeout(() => {
            //@ts-ignore
            focusRef?.current?.focus?.();
          }, 1);
        }}
        disabled={isSubmitting}
        autoOk={true}
        readOnly={readOnly}
        inputRef={focusRef}
        InputProps={{
          readOnly: readOnly,
          ...InputProps,
        }}
        inputProps={{
          tabIndex: readOnly ? -1 : undefined,
          ...inputProps,
        }}
        autoComplete="off"
        cancelLabel={
          <Button
            color="secondary"
            style={{ border: "1px solid rgba(128, 0, 0, 0.23)" }}
            disableElevation
          >
            Cancel
          </Button>
        }
        okLabel={
          <Button color="secondary" variant="contained" disableElevation>
            OK
          </Button>
        }
      />
    </>
    //</ThemeProvider>
  );
  if (Boolean(enableGrid)) {
    return (
      <Grid {...GridProps} key={fieldKey}>
        {result}
      </Grid>
    );
  } else {
    return result;
  }
};

export default MyDatePicker;
