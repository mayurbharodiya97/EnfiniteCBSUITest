import { FC, useCallback, useState } from "react";
import { useField, UseFieldHookProps } from "packages/form";
import { Merge, OptionsProps } from "../types";
import { getLabelFromValues, useOptionsFetcher } from "../utils";
import {
  CircularProgress,
  CircularProgressProps,
  FormControl,
  FormControlLabel,
  FormControlLabelProps,
  FormControlProps,
  FormHelperText,
  FormHelperTextProps,
  FormLabel,
  FormLabelProps,
  Grid,
  GridProps,
  InputAdornment,
  Radio,
  RadioGroup,
  RadioGroupProps,
  RadioProps,
} from "@mui/material";

import { withStyles } from "@mui/styles";

interface extendedFiledProps extends UseFieldHookProps {
  options: OptionsProps[];
  _optionsKey?: string;
  disableCaching?: boolean;
  label: string;
}

type MyRadioMixedProps = Merge<RadioProps, extendedFiledProps>;

interface MyCheckboxExtendedProps {
  FormLabelProps?: FormLabelProps;
  RadioGroupProps?: RadioGroupProps;
  FormControlLabelProps?: FormControlLabelProps;
  FormControlProps?: FormControlProps;
  FormHelperTextProps?: FormHelperTextProps;
  GridProps?: GridProps;
  enableGrid: boolean;
  CircularProgressProps?: CircularProgressProps;
}

export type MyRadioAllProps = Merge<MyRadioMixedProps, MyCheckboxExtendedProps>;

const StyledRadioField = withStyles({
  root: {
    "& .MuiFormLabel-root": {
      //color: "#736f6f",
      fontWeight: 600,
      textTransform: "capitalize",
      fontSize: "1rem",
      "@media (max-width: 1200px)": {
        fontSize: "0.75rem",
      },
      "@media (max-width: 1440px)": {
        fontSize: "0.875rem",
      },
    },
    "& label.Mui-focused": {
      //color: "#26A456",
      color: "var(--theme-color1)",
    },
  },
})(FormControl);

const MyRadio: FC<MyRadioAllProps> = ({
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
  RadioGroupProps,
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
  const radios = _options.map((radio) => (
    <FormControlLabel
      {...FormControlLabelProps}
      control={
        <Radio
          {...others}
          readOnly={readOnly}
          tabIndex={readOnly ? -1 : undefined}
          color={"secondary"}
        />
      }
      key={radio.value}
      label={radio.label}
      value={radio.value}
    />
  ));
  const result = (
    // @ts-ignore
    <StyledRadioField
      {...FormControlProps}
      key={fieldKey}
      //@ts-ignore
      component="fieldset"
      disabled={isSubmitting}
      error={!isSubmitting && isError}
      onBlur={handleBlur}
    >
      <FormLabel {...FormLabelProps} component="label">
        {label}
      </FormLabel>
      <RadioGroup
        {...RadioGroupProps}
        onChange={handleChangeInterceptor}
        name={name}
        value={value}
      >
        {loadingOptions ? (
          <InputAdornment position="end">
            <CircularProgress
              color="primary"
              variant="indeterminate"
              {...CircularProgressProps}
            />
          </InputAdornment>
        ) : (
          radios
        )}
      </RadioGroup>
      {!isSubmitting && isError ? (
        <FormHelperText {...FormHelperTextProps}>{error}</FormHelperText>
      ) : null}
    </StyledRadioField>
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

export default MyRadio;
