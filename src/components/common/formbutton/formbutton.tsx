import { Fragment, useEffect, useRef } from "react";
import { Merge } from "../types";
import {
  transformDependentFieldsState,
  useField,
  UseFieldHookProps,
} from "packages/form";
import { GradientButton } from "components/styledComponent/button";
import {
  ButtonProps,
  FormControlLabelProps,
  FormControlProps,
  FormHelperTextProps,
  Grid,
  GridProps,
} from "@mui/material";
interface extendedFiledProps extends UseFieldHookProps {
  label: string;
}
interface MyButtonExtendedProps {
  FormControlLabelProps?: FormControlLabelProps;
  FormControlProps?: FormControlProps;
  FormHelperTextProps?: FormHelperTextProps;
  GridProps?: GridProps;
  enableGrid: boolean;
  iconStyle?: any;
}
type MyButtonMixedProps = Merge<ButtonProps, extendedFiledProps>;
export type MyFormButtonAllProps = Merge<
  MyButtonMixedProps,
  MyButtonExtendedProps
>;
export const FormButton = ({
  name: fieldName,
  validate,
  validationRun,
  postValidationSetCrossFieldValues,
  runValidationOnDependentFieldsChange,
  runPostValidationHookAlways,
  shouldExclude,
  isReadOnly,
  dependentFields,
  fieldKey: fieldID,
  CircularProgressProps,
  enableNumWords,
  InputProps,
  inputProps,
  StartAdornment,
  EndAdornment,
  //@ts-ignore
  isFieldFocused,
  maxLength = -1,
  setValueOnDependentFieldsChange,
  skipValueUpdateFromCrossFieldWhenReadOnly,
  setColor,
  showMaxLength = true,
  label,
  enableGrid,
  GridProps,
  onFormButtonClickHandel,
  startsIcon,
  endsIcon,
  rotateIcon,
  iconStyle,
  ...others
}) => {
  const {
    value,
    error,
    touched,
    handleChange,
    handleBlur,
    isSubmitting,
    validationRunning,
    fieldKey,
    name,
    excluded,
    readOnly,
    incomingMessage,
    whenToRunValidation,
    runValidation,
    validationAPIResult,
    dependentValues,
    ...otherFieldData
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
  const focusRef = useRef();
  useEffect(() => {
    if (isFieldFocused) {
      //@ts-ignore
      getFocus();
    }
  }, [isFieldFocused, value]);
  const getFocus = () => {
    setTimeout(() => {
      //@ts-ignore
      focusRef?.current?.focus?.();
    }, 1);
  };

  const ClickEventCall = (e) => {
    if (typeof onFormButtonClickHandel === "function") {
      onFormButtonClickHandel(
        fieldID,
        transformDependentFieldsState(dependentValues)
      );
    }
    handleChange(isNaN(value) || !Boolean(value) ? "1" : parseInt(value) + 1);
  };

  useEffect(() => {
    if (typeof setValueOnDependentFieldsChange === "function") {
      let result = setValueOnDependentFieldsChange(
        transformDependentFieldsState(dependentValues)
      );
      if (result !== undefined && result !== null) {
        handleChange(result);
      }
    }
  }, [dependentValues, handleChange, setValueOnDependentFieldsChange]);

  useEffect(() => {
    if (incomingMessage !== null && typeof incomingMessage === "object") {
      const { value, isFieldFocused } = incomingMessage;

      if (Boolean(value) || value === "") {
        handleChange(value);
        if (isFieldFocused) {
          getFocus();
        }
        if (whenToRunValidation === "onBlur") {
          runValidation({ value: value }, true);
        }
      }
    }
  }, [incomingMessage, handleChange, runValidation, whenToRunValidation]);

  if (excluded) {
    return null;
  }
  const result = (
    <Fragment>
      <GradientButton
        color="secondary"
        onClick={ClickEventCall}
        style={{ width: "100%", paddingX: "10px", marginTop: "17px" }}
        starticon={startsIcon}
        endicon={endsIcon}
        rotateIcon={rotateIcon}
        inputRef={focusRef}
        sx={{
          "& svg": {
            ...iconStyle,
          },
        }}
      >
        {label}
      </GradientButton>
    </Fragment>
  );
  if (Boolean(enableGrid)) {
    return (
      <Grid
        {...GridProps}
        key={fieldID}
        container
        justifyContent="center"
        alignItems="center"
      >
        {result}
      </Grid>
    );
  } else {
    return result;
  }
};

export default FormButton;
