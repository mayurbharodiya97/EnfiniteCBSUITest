import {
  Fragment,
  useState,
  useMemo,
  useRef,
  useEffect,
  forwardRef,
} from "react";
import { TextField } from "components/styledComponent/textfield";
import { GradientButton } from "components/styledComponent/button";
import { ColumnVisibility } from "components/dataTable/columnVisibility";
import { SelectRenderOnly } from "components/common/select";
import { Spacer } from "components/common";
import {
  CircularProgress,
  Grid,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@mui/styles";
//import { Label } from "reactstrap";
import { useImperativeHandle } from "react";

const useStyles = makeStyles((theme: any) => ({
  root: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    background: "var(--theme-color5)",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--theme-color2)",
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
    const { t } = useTranslation();
    const classes = useStyles();
    const inputButtonRef = useRef<any>(null);
    const secondButtonRef = useRef<any>(null);
    const thirdButtonRef = useRef<any>(null);
    const [ErrorData, setErrorData] = useState({});
    const [colomnValue, setColomnValue] = useState(initialDataValue);
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
          columnName: t(column?.label) ?? "",
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
                style={{ marginBottom: "10px" }}
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
                          label={
                            column?.required
                              ? `${t(column?.label)} *`
                              : t(column?.label) ?? ""
                          }
                          fullWidth
                          value={colomnValue[column.name]}
                          selectVariant="regular"
                          defaultOptionLabel={
                            column?.defaultOptionLabel ?? "Select Value"
                          }
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
                          //error={error?.company ?? ""}
                          //readOnly={mode !== "new" ? true : false}
                          //handleBlur={handleChange}
                        />
                      ) : (column?.type ?? "text").toLowerCase() ===
                        "spacer" ? (
                        <Spacer key={`${column.name}`} {...column} />
                      ) : (
                        <TextField
                          autoFocus={column?.defaultfocus ?? false}
                          label={
                            column?.required
                              ? `${t(column?.label)} *`
                              : t(column?.label) ?? ""
                          }
                          fullWidth
                          placeholder={column?.placeholder ?? ""}
                          type={column?.type ?? "text"}
                          name={column.name}
                          value={colomnValue[column.name]}
                          onChange={handleChange}
                          InputLabelProps={{ shrink: true }}
                          //required

                          autoComplete={column?.autoComplete ?? "off"}
                          disabled={
                            column?.isDisabled ?? false
                              ? true
                              : !isDisplayOnly
                              ? loading || submitSecondLoading
                              : true
                          }
                          InputProps={{
                            style: {
                              background: Boolean(column?.isDisabled)
                                ? "#e7e5e563"
                                : "",
                            },
                          }}
                          error={Boolean(ErrorData[column.name]?.isError)}
                          helperText={
                            Boolean(ErrorData[column.name]?.isError)
                              ? ErrorData[column.name]?.ErrorMessage ?? "Error"
                              : " "
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
                    <Grid key={`gird${submitSecondButtonName}`} item>
                      <GradientButton
                        disabled={loading || submitSecondLoading}
                        endIcon={
                          submitSecondLoading ? (
                            <CircularProgress size={20} />
                          ) : null
                        }
                        onClick={handleSecondButtonClick}
                        ref={secondButtonRef}
                        sx={{ display: displayStyle2 }}
                      >
                        {submitSecondButtonName}
                      </GradientButton>
                    </Grid>
                  )}
                  {submitThirdButtonHide ? null : (
                    <Grid key={`gird${submitThirdButtonName}`} item>
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
