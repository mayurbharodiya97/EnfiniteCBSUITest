import {
  FC,
  useEffect,
  useRef,
  useCallback,
  useState,
  useContext,
} from "react";
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
  Dialog,
  FormHelperText,
  Grid,
  GridProps,
  InputAdornment,
  TextFieldProps,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import * as Icons from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { AuthContext } from "pages_audit/auth";
import { DailyTransTabsWithDialog } from "pages_audit/pages/operations/DailyTransaction/TRNHeaderTabs/DailyTransTabs";
import Scroll from "pages_audit/pages/dashboard/Today'sTransactionGrid/openScroll/scroll";
import { Accountinquiry } from "pages_audit/acct_Inquiry/acct_inquiry";
// import { DailyTransTabsWithDialog } from "pages_audit/pages/operations/DailyTransaction/TRNHeaderTabs/DailyTransTabs";
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
  enableShortcut?: string[];
  ignoreInSubmit?: boolean;
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
  txtTransform,
  AlwaysRunPostValidationSetCrossFieldValues,
  enableShortcut = [],
  ignoreInSubmit = false,
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
    fieldDataOnBlr,
    setIgnoreInSubmit,
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
    txtTransform,
    AlwaysRunPostValidationSetCrossFieldValues,
  });

  const [currentColor, setCurrentColor] = useState<string>(
    typeof setColor === "string" ? setColor : ""
  );
  const [open360, setOpen360] = useState(false);
  const [req360, setReq360] = useState({});
  const { authState } = useContext(AuthContext);
  const { t } = useTranslation();
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

  useEffect(() => {
    setIgnoreInSubmit(ignoreInSubmit);
  }, [ignoreInSubmit]);

  const customHandleChange = useCallback(
    (e) => {
      handleChange(e, e.target?.formattedValue ?? undefined);
    },
    [handleChange]
  );

  const focusRef = useRef();
  const inputfocusRef: any = useRef();
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
      ////////////Below solution is temporary for set focus in numberFormat Component.
      ////////////Need to find proper solution. If you found proper solution contact Me😎🤷‍♂️.
      if (!Boolean(focusRef?.current)) {
        inputfocusRef?.current?.children?.[1]?.firstChild?.focus?.();
      }
    }, 50);
  };

  useEffect(() => {
    // if (typeof setValueOnDependentFieldsChange === "function") {
    //   let result = setValueOnDependentFieldsChange(
    //     transformDependentFieldsState(dependentValues),
    //     { isSubmitting }
    //   );

    //   if (result !== undefined && result !== null) {
    //     handleChange(result);
    //   }
    // }
    const handleDependentFieldsChange = async () => {
      if (typeof setValueOnDependentFieldsChange === "function") {
        try {
          let result = await setValueOnDependentFieldsChange(
            transformDependentFieldsState(dependentValues),
            { isSubmitting }
          );

          if (result !== undefined && result !== null) {
            handleChange(result);
          }
        } catch (error) {
          // Handle any errors that occur during the promise execution
          console.error("An error occurred:", error);
        }
      }
    };
    handleDependentFieldsChange();
  }, [dependentValues, handleChange, setValueOnDependentFieldsChange]);

  useEffect(() => {
    if (incomingMessage !== null && typeof incomingMessage === "object") {
      const { value, error, ignoreUpdate, isFieldFocused, isErrorBlank } =
        incomingMessage;
      if (Boolean(value) || value === "") {
        handleChange(value);
        if (isFieldFocused) {
          getFocus();
        }
        if (ignoreUpdate) {
          //ignore Validation
        } else if (whenToRunValidation === "onBlur") {
          runValidation({ value: value }, true);
        }
      }
      if (isErrorBlank) {
        setErrorAsCB("");
      } else if (Boolean(error)) {
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

  const splitBySlash = (fieldData) => {
    return fieldData?.fieldKey?.split("/").pop()?.split(".").pop() ?? null;
  };
  const splitBySlash2 = (fieldData) => {
    return fieldData?.fieldKey?.split("/").pop() ?? null;
  };

  const checkValuesNotEmpty = (keysToCheck) => {
    const fieldsWithValue = keysToCheck.reduce((acc, key) => {
      // Check if the key exists in either dependentValues or fieldDataOnBlr
      const dependentKeys = Object.keys(dependentValues);
      const mainFieldKey = splitBySlash2(fieldDataOnBlr);
      const allKeys = [mainFieldKey, ...dependentKeys];
      const matchingKey: any = allKeys.find((depKey) => {
        if (typeof depKey === "string") {
          const keyMatch = depKey === key || depKey.endsWith(`.${key}`);
          return keyMatch;
        }
        return false;
      });

      if (matchingKey) {
        const splitedFieldDataOnBlr = splitBySlash2(fieldDataOnBlr);

        const fieldData =
          matchingKey === splitedFieldDataOnBlr
            ? fieldDataOnBlr
            : dependentValues[matchingKey];
        if (fieldData?.value) acc[key] = fieldData.value;
      }

      return acc;
    }, {});

    return {
      allFieldsNotEmpty:
        Object.keys(fieldsWithValue).length === keysToCheck.length,
      fieldsWithValue,
    };
  };

  const keysToCheck =
    enableShortcut?.length > 0
      ? enableShortcut
      : splitBySlash(fieldDataOnBlr) === "ACCT_CD"
      ? ["ACCT_CD", "BRANCH_CD", "ACCT_TYPE"]
      : [];
  const { allFieldsNotEmpty, fieldsWithValue } =
    keysToCheck?.length > 0
      ? checkValuesNotEmpty(keysToCheck)
      : { allFieldsNotEmpty: false, fieldsWithValue: {} };

  const handleKeyDown = (event) => {
    if (
      event.ctrlKey &&
      event.altKey &&
      allFieldsNotEmpty &&
      event.key === "5" &&
      !validationRunning
    ) {
      setReq360([
        { data: { ...fieldsWithValue, COMP_CD: authState?.companyID } },
      ]);
      setOpen360(true);
      event.preventDefault();
    } else if (!event.ctrlKey && event.key === "F5") {
      event.preventDefault();
    }
  };

  const isError = myTouch && Boolean(myError);
  const handleClose = () => {
    setOpen360(false);
  };
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
        value={typeof value === "string" ? value.trimStart() : value}
        error={!isSubmitting && isError}
        helperText={
          <div style={{ display: "flex" }}>
            <FormHelperText style={{ whiteSpace: "pre-line" }}>
              {!isSubmitting && isError
                ? t(myError)
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
            <InputAdornment position="end" className="withBorder">
              {EndAdornment}
            </InputAdornment>
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
        ref={inputfocusRef}
        onKeyDown={(event) => {
          handleKeyDown(event);
        }}
      />
    </>
  );
  // if (Boolean(enableGrid)) {
  //   return <Grid {...GridProps}>{result}</Grid>;
  // } else {
  //   return result;
  // }
  const renderDailyTransTabsWithDialog = () => {
    if (open360) {
      return (
        <DailyTransTabsWithDialog
          handleClose={handleClose}
          rowsData={req360}
          setRowsData={setReq360}
        />
      );
    }
    return null;
  };

  if (Boolean(enableGrid)) {
    return (
      <Grid {...GridProps}>
        {result}
        {renderDailyTransTabsWithDialog()}
      </Grid>
    );
  } else {
    return (
      <>
        {result}
        {renderDailyTransTabsWithDialog()}
      </>
    );
  }
};

export default MyTextField;
