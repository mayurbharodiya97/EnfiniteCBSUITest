import { FC, useRef, useEffect } from "react";
import { useField, UseFieldHookProps } from "packages/form";
import { KeyboardDatePicker } from "components/styledComponent/datetime";
import { Omit, Merge } from "../types";
import { theme2 } from "app/audit/theme";
import "./style.css";
import { unstable_createMuiStrictModeTheme } from "@mui/material/styles";
import { Button, Grid, GridProps } from "@mui/material";
import { DatePickerProps } from "@mui/lab/DatePicker";

const themeObj: any = unstable_createMuiStrictModeTheme(theme2);

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
  //@ts-ignore
  isFieldFocused,
  InputProps,
  inputProps,
  runValidationOnDependentFieldsChange,
  skipValueUpdateFromCrossFieldWhenReadOnly,
  //disableTimestamp,
  ...others
}) => {
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
  } = useField({
    name: fieldName,
    fieldKey: fieldID,
    dependentFields,
    validate,
    //uncomment this line if there is any issue while validating
    validationRun: "onChange",
    //validationRun,
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
  useEffect(() => {
    if (isFieldFocused) {
      //@ts-ignore
      setTimeout(() => {
        //@ts-ignore
        focusRef?.current?.focus?.();
      }, 1);
    }
  }, [isFieldFocused]);
  const isError = touched && (error ?? "") !== "";

  if (excluded) {
    return null;
  }
  const result = (
    // <ThemeProvider theme={themeObj}>
    <KeyboardDatePicker
      {...others}
      key={fieldKey}
      id={fieldKey}
      name={name}
      value={value === "" ? null : value} //make sure to pass null when input is empty string
      error={!isSubmitting && isError}
      helperText={!isSubmitting && isError ? error : null}
      //@ts-ignore
      onChange={handleChange}
      tabIndex={readOnly ? -1 : undefined}
      onBlur={handleBlur}
      // allowKeyboardControl={true}
      //option 2 if validationRun: "onChange" is not set, uncomment this code
      // onClose={() => {
      //   setTimeout(() => {
      //     //@ts-ignore
      //     focusRef?.current?.focus?.();
      //   }, 1);
      // }}
      disabled={isSubmitting}
      InputLabelProps={{
        shrink: true,
      }}
      autoOk={true}
      readOnly={readOnly}
      // inputRef={focusRef}
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
