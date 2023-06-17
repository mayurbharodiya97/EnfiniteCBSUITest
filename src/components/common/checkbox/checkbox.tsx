import { FC } from "react";
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
  if (excluded) {
    return null;
  }
  console.log(value, "value");
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
    >
      <FormControlLabel
        {...FormControlLabelProps}
        name={name}
        control={
          <Checkbox
            {...others}
            readOnly={readOnly}
            tabIndex={readOnly ? -1 : undefined}
          />
        }
        onChange={handleChange}
        label={label}
        checked={Boolean(value)}
      />

      {!isSubmitting && isError ? (
        <FormHelperText {...FormHelperTextProps}>{error}</FormHelperText>
      ) : null}
    </FormControl>
  );
  console.log("result", result);
  if (Boolean(!enableGrid)) {
    return (
      <Grid style={{ alignSelf: "center" }} {...GridProps} key={fieldKey}>
        {result}
      </Grid>
    );
  } else {
    return result;
  }
};

export default MyCheckbox;
