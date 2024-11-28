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
import { useState, useCallback, Fragment, useRef } from "react";
import "./Trn001.css";
import { getCurrencySymbol } from "@acuteinfo/common-base";
import Draggable from "react-draggable";
import { NumberFormatCustom } from "components/custom/NumberFormatCustom";

const useAutocompleteHandlers = (onChangeCallback) => {
  // const [highlightedOption, setHighlightedOption] = useState(null);
  const highlightedOptionRef = useRef<any>(null);

  const handleHighlightChange = useCallback((event, option, reason) => {
    highlightedOptionRef.current = option;
  }, []);

  const handleKeyDown = useCallback(
    (event, unqID, flag) => {
      if (event?.key === "Tab" && highlightedOptionRef?.current) {
        switch (flag) {
          case "BRANCH_CD":
            onChangeCallback({
              updUnqId: unqID,
              branchVal: highlightedOptionRef?.current,
            });
            break;
          case "ACCT_TYPE":
            onChangeCallback({
              updUnqId: unqID,
              value: highlightedOptionRef?.current,
            });
            break;
          case "TRX":
            onChangeCallback(event, highlightedOptionRef?.current, unqID);
            break;
          case "SDC":
            onChangeCallback({
              updUnqId: unqID,
              value: highlightedOptionRef?.current,
            });
            break;
          default:
            onChangeCallback({
              updUnqId: unqID,
              value: highlightedOptionRef?.current,
            });
        }
      }
    },
    [highlightedOptionRef?.current, onChangeCallback]
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
            style={{
              backgroundColor: disabled ? "rgb(238, 238, 238)" : "transparent",
            }}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            variant="outlined"
            autoFocus={autoFocus}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "gray",
                  borderWidth: "1px",
                },
                "&:hover fieldset, &.Mui-focused fieldset": {
                  borderColor: "gray",
                  borderWidth: "1px",
                },
              },
            }}
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
          {errorMsg ? (
            <DynFormHelperText msg={errorMsg} />
          ) : (
            value?.actLabel && (
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 400,
                  fontSize: "9.5px",
                  lineHeight: "10px",
                  letterSpacing: "0.03333em",
                  textAlign: "left",
                  marginTop: "3px",
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  // whiteSpace: "nowrap",
                  wordBreak: "break-word",
                }}
              >
                {value?.actLabel}
              </Typography>
            )
          )}
        </>
      )}
      PaperComponent={({ children }) => {
        return (
          <div
            // style={paperStyles}
            style={{
              width: "max-content",
              background: "white",
              boxShadow:
                "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
              overflowX: "scroll",
              maxWidth: "320px",
              // width: "200px",
              // minWidth: "max(160px, 100%)",
            }}
          >
            {children}
          </div>
        );
      }}
      filterOptions={(options, state) => {
        const inputValue = state.inputValue.toLowerCase();
        const filtered = options.filter((option) =>
          option.label.toLowerCase().includes(inputValue)
        );
        return filtered.sort((a, b) => {
          const aStartsWith = a.label.toLowerCase().startsWith(inputValue);
          const bStartsWith = b.label.toLowerCase().startsWith(inputValue);

          if (aStartsWith && !bStartsWith) {
            return -1;
          }
          if (!aStartsWith && bStartsWith) {
            return 1;
          }
          return 0;
        });
      }}
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
    customParameter ?? {};
  return (
    <>
      <TextField
        value={value}
        fullWidth={true}
        id="txtRight"
        size={size}
        variant="outlined"
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={(event) => {
          const input = event.target;
          if (input.value) {
            input.select();
          }
        }}
        style={{
          backgroundColor: disabled ? "rgb(238, 238, 238)" : "transparent",
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
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "gray",
              borderWidth: "1px",
            },
            "&:hover fieldset, &.Mui-focused fieldset": {
              borderColor: "gray",
              borderWidth: "1px",
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
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onDoubleClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
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
  onKeyUp,
  onDoubleClick,
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
        onKeyUp={onKeyUp}
        onDoubleClick={onDoubleClick}
        disabled={disabled}
        onBlur={onBlur}
        variant="outlined"
        id={id}
        style={{
          backgroundColor: disabled ? "rgb(238, 238, 238)" : "transparent",
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "gray",
              borderWidth: "1px",
            },
            "&:hover fieldset, &.Mui-focused fieldset": {
              borderColor: "gray",
              borderWidth: "1px",
            },
          },
        }}
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
    //@ts-ignore
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
};
