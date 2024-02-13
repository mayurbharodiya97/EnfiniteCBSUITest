import { FC, useEffect, useRef, useCallback, useState } from "react";
import {
  useField,
  UseFieldHookProps,
  transformDependentFieldsState,
} from "packages/form";

import { TextField } from "components/styledComponent";

import { Merge } from "../types";
import { numWords } from "components/common/utils";
import {
  CircularProgress,
  CircularProgressProps,
  FormHelperText,
  Grid,
  GridProps,
  InputAdornment,
  TextFieldProps,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import * as Icons from "@mui/icons-material";
interface MyGridExtendedProps {
  enableNumWords?: boolean;
  maxLength?: number;
  GridProps?: GridProps;
  StartAdornment?: string;
  EndAdornment?: string;
  CircularProgressProps?: CircularProgressProps;
  enableGrid: boolean;
  setValueOnDependentFieldsChange?: any;
  setColor?: any;
  showMaxLength?: boolean;
  allowToggleVisiblity?: boolean;
  startsIcon?: any;
  endsIcon?: any;
  iconStyle?: any;
  textFieldStyle?: any;
  AlwaysRunPostValidationSetCrossFieldValues?: {
    alwaysRun?: any;
    touchAndValidate?: any;
  };
}

type MyTextFieldAllProps = Merge<TextFieldProps, MyGridExtendedProps>;

export type MyTextFieldProps = UseFieldHookProps & MyTextFieldAllProps;

const MyTextField: FC<MyTextFieldProps> = ({
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
  GridProps,
  CircularProgressProps,
  enableGrid,
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
  startsIcon,
  endsIcon,
  iconStyle,
  textFieldStyle,
  AlwaysRunPostValidationSetCrossFieldValues,
  ...others
}) => {
  let StartIcon = Icons[startsIcon] || startsIcon || null;
  let EndIcon = Icons[endsIcon] || endsIcon || null;

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
    setErrorAsCB,
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
    AlwaysRunPostValidationSetCrossFieldValues,
  });

  const [currentColor, setCurrentColor] = useState<string>(
    typeof setColor === "string" ? setColor : ""
  );
  useEffect(() => {
    if (typeof setColor === "function") {
      let result = setColor(value);
      if (typeof result !== "string") {
        setCurrentColor("");
      } else {
        setCurrentColor(result);
      }
    }
  }, [value, setColor]);

  const customHandleChange = useCallback(
    (e) => {
      handleChange(e, e.target?.formattedValue ?? undefined);
    },
    [handleChange]
  );

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

  useEffect(() => {
    if (typeof setValueOnDependentFieldsChange === "function") {
      let result = setValueOnDependentFieldsChange(
        transformDependentFieldsState(dependentValues),
        { isSubmitting }
      );
      if (result !== undefined && result !== null) {
        handleChange(result);
      }
    }
  }, [dependentValues, handleChange, setValueOnDependentFieldsChange]);

  useEffect(() => {
    if (incomingMessage !== null && typeof incomingMessage === "object") {
      const { value, ignoreUpdate, isFieldFocused, error } = incomingMessage;
      if (Boolean(value) || value === "") {
        handleChange(value);
        if (isFieldFocused) {
          getFocus();
        }
        if (error) {
          if (whenToRunValidation === "onBlur") {
            runValidation({ value: value }, true);
          }
        }
        if (ignoreUpdate) {
          //ignore Validation
        } else if (whenToRunValidation === "onBlur") {
          runValidation({ value: value }, true);
        }
      }
      if (Boolean(error)) {
        setErrorAsCB(error);
      }
    }
  }, [
    incomingMessage,
    handleChange,
    runValidation,
    whenToRunValidation,
    setErrorAsCB,
  ]);

  if (excluded) {
    return null;
  }
  let myError = error;
  let numWordsVar: any = null;
  let myTouch = touched;
  try {
    if (enableNumWords && Boolean(value)) {
      let amountArray = String(value).split(".");
      let amountPart = Number(amountArray[0]);
      if (amountPart < 0) {
        amountPart = Math.abs(Number(amountPart));
        numWordsVar = `Negative ${numWords(amountPart)} Rupees`;
      } else {
        numWordsVar = `${numWords(amountPart)} Rupees`;
      }
      if (amountArray.length === 2 && Boolean(amountArray[1])) {
        numWordsVar = `${numWordsVar} and ${numWords(amountArray[1])} paise`;
      }
    }
  } catch (e) {
    myError = "";
    myTouch = true;
  }
  /*fix for numberFormat*/
  if (InputProps?.inputProps) {
    InputProps.inputProps = {
      ...InputProps.inputProps,
      readOnly: readOnly,
      tabIndex: readOnly ? -1 : undefined,
    };
  }
  const isError = myTouch && Boolean(myError);
  const result = (
    <>
      {/* Changes for bhavyata textfield label */}
      {/* <InputAdornment
        position="start"
        sx={{
          alignItems: "baseline",
          "& svg": {
            ...iconStyle,
            // color: "red",
            // stroke: "green",
          },
        }}
      >
        {StartIcon ? <StartIcon /> : null}
        <p style={{ alignSelf: "normal", margin: "2px 5px 0 5px" }}>{label}</p>
        {EndIcon ? <EndIcon /> : null}
      </InputAdornment> */}
      <TextField
        {...others}
        key={fieldKey}
        id={fieldKey}
        name={name}
        label={label}
        value={value}
        error={!isSubmitting && isError}
        helperText={
          <div style={{ display: "flex" }}>
            <FormHelperText>
              {!isSubmitting && isError
                ? myError
                : Boolean(validationAPIResult)
                ? validationAPIResult
                : numWordsVar}
            </FormHelperText>
            {maxLength > 0 && Boolean(showMaxLength) ? (
              <FormHelperText
                error={false}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  textAlign: "right",
                  margin: "5px 15px 0 0",
                  color: "rgba(0, 0, 0, 0.6)",
                }}
              >
                {value.length}/{maxLength}
              </FormHelperText>
            ) : null}
          </div>
        }
        sx={{
          ...textFieldStyle,
        }}
        FormHelperTextProps={{
          //@ts-ignore
          component: "div",
        }}
        //@ts-ignore
        InputProps={{
          style: {
            background: textFieldStyle
              ? ""
              : Boolean(readOnly)
              ? "var(--theme-color7)"
              : "",
            ...(!isSubmitting && Boolean(currentColor)
              ? {
                  color: currentColor,
                  fontWeight: "bold",
                }
              : {}),
          },

          endAdornment: validationRunning ? (
            <InputAdornment position="end">
              <CircularProgress
                color="secondary"
                variant="indeterminate"
                size={20}
                style={{ marginRight: "8px" }}
                {...CircularProgressProps}
              />
            </InputAdornment>
          ) : Boolean(EndAdornment) ? (
            EndAdornment
          ) : null,
          startAdornment: Boolean(StartAdornment) ? (
            <InputAdornment position="start">{StartAdornment}</InputAdornment>
          ) : null,
          ...InputProps,
        }}
        InputLabelProps={{
          shrink: true,
        }}
        inputRef={focusRef}
        onChange={(e) => {
          if (maxLength === -1) {
            customHandleChange(e);
          } else if (e.target.value.length <= maxLength) {
            customHandleChange(e);
          }
        }}
        inputProps={{
          readOnly: readOnly,
          tabIndex: readOnly ? -1 : undefined,
          ...inputProps,
        }}
        onBlur={handleBlur}
        disabled={isSubmitting}
        variant={"standard"}
        color="secondary"
      />
    </>
  );
  if (Boolean(enableGrid)) {
    return <Grid {...GridProps}>{result}</Grid>;
  } else {
    return result;
  }
};

export default MyTextField;
