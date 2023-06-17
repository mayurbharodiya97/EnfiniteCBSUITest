import { FC, useCallback, useState } from "react";
import { useField, UseFieldHookProps } from "packages/form";
import { Checkbox } from "components/styledComponent/checkbox";
import { Merge, OptionsProps, dependentOptionsFn } from "../types";
import { getLabelFromValues, useOptionsFetcher } from "../utils";
import {
  CheckboxProps,
  CircularProgress,
  CircularProgressProps,
  FormControl,
  FormControlLabel,
  FormControlLabelProps,
  FormControlProps,
  FormGroup,
  FormGroupProps,
  FormHelperText,
  FormHelperTextProps,
  FormLabel,
  FormLabelProps,
  Grid,
  GridProps,
  InputAdornment,
} from "@mui/material";

interface extendedFiledProps extends UseFieldHookProps {
  options: OptionsProps[] | dependentOptionsFn;
  _optionsKey?: string;
  label: string;
}

type MyCheckboxMixedProps = Merge<CheckboxProps, extendedFiledProps>;

interface MyCheckboxExtendedProps {
  FormLabelProps?: FormLabelProps;
  FormGroupProps?: FormGroupProps;
  FormControlLabelProps?: FormControlLabelProps;
  FormControlProps?: FormControlProps;
  FormHelperTextProps?: FormHelperTextProps;
  GridProps?: GridProps;
  enableGrid: boolean;
  CircularProgressProps?: CircularProgressProps;
  disableCaching?: boolean;
}

export type MyCheckboxGroupAllProps = Merge<
  MyCheckboxMixedProps,
  MyCheckboxExtendedProps
>;

const valueExists = (myValue: any[] | any, value: any) => {
  return Array.isArray(myValue) && myValue.indexOf(value) > -1;
};

const MyCheckboxGroup: FC<MyCheckboxGroupAllProps> = ({
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
  options,
  FormControlProps,
  FormLabelProps,
  FormGroupProps,
  FormHelperTextProps,
  FormControlLabelProps,
  GridProps,
  enableGrid,
  runValidationOnDependentFieldsChange,
  skipValueUpdateFromCrossFieldWhenReadOnly,
  CircularProgressProps,
  _optionsKey,
  disableCaching,
  ...others
}) => {
  const {
    formState,
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
    dependentValues,
    incomingMessage,
    runValidation,
    whenToRunValidation,
    setIncomingMessage,
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
  const [_options, setOptions] = useState<OptionsProps[]>([]);

  const getLabelFromValuesForOptions = useCallback(
    (values) => getLabelFromValues(_options)(values),
    [_options]
  );

  const handleChangeInterceptor = useCallback(
    (e) => {
      const value = typeof e === "object" ? e?.target?.value ?? "" : e;
      let result = getLabelFromValuesForOptions(value);
      handleChange(e, result[0] as any);
    },
    [handleChange, getLabelFromValuesForOptions]
  );
  const { loadingOptions } = useOptionsFetcher(
    formState,
    options,
    setOptions,
    handleChangeInterceptor,
    dependentValues,
    incomingMessage,
    runValidation,
    whenToRunValidation,
    _optionsKey,
    disableCaching,
    setIncomingMessage,
    true,
    "",
    false
  );

  if (excluded) {
    return null;
  }
  const isError = touched && (error ?? "") !== "";
  const checkboxes = _options.map((checkbox) => (
    <FormControlLabel
      {...FormControlLabelProps}
      control={
        <Checkbox
          {...others}
          readOnly={readOnly}
          tabIndex={readOnly ? -1 : undefined}
        />
      }
      key={checkbox.value}
      name={name}
      onChange={handleChangeInterceptor}
      label={checkbox.label}
      value={checkbox.value}
      checked={valueExists(value, checkbox.value)}
    />
  ));
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
      <FormLabel {...FormLabelProps} component="label">
        {label}
      </FormLabel>
      <FormGroup {...FormGroupProps}>
        {loadingOptions ? (
          <InputAdornment position="end">
            <CircularProgress
              color="primary"
              variant="indeterminate"
              {...CircularProgressProps}
            />
          </InputAdornment>
        ) : (
          checkboxes
        )}
      </FormGroup>
      {!isSubmitting && isError ? (
        <FormHelperText {...FormHelperTextProps}>{error}</FormHelperText>
      ) : null}
    </FormControl>
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

export default MyCheckboxGroup;
