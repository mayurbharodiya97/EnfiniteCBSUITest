import {
  Fragment,
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
  Suspense,
  forwardRef,
  useContext,
} from "react";
import { useImperativeHandle } from "react";
import Paper from "@mui/material/Paper";
import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { TextField } from "components/styledComponent/textfield";
import { GradientButton } from "components/styledComponent/button";
import { ColumnVisibility } from "components/dataTable/columnVisibility";
import CircularProgress from "@mui/material/CircularProgress";
import { SelectRenderOnly } from "components/common/select";
import { Spacer } from "components/common";
import FormHelperText from "@mui/material/FormHelperText";
import MyTypography from "components/common/typograhpy/typography";
import { KeyboardDateTimePicker } from "components/styledComponent/datetime";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { NumericFormat } from "react-number-format";
import { Autocomplete, InputAdornment } from "@mui/material";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { OptionsProps } from "components/common/types";
import { useQuery } from "react-query";
import { AuthContext } from "pages_audit/auth";
import { CurrencyRowCellRenderer } from "components/tableCellComponents/currencyRowCellRenderer";
import { CustomPropertiesConfigurationContext } from "components/propertiesconfiguration/customPropertiesConfig";
import getCurrencySymbol from "components/custom/getCurrencySymbol";
//import { Label } from "reactstrap";
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    background: "var(--theme-color1)",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--white)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
  refreshiconhover: {
    // "&:hover": {
    //   backgroundColor: "var(--theme-color2)",
    //   color: "var(--theme-color1)",
    // },
  },
}));
let visibleColumns = [];

const getOptionLabel = (freeSolo: any) => (option: OptionsProps) =>
  Boolean(freeSolo) ? option : option?.label ?? "";

