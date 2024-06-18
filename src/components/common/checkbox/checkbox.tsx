import { FC, useCallback, useEffect } from "react";
import { useField, UseFieldHookProps } from "packages/form";
import { Checkbox } from "components/styledComponent/checkbox";
import { Merge } from "../types";
import {
  CheckboxProps,
  FormControl,
  FormControlLabel,
  FormControlLabelProps,
  FormControlProps,
  FormHelperText,
  FormHelperTextProps,
  Grid,
  GridProps,
} from "@mui/material";

interface extendedFiledProps extends UseFieldHookProps {
  label: string;
}

type MyCheckboxMixedProps = Merge<CheckboxProps, extendedFiledProps>;

interface MyCheckboxExtendedProps {
  FormControlLabelProps?: FormControlLabelProps;
  FormControlProps?: FormControlProps;
  FormHelperTextProps?: FormHelperTextProps;
  GridProps?: GridProps;
  enableGrid: boolean;
}

export type MyCheckboxAllProps = Merge<
  MyCheckboxMixedProps,
  MyCheckboxExtendedProps
>;

const MyCheckbox: FC<MyCheckboxAllProps> = ({
  name: fieldName,
  validate,
  validationRun,
  shouldExclude,
  isReadOnly,
  postValidationSetCrossFieldValues,
  runPostValidationHookAlways,
  dependentFields,
  fieldKey: fieldID,
  label,
  FormControlProps,
  FormHelperTextProps,
  FormControlLabelProps,
  GridProps,
  enableGrid,
  runValidationOnDependentFieldsChange,
  skipValueUpdateFromCrossFieldWhenReadOnly,
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
    incomingMessage,
    whenToRunValidation,
    runValidation,
  } = useField({
    name: fieldName,
    fieldKey: fieldID,
    dependentFields,
    validate,
    validationRun,
    runPostValidationHookAlways,
    postValidationSetCrossFieldValues,
    isReadOnly,
    shouldExclude,
    runValidationOnDependentFieldsChange,
    skipValueUpdateFromCrossFieldWhenReadOnly,
  });

  useEffect(() => {
    if (incomingMessage !== null && typeof incomingMessage === "object") {
      const { value } = incomingMessage;
      if (typeof value === "boolean") {
        //console.log("incomingMessage", fieldKey, value);
        handleChange(value);
        if (whenToRunValidation === "onBlur") {
          runValidation({ value: value }, true);
        }
      }
    }
  }, [incomingMessage, handleChange, runValidation, whenToRunValidation]);
  // changes for bhavyata value is gone in array
  const handelChange = useCallback(
    (event) => {
      const { value } = event.target;
      event.target["value"] = typeof value === "boolean" ? value : "";
      handleChange(event);
    },
    [handleChange]
  );

  if (excluded) {
    return null;
  }
  // console.log(value, "value");
  // console.log(!readOnly, "readOnly");
  const isError = touched && (error ?? "") !== "";

  const result = (
    // @ts-ignore
    <FormControl
      {...FormControlProps}
      key={fieldKey}
      component="fieldset"
      disabled={isSubmitting}
      error={!isSubmitting && isError}
      onBlur={handleBlur}
      style={{
        justifyContent: "center",
      }}
    >
      <FormControlLabel
        {...FormControlLabelProps}
        name={name}
        control={
          <Checkbox
            {...others}
            readOnly={readOnly}
            tabIndex={readOnly ? -1 : undefined}
            disabled={readOnly}
          />
        }
        onChange={handelChange}
        label={label}
        checked={Boolean(value)}
      />

      {!isSubmitting && isError ? (
        <FormHelperText {...FormHelperTextProps}>{error}</FormHelperText>
      ) : null}
    </FormControl>
  );
  // if (Boolean(!enableGrid)) {
  //   return (
  //     <Grid style={{ justifyContent: "center" }} {...GridProps} key={fieldKey}>
  //       {result}
  //     </Grid>
  //   );
  // } else {
  //   return result;
  // }
  if (Boolean(enableGrid)) {
    return (
      <Grid {...GridProps} style={{ display: "flex" }}>
        {result}
      </Grid>
    );
  } else {
    return <div style={{ display: "flex" }}>result</div>;
  }
};

export default MyCheckbox;
