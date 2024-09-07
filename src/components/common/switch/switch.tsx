import { FC } from "react";
import { useField, UseFieldHookProps } from "packages/form";
import { Merge } from "../types";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelProps,
  FormControlProps,
  FormHelperText,
  FormHelperTextProps,
  Grid,
  GridProps,
  Switch,
  SwitchProps,
} from "@mui/material";

interface extendedFiledProps extends UseFieldHookProps {
  label: string;
}

type MySwitchMixedProps = Merge<SwitchProps, extendedFiledProps>;

interface MySwitchExtendedProps {
  FormControlLabelProps?: FormControlLabelProps;
  FormControlProps?: FormControlProps;
  FormHelperTextProps?: FormHelperTextProps;
  GridProps?: GridProps;
  enableGrid: boolean;
}

export type MySwitchAllProps = Merge<MySwitchMixedProps, MySwitchExtendedProps>;

const MySwitch: FC<MySwitchAllProps> = ({
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
    runValidationOnDependentFieldsChange,
    skipValueUpdateFromCrossFieldWhenReadOnly,
    isReadOnly,
    shouldExclude,
  });
  if (excluded) {
    return null;
  }
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
      tabIndex={readOnly ? -1 : undefined}
    >
      <FormControlLabel
        {...FormControlLabelProps}
        name={name}
        control={
          <Switch
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

  if (Boolean(enableGrid)) {
    return <Grid {...GridProps}>{result}</Grid>;
  } else {
    return result;
  }
};

export default MySwitch;
