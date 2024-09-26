import {
  Autocomplete,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormHelperText,
  InputAdornment,
  Paper,
  PaperProps,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useCallback, Fragment } from "react";
import "./Trn001.css";
import { getCurrencySymbol } from "@acuteinfo/common-base";
import Draggable from "react-draggable";
import { NumberFormatCustom } from "components/custom/NumberFormatCustom";

const useAutocompleteHandlers = (onChangeCallback) => {
  const [highlightedOption, setHighlightedOption] = useState(null);

  const handleHighlightChange = useCallback((event, option, reason) => {
    setHighlightedOption(option);
  }, []);

  const handleKeyDown = useCallback(
    (event, unqID, flag) => {
      if (event?.key === "Tab" && highlightedOption) {
        switch (flag) {
          case "BRANCH_CD":
            onChangeCallback({ updUnqId: unqID, branchVal: highlightedOption });
            break;
          case "ACCT_TYPE":
            onChangeCallback({
              updUnqId: unqID,
              value: highlightedOption,
            });
            break;
          case "TRX":
            onChangeCallback(event, highlightedOption, unqID);
            break;
          case "SDC":
            onChangeCallback({ updUnqId: unqID, value: highlightedOption });
            break;
          default:
            onChangeCallback({
              updUnqId: unqID,
              value: highlightedOption,
            });
        }
      }
    },
    [highlightedOption, onChangeCallback]
  );

  return {
    handleHighlightChange,
    handleKeyDown,
  };
};

export default useAutocompleteHandlers;

export const DynFormHelperText = ({ msg }) => {
  return (
    <FormHelperText
      style={{
        color: "#f44336",
        padding: "0 4px",
      }}
    >
      {msg}
    </FormHelperText>
  );
};

interface CustomAutocompleteProps {
  value: any;
  size?: "small" | "medium";
  options: Array<{ label: string; value: any }>;
  onChange: (event: React.ChangeEvent<{}>, value: any) => void;
  onHighlightChange?: (
    event: React.ChangeEvent<{}>,
    option: any,
    reason: any
  ) => void;
  disabled?: boolean;
  popupIcon?: React.ReactNode;
  width?: string | number;
  style?: React.CSSProperties;
  onBlur?: (event: React.FocusEvent<HTMLElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
  autoFocus?: boolean;
  isLoading?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
  errorMsg?: string;
}

export const CustomeAutocomplete = ({
  value,
  size = "small",
  options,
  onChange,
  onHighlightChange,
  disabled,
  popupIcon,
  width = "120px",
  style,
  onBlur,
  onKeyDown,
  autoFocus,
  isLoading,
  inputRef,
  errorMsg,
}: CustomAutocompleteProps) => {
  return (
    <Autocomplete
      value={value}
      fullWidth
      autoHighlight
      autoComplete={false}
      size={size}
      options={options}
      onChange={onChange}
      onHighlightChange={onHighlightChange}
      disabled={disabled}
      popupIcon={popupIcon}
      renderInput={(params) => (
        <>
          <TextField
            {...params}
            style={{ width }}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            autoFocus={autoFocus}
            InputProps={{
              ...params?.InputProps,
              endAdornment: (
                <Fragment>
                  {Boolean(isLoading) ? (
                    <CircularProgress
                      sx={{ position: "absolute", right: "0.5rem" }}
                      size={25}
                      color="secondary"
                      variant="indeterminate"
                    />
                  ) : (
                    params.InputProps.endAdornment
                  )}
                </Fragment>
              ),
            }}
            inputRef={inputRef}
          />
          {errorMsg && <DynFormHelperText msg={errorMsg} />}
        </>
      )}
    />
  );
};

interface CustomAmountFieldProps {
  value: any;
  size?: "small" | "medium";
  disabled?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLElement>) => void;
  inputRef?: React.Ref<HTMLInputElement>;
  loadingState?: boolean;
  errorMsg?: string;
  customParameter?: any;
}

export const CustomAmountField = ({
  value,
  size = "small",
  disabled,
  onChange,
  onBlur,
  inputRef,
  loadingState,
  errorMsg,
  customParameter,
  ...rest
}: CustomAmountFieldProps) => {
  const { dynamicAmountSymbol, dynamicAmountGroupStyle, decimalCount } =
    customParameter;
  return (
    <>
      <TextField
        value={value}
        fullWidth={true}
        id="txtRight"
        size={size}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={(event) => {
          const input = event.target;
          if (input.value) {
            input.select();
          }
        }}
        InputProps={{
          inputComponent: NumberFormatCustom,
          inputProps: {
            FormatProps: {
              thousandSeparator: true,
              thousandsGroupStyle: dynamicAmountGroupStyle ?? "lakh",
              allowNegative: false,
              allowLeadingZeros: false,
              decimalScale: decimalCount ?? 2,
              fixedDecimalScale: true,
              autoComplete: "off",
              isAllowed: (values) => {
                if (values?.floatValue === 0) {
                  return false;
                }
                return true;
              },
            },
            inputRef: inputRef,
          },
          startAdornment: (
            <Fragment>
              <InputAdornment
                position="start"
                sx={{
                  height: "17px",
                  margin: "6px 0px !important",
                  padding: "0 0.6rem 0 0.6rem",
                  maxHeight: "36px",
                  borderRight: "2px dashed #BABABA",
                }}
              >
                {getCurrencySymbol(dynamicAmountSymbol ?? "INR")}
              </InputAdornment>
              {Boolean(loadingState) && (
                <CircularProgress
                  sx={{
                    position: "absolute",
                    left: "2rem",
                  }}
                  size={25}
                  color="secondary"
                  variant="indeterminate"
                />
              )}
            </Fragment>
          ),
          ...rest,
        }}
        sx={{
          "& .MuiInputBase-root": {
            padding: "0",
            "& .MuiInputBase-input": {
              padding: "0.6rem",
            },
          },
        }}
      />
      {errorMsg && <DynFormHelperText msg={errorMsg} />}
    </>
  );
};

interface CustomTextFieldProps {
  value: any;
  size?: "small" | "medium";
  type?: "text" | "number" | "password" | "email";
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  loadingState?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
  errorMsg?: string;
  id?: string;
  alignment?: "right" | "left";
}

export const CustomTextField = ({
  value,
  size = "small",
  type,
  onChange,
  disabled,
  onBlur,
  loadingState,
  inputRef,
  errorMsg,
  id,
  alignment = "right",
}: CustomTextFieldProps) => {
  return (
    <>
      <TextField
        value={value}
        fullWidth={true}
        size={size}
        type={type}
        onChange={onChange}
        disabled={disabled}
        onBlur={onBlur}
        id={id}
        onFocus={(event) => {
          const input = event.target;
          if (input.value) {
            input.select();
          }
        }}
        InputProps={{
          endAdornment: (
            <Fragment>
              {Boolean(loadingState) ? (
                <CircularProgress
                  sx={{
                    position: "absolute",
                    [alignment as string]: "0.5rem",
                  }}
                  size={25}
                  color="secondary"
                  variant="indeterminate"
                />
              ) : null}
            </Fragment>
          ),
        }}
        inputRef={inputRef}
      />
      {errorMsg && <DynFormHelperText msg={errorMsg} />}
    </>
  );
};

export const PaperComponent = (props: PaperProps) => {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
};
