import { FC, useState, useEffect, useCallback, Fragment } from "react";
import { useField, UseFieldHookProps } from "packages/form";
import {
  Grid,
  GridProps,
  InputLabel,
  InputLabelProps,
  Slider,
  SliderProps,
} from "@mui/material";

interface ExtendedFieldProps extends UseFieldHookProps {
  label: string;
  InputLabelProps?: InputLabelProps;
  GridProps?: GridProps;
  enableGrid: boolean;
}

export type AllSliderProps = ExtendedFieldProps & SliderProps;

const MySlider: FC<AllSliderProps> = ({
  name: fieldName,
  fieldKey: fieldID,
  shouldExclude,
  isReadOnly,
  postValidationSetCrossFieldValues,
  runPostValidationHookAlways,
  dependentFields,
  validate,
  validationRun,
  label,
  InputLabelProps,
  GridProps,
  enableGrid,
  runValidationOnDependentFieldsChange,
  skipValueUpdateFromCrossFieldWhenReadOnly,
  ...others
}) => {
  const {
    handleChange,
    handleBlur,
    isSubmitting,
    fieldKey,
    name,
    value,
    excluded,
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
  const [localValue, setLocalValue] = useState(Number(value));
  useEffect(() => {
    setLocalValue(Number(value));
  }, [value]);
  const [focus, setFocus] = useState(false);
  const localValueHandler = useCallback(
    (_, sliderValue) => {
      setLocalValue(sliderValue);
    },
    [setLocalValue]
  );
  const customHandleChange = useCallback(
    (_, sliderValue) => {
      handleChange(sliderValue);
    },
    [handleChange]
  );
  const customBlur = useCallback(() => {
    handleBlur();
    setFocus(false);
  }, [handleBlur, setFocus]);
  const focusHandler = useCallback(() => {
    setFocus(true);
  }, [setFocus]);

  if (excluded) {
    return null;
  }
  const result = (
    // @ts-ignore
    <Fragment key={fieldKey}>
      <InputLabel {...InputLabelProps} focused={focus} disabled={isSubmitting}>
        {label}
      </InputLabel>
      <Slider
        {...others}
        key={fieldKey}
        id={fieldKey}
        name={name}
        value={localValue}
        //@ts-ignore
        disabled={isSubmitting}
        onFocus={focusHandler}
        onChange={localValueHandler}
        onChangeCommitted={customHandleChange}
        onBlur={customBlur}
      />
    </Fragment>
  );
  if (Boolean(enableGrid)) {
    return <Grid {...GridProps}>{result}</Grid>;
  } else {
    return result;
  }
};

export default MySlider;
