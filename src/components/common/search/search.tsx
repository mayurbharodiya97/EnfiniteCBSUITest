import {
  FC,
  useEffect,
  useRef,
  useCallback,
  useState,
  Fragment,
  createElement,
} from "react";
import { useField, UseFieldHookProps } from "packages/form";
import {
  Dialog,
  FormHelperText,
  Grid,
  GridProps,
  IconButton,
  InputAdornment,
  TextFieldProps,
} from "@mui/material";
import { Merge } from "../types";
import { TextField } from "components/styledComponent";
// import SearchIcon from "@material-ui/icons/Search";
import Search from "@mui/icons-material/Search";
import { ModalManager } from "@material-ui/core";

interface MyGridExtendedProps {
  maxLength?: number;
  GridProps?: GridProps;
  enableGrid: boolean;
  setColor?: any;
  searchComponent?: React.Component;
}

type MyTextFieldAllProps = Merge<TextFieldProps, MyGridExtendedProps>;

export type MySearchFieldProps = UseFieldHookProps & MyTextFieldAllProps;

const MySearchField: FC<MySearchFieldProps> = ({
  name: fieldName,
  validate,
  validationRun,
  postValidationSetCrossFieldValues,
  runValidationOnDependentFieldsChange,
  skipValueUpdateFromCrossFieldWhenReadOnly,
  runPostValidationHookAlways,
  shouldExclude,
  isReadOnly,
  dependentFields,
  fieldKey: fieldID,
  GridProps,
  enableGrid,
  InputProps,
  inputProps,
  //@ts-ignore
  isFieldFocused,
  maxLength = -1,
  setColor,
  searchComponent = () => <span>No component found attached</span>,
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
    validationAPIResult,
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

  const [openSearch, setOpenSearch] = useState<boolean>(false);

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

  /* eslint-disable react-hooks/exhaustive-deps */
  const onAcceptValue = useCallback(
    (value) => {
      if (typeof value === "object") {
        setIncomingMessage(value);
      } else {
        handleChange(value, value);
      }
      setOpenSearch(false);
    },
    [handleChange]
  );

  const focusRef = useRef();
  useEffect(() => {
    if (isFieldFocused) {
      //@ts-ignore
      setTimeout(() => {
        //@ts-ignore
        focusRef?.current?.focus?.();
      }, 1);
    }
  }, [isFieldFocused]);

  useEffect(() => {
    if (incomingMessage !== null && typeof incomingMessage === "object") {
      const { value } = incomingMessage;
      if (Boolean(value) || value === "") {
        handleChange(value);
        if (whenToRunValidation === "onBlur") {
          runValidation({ value: value }, true);
        }
      }
    }
  }, [incomingMessage, handleChange, runValidation, whenToRunValidation]);

  if (excluded) {
    return null;
  }
  /*fix for numberFormat*/
  if (InputProps?.inputProps) {
    InputProps.inputProps = {
      ...InputProps.inputProps,
      readOnly: readOnly,
      tabIndex: readOnly ? -1 : undefined,
    };
  }
  const isError = touched && Boolean(error);
  const result = (
    <Fragment>
      <TextField
        style={{ width: "220px" }}
        placeholder="Search Here..."
        {...others}
        key={fieldKey}
        id={fieldKey}
        name={name}
        value={value}
        error={!isSubmitting && isError}
        // helperText={
        //   <div style={{ display: "flex" }}>
        //     <FormHelperText>
        //       {!isSubmitting && isError
        //         ? error
        //         : Boolean(validationAPIResult)
        //         ? validationAPIResult
        //         : null}
        //     </FormHelperText>
        //   </div>
        // }
        FormHelperTextProps={{
          //@ts-ignore
          component: "div",
        }}
        //@ts-ignore
        InputProps={{
          disableUnderline: true,
          style:
            !isSubmitting && Boolean(currentColor)
              ? { color: currentColor, fontWeight: "bold" }
              : {
                  margin: "0px",
                  border: "none",
                  background: " rgba(235, 237, 238, 0.45)",
                },
          startAdornment: (
            <InputAdornment
              style={{ padding: "0px", border: "none", margin: "0px" }}
              position="start"
            >
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setOpenSearch(true)}
              >
                {/* <SearchIcon /> */}
                <Search />
              </IconButton>
            </InputAdornment>
          ),
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
      />
      <Dialog
        open={openSearch}
        onClose={() => setOpenSearch(false)}
        maxWidth={"md"}
      >
        {createElement(
          searchComponent as any,
          {
            onAccept: onAcceptValue,
            value: value,
          },
          null
        )}
      </Dialog>
    </Fragment>
  );
  if (Boolean(enableGrid)) {
    return <Grid {...GridProps}>{result}</Grid>;
  } else {
    return result;
  }
};

export default MySearchField;

/*
{cloneElement(searchComponent as any, {
          onAccept: onAcceptValue,
          value: value,
        })}
        */