export const FilterFormComponents = forwardRef<any, any>(
  (
    {
      dense,
      title,
      allowColumnHiding,
      fields: oldfielddata,
      initialDataValue,
      initialVisibleColumnData,
      submitButtonHide,
      submitButtonName,
      submitSecondButtonHide = true,
      submitSecondButtonName = "submit",
      submitSecondLoading = false,
      submitSecondAction = (arg1, arg2) => {},
      submitSecondValidtion = true,
      hideHeader,
      isDisplayOnly,
      onAction,
      loading,
      propStyles,
      displayStyle1,
      displayStyle2,
      submitThirdAction,
      submitThirdButtonHide = false,
      submitThirdButtonName = "click",
      submitThirdLoading = false,
      displayStyle3,
    },
    ref
  ) => {
    const classes = useStyles();
    const inputButtonRef = useRef<any>(null);
    const secondButtonRef = useRef<any>(null);
    const thirdButtonRef = useRef<any>(null);
    const [ErrorData, setErrorData] = useState({});
    const [colomnValue, setColomnValue] = useState<any>(initialDataValue);
    const [fields, setFields] = useState(oldfielddata);
    const [initialVisibleColumn, setInitialVisibleColumn] = useState(
      initialVisibleColumnData
    );

    const dependField = useMemo(() => {
      let dependData = {};
      oldfielddata.forEach((item) => {
        if (Boolean(item.dependFields) && Array.isArray(item.dependFields)) {
          item.dependFields.forEach((itemdepend) => {
            if (Boolean(dependData[itemdepend])) {
              // dependData[itemdepend].put(item.name);
              dependData[itemdepend].push(item.name);
            } else {
              dependData[itemdepend] = [item.name];
            }
          });
        }
      });
      return dependData;
    }, [oldfielddata]);
    const dependFieldFunc = useMemo(() => {
      let dependData = {};
      oldfielddata.forEach((item) => {
        if (
          Boolean(item.dependFields) &&
          Array.isArray(item.dependFields) &&
          typeof item.dependFieldsonchange === "function"
        ) {
          dependData[item.name] = item.dependFieldsonchange;
        }
      });
      return dependData;
    }, [oldfielddata]);
    //console.log(dependField, dependFieldFunc);
    const handleChange = (event: any, extraData: any = "") => {
      const name = event.target.name;
      const value = event.target.value;
      setColomnValue((values) => ({ ...values, [name]: value }));
      if (Boolean(value) && (ErrorData[name]?.isError ?? false)) {
        setErrorData((error) => ({
          ...error,
          [name]: { isError: false, ErrorMessage: " " },
        }));
      }
      if (Boolean(dependField[name])) {
        //console.log(extraData);
        dependField[name].forEach((item) => {
          if (typeof dependFieldFunc[item] === "function") {
            let returnvallue = dependFieldFunc[item](
              colomnValue,
              value,
              name,
              extraData
            );
            if (Boolean(returnvallue)) {
              setFields((value) => {
                return value.map((itemfiels) => {
                  let newvalueData = itemfiels;
                  if (itemfiels.name === item) {
                    if (typeof returnvallue === "object") {
                      newvalueData = {
                        ...newvalueData,
                        ...returnvallue,
                      };
                      if (returnvallue.hasOwnProperty("isVisible")) {
                        setInitialVisibleColumn((values) => ({
                          ...values,
                          [itemfiels.name]: Boolean(returnvallue?.isVisible),
                        }));
                      }
                      if (returnvallue.hasOwnProperty("__DATA")) {
                        setColomnValue((values) => ({
                          ...values,
                          [itemfiels.name]: returnvallue.__DATA,
                        }));
                      }
                    }
                  }
                  return newvalueData;
                });
              });
            }
          }
        });
      }
    };
    useEffect(() => {
      setColomnValue(initialDataValue);
      Object.keys(initialDataValue).forEach((item) => {
        let event = { target: { name: item, value: initialDataValue[item] } };
        handleChange(event);
      });
    }, [JSON.stringify(initialDataValue)]);

    const onBlur = () => {
      fields.forEach((element) => {
        if (typeof element?.onBlurHandler === "function") {
          element.onBlurHandler(colomnValue[element.name], colomnValue);
        }
      });
    };
    const handleClick = () => {
      if (
        ValidateColumnValue(fields, colomnValue, initialVisibleColumn, "FIRST")
      ) {
        onAction(colomnValue, initialVisibleColumn);
      }
    };
    const handleSecondButtonClick = () => {
      if (
        !submitSecondValidtion ||
        ValidateColumnValue(fields, colomnValue, initialVisibleColumn, "SECOND")
      ) {
        submitSecondAction(colomnValue, initialVisibleColumn);
      }
    };
    visibleColumns = useMemo(() => {
      return fields.map((column) => {
        let onChange = () => {
          setInitialVisibleColumn((values) => ({
            ...values,
            [column.name]: !initialVisibleColumn[column.name],
          }));
        };
        return {
          id: column.name,
          isTableHidden: column?.isTableHidden ?? false,
          columnName: column?.label ?? "",
          isColumnHidingDisabled: column?.isColumnHidingDisabled ?? false,
          getToggleHiddenProps: () => {
            return {
              checked: initialVisibleColumn[column.name] ?? true,
              onChange,
              style: { cursor: "pointer" },
            };
          },
        };
      });
    }, [fields, initialVisibleColumn]);
    //console.log(fields, visibleColumns);
    const ValidateColumnValue = (
      fields,
      colomnValue,
      initialVisibleColumn,
      arg1
    ) => {
      let isValidForm = true;
      let errorData = {};
      fields.forEach((element) => {
        if (initialVisibleColumn[element.name] ?? true) {
          if (
            (element?.isRequired ?? false) &&
            !Boolean(colomnValue[element.name])
          ) {
            errorData = {
              ...errorData,
              [element.name]: {
                isError: true,
                ErrorMessage: "This is required Field.",
              },
            };
            isValidForm = false;
          } else {
            let errorMessage = "";
            if (typeof element?.validate === "function") {
              errorMessage = element.validate(
                colomnValue[element.name],
                colomnValue,
                arg1
              );
            }
            //console.log(element.name, typeof element?.validate, errorMessage);
            isValidForm = Boolean(errorMessage) ? false : isValidForm;
            errorData = {
              ...errorData,
              [element.name]: {
                isError: Boolean(errorMessage),
                ErrorMessage: Boolean(errorMessage) ? errorMessage : " ",
              },
            };
          }
        } else {
          errorData = {
            ...errorData,
            [element.name]: {
              isError: false,
              ErrorMessage: " ",
            },
          };
        }
      });
      // console.log(errorData);
      setErrorData(errorData);
      return isValidForm;
    };

    useImperativeHandle(ref, () => ({
      columnVal: colomnValue,
      onAction: onAction,
    }));

    const customParameter = useContext(CustomPropertiesConfigurationContext);

    const { dynamicAmountSymbol, currencyFormat, decimalCount } =
      customParameter;

    return (
      <Fragment>
        <Paper
          style={{
            width: "100%",
          }}
          sx={propStyles.paperStyle}
        >
          {hideHeader ? null : (
            <Toolbar
              className={classes.root}
              variant={dense ? "dense" : "regular"}
              sx={propStyles.toolbarStyles}
            >
              <Typography
                className={classes.title}
                color="inherit"
                variant={"h6"}
                component="div"
                sx={propStyles.titleStyle}
              >
                {title}
              </Typography>
              {allowColumnHiding ? (
                <ColumnVisibility
                  visibleColumns={visibleColumns}
                  defaultHiddenColumns={[]}
                  classes={classes}
                  IconButtonStyle={propStyles.IconButtonStyle}
                />
              ) : null}
            </Toolbar>
          )}
          <div style={{ flexGrow: "1", margin: "15px" }}>
            <Grid
              container
              spacing={2}
              justifyContent="flex-start"
              alignItems="center"
              direction="row"
            >
              <Grid
                item
                xs={submitButtonHide ? 12 : 10}
                container
                spacing={1}
                justifyContent="flex-start"
                alignItems="center"
                // style={{ marginBottom: "10px" }}
              >
                {fields.map((column) => {
                  return initialVisibleColumn[column.name] ?? true ? (
                    <Grid
                      key={`gird${column.name}`}
                      item
                      xs={column?.gridconfig?.xs ?? 6}
                      sm={column?.gridconfig?.sm ?? 3}
                    >
                      {(column?.type ?? "text").toLowerCase() === "select" ? (
                        <SelectRenderOnly
                          name={column.name}
                          options={column?.optiondata ?? []}
                          _optionsKey={column?._optionsKey ?? ""}
                          handleChange={handleChange}
                          label={column?.label ?? ""}
                          fullWidth
                          value={colomnValue[column.name]}
                          selectVariant="regular"
                          defaultOptionLabel={
                            column?.defaultOptionLabel ?? "Select Value"
                          }
                          handleBlur={onBlur}
                          disabled={
                            column?.isDisabled ?? false
                              ? true
                              : !isDisplayOnly
                              ? loading || submitSecondLoading
                              : true
                          }
                          skipDefaultOption={true}
                          error={
                            Boolean(ErrorData[column.name]?.isError)
                              ? ErrorData[column.name]?.ErrorMessage ?? "Error"
                              : ""
                          }
                          touched={true}
                          defaultSpaceAdd={true}
                          required={column?.isRequired ?? false}
                          //error={error?.company ?? ""}
                          //readOnly={mode !== "new" ? true : false}
                          //handleBlur={handleChange}
                        />
                      ) : (column?.type ?? "text").toLowerCase() ===
                        "spacer" ? (
                        <Spacer key={`${column.name}`} {...column} />
                      ) : (column?.type ?? "text").toLowerCase() ===
                        "typography" ? (
                        <MyTypography
                          name={column.name}
                          label={column?.label ?? ""}
                          TypographyProps={{ color: "secondary" }}
                        />
                      ) : (column?.type ?? "text").toLowerCase() ===
                        "datetimepicker" ? (
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <KeyboardDateTimePicker
                            format={column?.dateFormat ?? "dd/MM/yyyy HH:mm:ss"}
                            value={
                              colomnValue[column.name] === "" ||
                              colomnValue[column.name] === null
                                ? null
                                : new Date(colomnValue[column.name])
                            }
                            label={column?.label ?? ""}
                            views={[
                              "year",
                              "month",
                              "day",
                              "hours",
                              "minutes",
                              "seconds",
                            ]}
                            onChange={(value) => {
                              let ele = {
                                target: { name: column.name, value },
                              };
                              handleChange(ele);
                            }}
                            disabled={
                              column?.isDisabled ?? false
                                ? true
                                : !isDisplayOnly
                                ? loading || submitSecondLoading
                                : true
                            }
                            slots={{
                              textField: TextField,
                            }}
                            slotProps={{
                              textField: {
                                name: column.name,
                                error: Boolean(ErrorData[column.name]?.isError),
                                InputLabelProps: {
                                  shrink: true,
                                },
                              },
                              actionBar: {
                                actions: ["today", "accept", "cancel"],
                              },
                            }}
                            sx={{ width: "100%", mb: 3 }}
                          />
                        </LocalizationProvider>
                      ) : (column?.type ?? "text").toLowerCase() ===
                          "amountfield" ||
                        (column?.type ?? "text").toLowerCase() ===
                          "numberfield" ? (
                        <TextField
                          sx={{ mb: 3 }}
                          label={column?.label ?? ""}
                          value={colomnValue[column.name]}
                          onChange={handleChange}
                          InputProps={{
                            inputComponent: NumberFormatCustom,
                            inputProps: {
                              FormatProps: {
                                ...column?.FormatProps,
                                type: column?.type ?? "",
                                name: column?.name ?? "",
                              },
                            },
                            startAdornment:
                              column?.type === "amountfield" ? (
                                <InputAdornment
                                  position="start"
                                  style={{ padding: "0rem 0.6rem 0rem 0rem" }}
                                >
                                  {column?.StartAdornment
                                    ? getCurrencySymbol(column?.StartAdornment)
                                    : getCurrencySymbol(dynamicAmountSymbol) ??
                                      "₹"}
                                </InputAdornment>
                              ) : null,
                          }}
                          InputLabelProps={{ shrink: true }}
                          disabled={
                            column?.isDisabled ?? false
                              ? true
                              : !isDisplayOnly
                              ? loading || submitSecondLoading
                              : true
                          }
                          onKeyDown={(e) => {
                            if (
                              ((e.key === "Tab" || e.key === "Enter") &&
                                column?.entertoSubmit) ??
                              false
                            ) {
                              inputButtonRef?.current?.click?.();
                            }
                          }}
                        />
                      ) : // <CurrencyRowCellRenderer
                      //   column={{
                      //     color: "blue",
                      //     TableCellProps: { yourTableCellProp: "value" },
                      //   }}
                      // />
                      (column?.type ?? "text").toLowerCase() ===
                        "autocomplete" ? (
                        <MyAutocomplete
                          name={column?.name ?? ""}
                          placeholder={column?.placeholder ?? ""}
                          label={column?.label ?? ""}
                          options={column?.optiondata}
                          _optionsKey={column?._optionsKey}
                          handleChange={handleChange}
                          disabled={
                            column?.isDisabled ?? false
                              ? true
                              : !isDisplayOnly
                              ? loading || submitSecondLoading
                              : true
                          }
                        />
                      ) : (
                        <TextField
                          autoFocus={column?.defaultfocus ?? false}
                          label={column?.label ?? ""}
                          fullWidth
                          placeholder={column?.placeholder ?? ""}
                          type={"text"}
                          name={column.name}
                          value={colomnValue[column.name]}
                          InputProps={{
                            style: {
                              background: Boolean(column?.isDisabled)
                                ? "#e7e5e563"
                                : "",
                            },
                          }}
                          onChange={(e) => {
                            if (
                              (column?.maxLength ?? -1) === -1 ||
                              e.target.value.length <= column?.maxLength
                            ) {
                              const numberRegEx = /^[0-9\b]+$/;
                              const alphaNumericRegEx = /^[a-zA-Z0-9\b]+$/;
                              const isAllowed =
                                e.target.value === ""
                                  ? true
                                  : (column?.type ?? "text") === "number"
                                  ? numberRegEx.test(e.target.value)
                                  : (column?.type ?? "text") === "alphanumeric"
                                  ? alphaNumericRegEx.test(e.target.value)
                                  : true;
                              if (isAllowed) {
                                handleChange(e);
                              }
                            }
                            // const regex = ;
                            // if ((column?.type ?? "text") != "number" || e.target.value === "" || ((column?.type ?? "text") === "number" && regex.test(e.target.value))) {
                            //   if ((column?.maxLength ?? -1) === -1) {
                            //     handleChange(e);
                            //   } else if (
                            //     e.target.value.length <= column?.maxLength
                            //   ) {
                            //     handleChange(e);
                            //   }
                            // }
                          }}
                          InputLabelProps={{ shrink: true }}
                          //required
                          required={column?.isRequired ?? false}
                          autoComplete={column?.autoComplete ?? "off"}
                          disabled={
                            column?.isDisabled ?? false
                              ? true
                              : !isDisplayOnly
                              ? loading || submitSecondLoading
                              : true
                          }
                          error={Boolean(ErrorData[column.name]?.isError)}
                          helperText={
                            <div style={{ display: "flex" }}>
                              <FormHelperText>
                                {Boolean(ErrorData[column.name]?.isError)
                                  ? ErrorData[column.name]?.ErrorMessage ??
                                    "Error"
                                  : " "}
                              </FormHelperText>
                              {(column?.maxLength ?? 0) > 0 &&
                              Boolean(column?.showMaxLength ?? false) ? (
                                <FormHelperText
                                  error={false}
                                  // disabled={isSubmitting}
                                  style={{
                                    flex: 1,
                                    textAlign: "right",
                                    margin: "5px 15px 0 0",
                                  }}
                                >
                                  {colomnValue[column.name].length}/
                                  {column?.maxLength}
                                </FormHelperText>
                              ) : null}
                            </div>
                          }
                          onKeyDown={(e) => {
                            if (
                              ((e.key === "Tab" || e.key === "Enter") &&
                                column?.entertoSubmit) ??
                              false
                            ) {
                              inputButtonRef?.current?.click?.();
                            }
                            if (
                              (e.key === "Tab" && column?.tabToSubmit) ??
                              false
                            ) {
                              secondButtonRef?.current?.click?.();
                            }
                          }}
                        />
                      )}
                    </Grid>
                  ) : null;
                })}
              </Grid>
              {submitButtonHide ? null : (
                <Grid
                  item
                  xs={2}
                  container
                  justifyContent="center"
                  alignItems="center"
                  spacing={2}
                >
                  <Grid
                    key={`gird${submitButtonName}`}
                    item
                    sx={{ display: displayStyle1 }}
                  >
                    <GradientButton
                      disabled={loading || submitSecondLoading}
                      endIcon={loading ? <CircularProgress size={20} /> : null}
                      onClick={handleClick}
                      ref={inputButtonRef}
                    >
                      {submitButtonName}
                    </GradientButton>
                  </Grid>
                  {submitSecondButtonHide ? null : (
                    <Grid
                      key={`gird${submitSecondButtonName}`}
                      item
                      sx={{ display: displayStyle2 }}
                    >
                      <GradientButton
                        disabled={loading || submitSecondLoading}
                        ref={secondButtonRef}
                        endIcon={
                          submitSecondLoading ? (
                            <CircularProgress size={20} />
                          ) : null
                        }
                        onClick={handleSecondButtonClick}
                      >
                        {submitSecondButtonName}
                      </GradientButton>
                    </Grid>
                  )}
                  {submitThirdButtonHide ? null : (
                    <Grid
                      key={`gird${submitThirdButtonName}`}
                      item
                      sx={{ display: displayStyle3 }}
                    >
                      <GradientButton
                        disabled={submitThirdLoading}
                        endIcon={
                          submitThirdLoading ? (
                            <CircularProgress size={20} />
                          ) : null
                        }
                        onClick={submitThirdAction}
                        ref={thirdButtonRef}
                        sx={{ display: displayStyle3 }}
                      >
                        {submitThirdButtonName}
                      </GradientButton>
                    </Grid>
                  )}
                </Grid>
              )}
            </Grid>
          </div>
        </Paper>
      </Fragment>
    );
  }
);

