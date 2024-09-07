import { FC, useEffect, useRef } from "react";
import {
  useField,
  UseFieldHookProps,
  transformDependentFieldsState,
} from "packages/form";
import { TextField } from "components/styledComponent";
import { NumericFormat } from "react-number-format";
import { Merge } from "../types";
import { Grid, GridProps, TextFieldProps } from "@mui/material";

/* eslint-disable  react-hooks/exhaustive-deps */
interface VisaversaProps {
  leftName: string;
  rightName: string;
  leftLabel: string;
  rightLabel: string;
  leftTransform: any;
  rightTransform: any;
  GridProps?: GridProps;
  enableGrid: boolean;
}

export type MyTextFieldAllProps = Merge<TextFieldProps, VisaversaProps>;

export type MyVisaversaProps = UseFieldHookProps & MyTextFieldAllProps;

function NumberFormatCustom(props) {
  const { inputRef, onChange, FormatProps, ...other } = props;
  return (
    <NumericFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange(
          {
            target: {
              value: values.value,
              formattedValue: values.formattedValue,
            },
          },
          values.formattedValue
        );
      }}
      {...FormatProps}
    />
  );
}

function PercentageFormatCustom(props) {
  const { inputRef, onChange, FormatProps, ...other } = props;
  return (
    <NumericFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange(
          {
            target: {
              value: values.value,
              formattedValue: values.formattedValue,
            },
          },
          values.formattedValue
        );
      }}
      {...FormatProps}
    />
  );
}

const Visaversa: FC<MyVisaversaProps> = ({
  name: fieldName,
  fieldKey: fieldID,
  validate,
  leftName,
  rightName,
  leftLabel,
  rightLabel,
  leftTransform = (value) => value,
  rightTransform = (value) => value,
  GridProps,
  enableGrid,
  dependentFields,
  validationRun,
  runValidationOnDependentFieldsChange,
}) => {
  const {
    touched,
    value,
    error,
    setValue,
    handleBlur,
    isSubmitting,
    dependentValues,
  } = useField({
    name: fieldName,
    fieldKey: fieldID,
    validate,
    validationRun,
    dependentFields,
    runValidationOnDependentFieldsChange,
  });
  const leftValue = value[leftName];
  const rightValue = value[rightName];

  const leftValueRef = useRef<any>(leftValue);
  leftValueRef.current = leftValue;

  const rightValueRef = useRef<any>(rightValue);
  rightValueRef.current = rightValue;

  useEffect(() => {
    let newDependentValues = transformDependentFieldsState(dependentValues);

    let leftResult = leftTransform(
      leftValueRef.current,
      leftName,
      newDependentValues
    );
    let rightResult = rightTransform(
      rightValueRef.current,
      rightName,
      newDependentValues
    );
    if (leftResult === null && rightResult === null) {
      return;
    }
    setValue(
      { [leftName]: leftResult, [rightName]: rightResult },
      { [leftName]: leftResult, [rightName]: rightResult },
      true
    );
  }, [dependentValues]);

  const handleLeftChange = (e) => {
    let value = e.target.value;
    let result = rightTransform(
      value,
      rightName,
      transformDependentFieldsState(dependentValues)
    );
    setValue(
      { [leftName]: value, [rightName]: result },
      { [leftName]: value, [rightName]: result },
      true
    );
  };

  const handleRightChange = (e) => {
    let value = e.target.value;
    let result = leftTransform(
      value,
      leftName,
      transformDependentFieldsState(dependentValues)
    );
    setValue(
      { [leftName]: result, [rightName]: value },
      { [leftName]: result, [rightName]: value },
      true
    );
  };

  const isError = touched && (error ?? "") !== "";
  let result = (
    <div style={{ display: "flex" }} tabIndex={0} onBlur={handleBlur}>
      <TextField
        key="left"
        id="left"
        name={leftName}
        value={leftValue}
        label={leftLabel}
        onChange={handleLeftChange}
        disabled={isSubmitting}
        error={!isSubmitting && isError}
        helperText={!isSubmitting && isError ? error : ""}
        InputLabelProps={{
          shrink: true,
        }}
        InputProps={{
          //@ts-ignore
          inputComponent: NumberFormatCustom,
          inputProps: {
            FormatProps: {
              thousandSeparator: true,
              prefix: "৳",
              thousandsGroupStyle: "lakh",
              allowNegative: true,
              allowLeadingZeros: false,
              decimalScale: 2,
              isAllowed: (values) => {
                if (values?.value?.length > 10) {
                  return false;
                }
                if (values.floatValue === 0) {
                  return false;
                }
                return true;
              },
            },
          },
        }}
      />
      <TextField
        key="right"
        id="right"
        name={rightName}
        label={rightLabel}
        value={rightValue}
        onChange={handleRightChange}
        InputLabelProps={{
          shrink: true,
        }}
        InputProps={{
          //@ts-ignore
          inputComponent: PercentageFormatCustom,
          inputProps: {
            FormatProps: {
              suffix: "%",
              decimalScale: 2,
              fixedDecimalScale: true,
              allowNegative: true,
              allowEmptyFormatting: true,
              isAllowed: (values) => {
                //@ts-ignore
                if (values.floatValue >= 999.99) {
                  return false;
                }
                return true;
              },
            },
          },
        }}
      />
    </div>
  );
  if (Boolean(enableGrid)) {
    return <Grid {...GridProps}>{result}</Grid>;
  } else {
    return result;
  }
};

export default Visaversa;
