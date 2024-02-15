import { FC, useRef, useEffect } from "react";
import { useField, UseFieldHookProps } from "packages/form";
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
  //disableTimestamp,
  ...others
}) => {
  const classes = useStyles();

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
    if (typeof value === "string") {
      let result = new Date(value);
      //@ts-ignore
      if (!isNaN(result)) {
        handleChange(result);
      }
    }
  }, [value, handleChange]);
  const focusRef = useRef();
  // console.log("<<focusRef", isFieldFocused);

  useEffect(() => {
    // console.log("<<isFieldFocused", isFieldFocused);
    if (isFieldFocused) {
      //@ts-ignore
      setTimeout(() => {
        //@ts-ignore
        focusRef?.current?.focus?.();
      }, 1);
    }
  }, [isFieldFocused]);
  useEffect(() => {
    if (incomingMessage !== null && typeof incomingMessage === "object") {
      const { value } = incomingMessage;
      if (Boolean(value) || value === "") {
        handleChange(value);
        if (whenToRunValidation === "onBlur") {
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
        className={classes.root}
        id={fieldKey}
        label={label}
        name={name}
        value={
          value === ""
            ? null
            : utilFunction.isValidDate(value)
            ? new Date(value)
            : null
        } //make sure to pass null when input is empty string
        error={!isSubmitting && isError}
        helperText={!isSubmitting && isError ? error : null}
        //@ts-ignore
        onChange={handleChange}
        sx={{ background: Boolean(readOnly) ? "#e7e5e563" : "" }}
        slots={{
          textField: TextField,
        }}
        slotProps={{
          textField: {
            fullWidth: true,
            error: !isSubmitting && isError,
            helperText: !isSubmitting && isError ? error : null,
            onBlur: handleBlur,
            InputLabelProps: { shrink: true },
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