const NumberFormatCustom = (props) => {
  const { inputRef, onChange, FormatProps, ...other } = props;
  const { type, name, ...others } = FormatProps;
  const customParameter = useContext(CustomPropertiesConfigurationContext);

  const {
    dynamicAmountSymbol,
    currencyFormat,
    decimalCount,
    dynamicAmountGroupStyle,
  } = customParameter;

  const defaultOptions =
    type === "amountfield"
      ? {
          thousandSeparator: true,
          isNumericString: true,
          decimalScale: FormatProps?.decimalScale
            ? FormatProps?.decimalScale
            : decimalCount ?? 2,
          fixedDecimalScale: true,
          thousandsGroupStyle: FormatProps?.thousandsGroupStyle
            ? FormatProps?.thousandsGroupStyle
            : dynamicAmountGroupStyle ?? "lakh",
        }
      : {};

  return (
    <NumericFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            value: values.value,
            name,
          },
        });
      }}
      {...defaultOptions}
      {...others}
    />
  );
};

const MyAutocomplete = ({
  name,
  label,
  placeholder,
  options,
  _optionsKey,
  handleChange,
  freeSolo = false,
  disabled,
}) => {
  /* eslint-disable array-callback-return */
  const myGetOptionLabel = useCallback(getOptionLabel(freeSolo), []);
  const { authState }: any = useContext(AuthContext);
  const { data, status, isLoading, isFetching, error } = useQuery(
    [_optionsKey],
    () => options(...[undefined, authState])
  );

  return (
    <Autocomplete
      sx={{ mb: 3 }}
      options={data ?? []}
      onChange={(_, newValue) => {
        const ele = {
          target: {
            value: newValue?.value,
            name: name,
          },
        };
        handleChange(ele);
      }}
      disabled={disabled}
      //@ts-ignore
      getOptionLabel={myGetOptionLabel}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            label={label ?? ""}
            placeholder={placeholder ?? ""}
            name={name}
            autoComplete="disable"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <Fragment>
                  {isLoading || isFetching ? (
                    <CircularProgress
                      size={25}
                      color="secondary"
                      variant="indeterminate"
                    />
                  ) : null}
                  {params.InputProps.endAdornment}
                </Fragment>
              ),
            }}
            InputLabelProps={{ shrink: true }}
          />
        );
      }}
      renderOption={(props, option, other) => {
        props["key"] = props["id"];
        let { selected, inputValue } = other;
        let label = myGetOptionLabel(option);
        const matches = match(label, inputValue);
        const parts = parse(label, matches);
        const labelJSX = parts.map((part, index) => (
          <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
            {part.text}
          </span>
        ));
        return (
          <li style={{ whiteSpace: "pre" }} {...props}>
            {/* {showCheckbox ? <Checkbox checked={selected} /> : null} */}
            {labelJSX}
          </li>
        );
      }}
    />
  );
};
