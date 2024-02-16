import { FC, useRef, useEffect } from "react";
import { useField, UseFieldHookProps } from "packages/form";
import { KeyboardDateTimePicker } from "components/styledComponent/datetime";

import { Omit, Merge } from "../types";
import { Grid, GridProps, InputLabel } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { DateTimePickerProps } from "@mui/lab/DateTimePicker";
import { utilFunction } from "components/utils";
import { TextField } from "components/styledComponent";

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

type KeyboardDateTimePickerPropsSubset = Omit<
  DateTimePickerProps<any>,
  "onChange" | "value"
>;

interface MyGridExtendedProps {
  GridProps?: GridProps;
  enableGrid: boolean;
}

export type MyDateTimePickerAllProps = Merge<
  Merge<KeyboardDateTimePickerPropsSubset, MyGridExtendedProps>,
  UseFieldHookProps
>;

export const MyDateTimePicker: FC<MyDateTimePickerAllProps> = ({
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
  label,
  InputProps,
  inputProps,
  runValidationOnDependentFieldsChange,
  skipValueUpdateFromCrossFieldWhenReadOnly,
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
    //uncomment this line if there is any issue while validating
    validationRun,
    // validationRun: "onChange",
    runPostValidationHookAlways,
    postValidationSetCrossFieldValues,
    isReadOnly,
    shouldExclude,
    runValidationOnDependentFieldsChange,
    skipValueUpdateFromCrossFieldWhenReadOnly,
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
  const focusRef: any = useRef();
  useEffect(() => {
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
  const result = (
    <>
      {/* <InputLabel className={classes.labelStyle}>{label}</InputLabel> */}
      <KeyboardDateTimePicker
        {...others}
        key={fieldKey}
        label={label}
        className={classes.root}
        id={fieldKey}
        name={name}
        inputRef={focusRef}
        closeOnSelect={true}
        // orientation={"portrait"}
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
        onBlur={handleBlur}
        onClose={() => {
          setTimeout(() => {
            //@ts-ignore
            focusRef?.current?.focus?.();
          }, 1);
        }}
        disabled={isSubmitting}
        autoOk={true}
        readOnly={readOnly}
        InputProps={{
          readOnly: readOnly,
          ...InputProps,
        }}
        inputProps={{
          tabIndex: readOnly ? -1 : undefined,
          ...inputProps,
        }}
      />
    </>
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

export default MyDateTimePicker;
