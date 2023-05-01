import {
  FC,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { queryClient } from "cache";
import { useSnackbar } from "notistack";
import { cloneDeep } from "lodash-es";
import { useMutation, useQueries, useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import Dialog from "@mui/material/Dialog";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { Alert } from "components/common/alert";
import { SubmitFnType } from "packages/form";
import * as API from "../api";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";
import { MasterDetailsForm } from "components/formcomponent";
import { format } from "date-fns";
import { AuthContext } from "pages_audit/auth";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { EditViewDynamicReportConfigMetaData } from "./metaData";
import { GeneralAPI } from "registry/fns/functions";
import { AppBar, Grid, TextField, Toolbar, Typography } from "@mui/material";
import { GradientButton } from "components/styledComponent/button";
import { RetrievalParametersGrid } from "./retrievalParameters";
import { makeStyles } from "@mui/styles";

const useTypeStyles = makeStyles((theme: any) => ({
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
  refreshiconhover: {},
}));

interface updateMasterDataType {
  data: object;
  displayData?: object;
  endSubmit?: any;
  setFieldError?: any;
}

const updateMasterDataWrapperFn =
  (updateMasterData) =>
  async ({ data }: updateMasterDataType) => {
    return updateMasterData(data);
  };

const ViewEditDynamicReportConfig: FC<{
  isDataChangedRef: any;
  closeDialog?: any;
  defaultView?: "view" | "edit" | "confirm";
  readOnly?: boolean;
  transactionID: number;
  data: any;
}> = ({
  isDataChangedRef,
  closeDialog,
  defaultView = "view",
  readOnly = false,
  transactionID,
  data: reqData,
}) => {
  const headerClasses = useTypeStyles();
  const { enqueueSnackbar } = useSnackbar();
  const myRef = useRef<any>(null);
  const myVerifyCntRef = useRef(0);
  const mySqlSyntaxRef = useRef<any>(true);
  const myoldSqlSyntaxRef = useRef<any>("");
  const mynewSqlSyntaxRef = useRef<any>("");
  const myparameterDataRef = useRef<any>([]);
  const [isOpenRerieval, setIsOpenRerieval] = useState(false);
  const [formName, setformName] = useState("");
  const [sqlSyntax, setSqlSyntax] = useState("");
  const [errorObjData, seterrorObjData] = useState({
    isError: false,
    error: { error_msg: "", error_detail: "" },
  });
  const [formMode, setFormMode] = useState(defaultView);
  const [openAccept, setOpenAccept] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [isLocalLoading, setLocalLoading] = useState(false);
  const moveToViewMode = useCallback(() => setFormMode("view"), [setFormMode]);
  const moveToEditMode = useCallback(() => setFormMode("edit"), [setFormMode]);
  const { authState } = useContext(AuthContext);
  const mutation = useMutation(
    updateMasterDataWrapperFn(API.updateMastersData()),
    {
      onError: (error: any, { endSubmit }) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        endSubmit(false, errorMsg, error?.error_detail ?? "");
      },
      onSuccess: (data, { endSubmit }) => {
        // queryClient.refetchQueries(["getFormData", transactionID]);
        endSubmit(true, "");
        enqueueSnackbar(data, {
          variant: "success",
        });
        isDataChangedRef.current = true;
        moveToViewMode();
        if (typeof closeDialog === "function") {
          closeDialog();
        }
      },
    }
  );
  const mutationConfirm = useMutation(
    updateMasterDataWrapperFn(API.updateMastersData()),
    {
      onError: (error: any) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
      },
      onSuccess: (data) => {
        enqueueSnackbar(data, {
          variant: "success",
        });
        isDataChangedRef.current = true;
        if (typeof closeDialog === "function") {
          closeDialog();
        }
      },
      onSettled: () => {
        onActionCancel();
      },
    }
  );
  const verifySql = useMutation(API.verifyDynRptSqlSyntax, {
    onError: (error: any) => {},
    onSuccess: (data, { detailsData }) => {
      mySqlSyntaxRef.current = true;
      setLocalError(false);
      let newDetailsData = data?.[0]?.DETAILS;
      let oldDetailsData = myRef.current?.GetGirdData();
      console.log(newDetailsData, oldDetailsData);
      const getDifference = (array1, array2) => {
        return array1.filter((object1) => {
          return !array2.some((object2) => {
            return object1.COLUMN_ACCESSOR === object2.COLUMN_ACCESSOR;
          });
        });
      };
      const diffNewData = getDifference(newDetailsData, oldDetailsData);
      const newRowData = diffNewData.map((item) => {
        const initialData = {
          ...item,
          _isNewRow: true,
        };
        return initialData;
      });
      const diffDeleteData = getDifference(oldDetailsData, newDetailsData);
      const deleteRowData = diffDeleteData.map((item) => {
        const initialData = {
          ...item,
          _hidden: true,
        };
        return initialData;
      });

      const getDetailDifference = (array1, array2) => {
        return array1.filter((object1) => {
          return array2.some((object2) => {
            return object1.COLUMN_ACCESSOR === object2.COLUMN_ACCESSOR;
          });
        });
      };
      let getDetailData = getDetailDifference(oldDetailsData, newDetailsData);
      getDetailData = getDetailData.map((item) => {
        return { ...item, _hidden: false };
      });
      let newDatailsData = [...getDetailData, ...deleteRowData, ...newRowData];
      newDatailsData = newDatailsData.map((item, index) => {
        return {
          ...item,
          SR_CD: index + 1,
          COLUMN_NAME: (item?.COLUMN_NAME ?? "").replaceAll("_", " "),
        };
      });

      myRef.current?.setGridData(newDatailsData);
      myparameterDataRef.current = data?.[0]?.PARAMETERS?.map((item) => {
        let oldData = myparameterDataRef.current?.filter((item2) => {
          if (item2?.COLUMN_ACCESSOR === item?.COLUMN_ACCESSOR) {
            return true;
          }
          return false;
        });
        if (Array.isArray(oldData) && oldData?.length > 0) {
          return {
            ...item,
            COLUMN_FORMAT: oldData[0]?.COLUMN_FORMAT,
            COLUMN_NAME: oldData[0]?.COLUMN_NAME,
            COLUMN_TYPE: oldData[0]?.COLUMN_TYPE,
          };
        }
        return item;
      });
      setformName("dynDetail" + myVerifyCntRef.current);
      myVerifyCntRef.current = myVerifyCntRef.current + 1;
      enqueueSnackbar("Query Successfully Verified.", {
        variant: "success",
      });
    },
  });

  const onSubmitHandler = ({ data, displayData, endSubmit, setFieldError }) => {
    if (!mySqlSyntaxRef.current) {
      setLocalError(true, "Please Verify Query..", "");
      endSubmit(true, "Please Verify Query..");
      return;
    }
    setLocalLoading(true);
    const setLocalLoadingData = (isLoading, error = "", errorDetail = "") => {
      setLocalLoading(isLoading);
      endSubmit(!isLoading, error, errorDetail);
    };
    data["COMP_CD"] = authState.companyID;
    data["BRANCH_CD"] = authState.user.branchCode;
    data["PARAMETERS"] = myparameterDataRef.current;
    if (mynewSqlSyntaxRef.current !== myoldSqlSyntaxRef.current) {
      data["SQL_ANSI_SYNTAX"] = mynewSqlSyntaxRef.current;
      data["_OLDROWVALUE"] = {
        ...data["_OLDROWVALUE"],
        SQL_ANSI_SYNTAX: myoldSqlSyntaxRef.current,
      };
      data["_UPDATEDCOLUMNS"] = [...data["_UPDATEDCOLUMNS"], "SQL_ANSI_SYNTAX"];
    }

    console.log(data);

    //mutation.mutate({ data, displayData, endSubmit, setFieldError });
  };

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getDynamicReportConfigData", transactionID], () =>
    API.getDynamicReportConfigData(transactionID)
  );
  const setLocalError = (isError, error_msg = "", error_detail = "") => {
    seterrorObjData({
      isError: isError,
      error: { error_msg: error_msg, error_detail: error_detail },
    });
  };
  //const getMiscData = useQueries(API.GetMiscValue, ["GetMiscValue"]);
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getDynamicReportConfigData", transactionID]);
    };
  }, [transactionID]);

  useEffect(() => {
    setSqlSyntax(data?.[0]?.SQL_ANSI_SYNTAX ?? "");
    myparameterDataRef.current = data?.[0]?.PARA_DETAILS ?? [];
    myoldSqlSyntaxRef.current = data?.[0]?.SQL_ANSI_SYNTAX ?? "";
    mynewSqlSyntaxRef.current = data?.[0]?.SQL_ANSI_SYNTAX ?? "";
  }, [data]);

  let metadata: MasterDetailsMetaData = {} as MasterDetailsMetaData;
  metadata = cloneDeep(
    EditViewDynamicReportConfigMetaData
  ) as MasterDetailsMetaData;
  const metaData = useMemo(() => {
    let myColumns = metadata.detailsGrid.columns;
    if (formMode === "view") {
      myColumns = metadata.detailsGrid.columns.filter(
        (one) => one.accessor !== "_hidden"
      );
    }
    return {
      ...metadata,
      detailsGrid: { ...metadata.detailsGrid, columns: myColumns },
    };
  }, [formMode, metadata]);

  const onPopupYesAccept = (rows) => {
    onActionCancel();
  };
  const onPopupYesReject = (rows) => {
    onActionCancel();
  };
  const onActionCancel = () => {
    setOpenAccept(false);
    setOpenReject(false);
  };

  const onCloseDialog = () => {
    setIsOpenRerieval(false);
  };
  const onSaveParameters = (data) => {
    myparameterDataRef.current = data;
    setIsOpenRerieval(false);
  };

  return (
    <>
      {isLoading ? (
        <div style={{ margin: "2rem" }}>
          <LoaderPaperComponent />
          {typeof closeDialog === "function" ? (
            <div style={{ position: "absolute", right: 0, top: 0 }}>
              <IconButton onClick={closeDialog}>
                <HighlightOffOutlinedIcon />
              </IconButton>
            </div>
          ) : null}
        </div>
      ) : isError === true ? (
        <>
          <div style={{ margin: "1.2rem" }}>
            <Alert
              severity="error"
              errorMsg={error?.error_msg ?? ""}
              errorDetail={error?.error_detail ?? ""}
            />
          </div>
          {typeof closeDialog === "function" ? (
            <div style={{ position: "absolute", right: 0, top: 0 }}>
              <IconButton onClick={closeDialog}>
                <HighlightOffOutlinedIcon />
              </IconButton>
            </div>
          ) : null}
        </>
      ) : (
        <>
          <Grid container>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              style={{
                paddingTop: "10px",
                paddingLeft: "10px",
                paddingRight: "10px",
              }}
            >
              <AppBar
                position="relative"
                color="secondary"
                style={{ marginBottom: "5px" }}
              >
                <Toolbar className={headerClasses.root} variant={"dense"}>
                  <Typography
                    className={headerClasses.title}
                    color="inherit"
                    variant={"h6"}
                    component="div"
                  >
                    Dynamic Report Configure
                  </Typography>
                  {formMode === "edit" ? (
                    <>
                      <GradientButton
                        onClick={(event) => {
                          myRef.current?.onSubmitHandler(event);
                        }}
                        disabled={isLocalLoading}
                        endIcon={
                          isLocalLoading ? <CircularProgress size={20} /> : null
                        }
                      >
                        Save
                      </GradientButton>
                      <GradientButton
                        onClick={moveToViewMode}
                        disabled={isLocalLoading}
                        color={"primary"}
                      >
                        Cancel
                      </GradientButton>
                    </>
                  ) : (
                    <>
                      <GradientButton onClick={moveToEditMode}>
                        Edit
                      </GradientButton>
                      <GradientButton onClick={closeDialog}>
                        Close
                      </GradientButton>
                    </>
                  )}
                </Toolbar>
              </AppBar>
            </Grid>
            <Grid item xs={8} sm={6} md={8}>
              {formMode === "view" ? (
                <MasterDetailsForm
                  key={"dynReportConfig" + formMode}
                  formNameMaster={"dynRptConfigMaster" + formMode}
                  formName={formName + formMode}
                  metaData={metadata}
                  ref={myRef}
                  initialData={{
                    _isNewRow: false,
                    ...data?.[0],
                    DETAILS_DATA: data?.[0]?.DETAILS,
                  }}
                  displayMode={formMode}
                  isLoading={true}
                  onSubmitData={onSubmitHandler}
                  isNewRow={false}
                  formStyle={{
                    background: "white",
                    height: "25vh",
                    overflowY: "auto",
                    overflowX: "hidden",
                  }}
                  hideHeader={true}
                >
                  {({ isSubmitting, handleSubmit }) => {
                    return <></>;
                  }}
                </MasterDetailsForm>
              ) : formMode === "edit" ? (
                <MasterDetailsForm
                  key={"dynReportConfig" + formMode}
                  formNameMaster={"dynRptConfigMaster" + formMode}
                  formName={formName + formMode}
                  metaData={metadata}
                  ref={myRef}
                  initialData={{
                    _isNewRow: false,
                    ...data?.[0],
                    DETAILS_DATA: data?.[0]?.DETAILS,
                  }}
                  displayMode={formMode}
                  isLoading={isLocalLoading}
                  onSubmitData={onSubmitHandler}
                  isNewRow={false}
                  formStyle={{
                    background: "white",
                    height: "25vh",
                    overflowY: "auto",
                    overflowX: "hidden",
                  }}
                  hideHeader={true}
                  isError={errorObjData.isError}
                  errorObj={errorObjData.error}
                >
                  {({ isSubmitting, handleSubmit }) => {
                    return <></>;
                  }}
                </MasterDetailsForm>
              ) : formMode === "confirm" ? (
                <>
                  <MasterDetailsForm
                    key={"schemeMaster" + formMode}
                    metaData={metaData}
                    ref={myRef}
                    initialData={{
                      _isNewRow: false,
                      ...reqData[0].data,
                      DETAILS_DATA: data,
                    }}
                    displayMode={"view"}
                    isLoading={true}
                    onSubmitData={onSubmitHandler}
                    isNewRow={false}
                    formStyle={{
                      background: "white",
                      height: "15vh",
                      overflowY: "auto",
                      overflowX: "hidden",
                    }}
                    containerstyle={{
                      paddingLeft: "10px",
                      paddingRight: "10px",
                    }}
                  >
                    {({ isSubmitting, handleSubmit }) => {
                      //console.log(formMode, isSubmitting);
                      return (
                        <>
                          <Button
                            //disabled={isSubmitting}
                            //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                            color={"primary"}
                            onClick={(event) => {
                              if (
                                reqData[0].data?.LAST_ENTERED_BY ===
                                authState.user.id
                              ) {
                                enqueueSnackbar(
                                  "You can not confirm your own Entry.",
                                  {
                                    variant: "warning",
                                  }
                                );
                              } else {
                                setOpenAccept(true);
                              }
                            }}
                          >
                            Accept
                          </Button>
                          <Button
                            //disabled={isSubmitting}
                            //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                            color={"primary"}
                            onClick={(event) => {
                              if (
                                reqData[0].data?.LAST_ENTERED_BY ===
                                authState.user.id
                              ) {
                                enqueueSnackbar(
                                  "You can not reject your own Entry.",
                                  {
                                    variant: "warning",
                                  }
                                );
                              } else {
                                setOpenReject(true);
                              }
                            }}
                          >
                            Reject
                          </Button>
                          <Button
                            onClick={closeDialog}
                            //disabled={isSubmitting}
                            color={"primary"}
                          >
                            Close
                          </Button>
                        </>
                      );
                    }}
                  </MasterDetailsForm>
                  {openAccept ? (
                    <PopupMessageAPIWrapper
                      MessageTitle="Confirmation"
                      Message="Do You want to accept this Request?"
                      onActionYes={onPopupYesAccept}
                      onActionNo={() => onActionCancel()}
                      rows={reqData[0].data}
                      open={openAccept}
                      loading={mutationConfirm.isLoading}
                    />
                  ) : null}
                  {openReject ? (
                    <PopupMessageAPIWrapper
                      MessageTitle="Confirmation"
                      Message="Do You want to reject this Request?"
                      onActionYes={onPopupYesReject}
                      onActionNo={() => onActionCancel()}
                      rows={reqData[0].data}
                      open={openReject}
                      loading={mutationConfirm.isLoading}
                    />
                  ) : null}
                </>
              ) : null}
              ;
            </Grid>
            <Grid item xs={4} sm={6} md={4} style={{ paddingRight: "10px" }}>
              <Grid item xs={12} sm={12} md={12}>
                {verifySql.isError ? (
                  <div style={{ marginBottom: "5px" }}>
                    <AppBar position="relative" color="primary">
                      <Alert
                        severity="error"
                        errorMsg={
                          verifySql?.error?.error_msg ??
                          "Something went to wrong.."
                        }
                        errorDetail={verifySql?.error?.error_detail}
                        color="error"
                      />
                    </AppBar>
                  </div>
                ) : null}
              </Grid>
              <Grid item xs={12} sm={12} md={12} style={{ paddingTop: "12px" }}>
                <TextField
                  id="outlined-multiline-static"
                  label="SQL ANSI Query Syntax"
                  multiline
                  minRows={verifySql.isError ? 21 : 24}
                  value={sqlSyntax}
                  variant="outlined"
                  color="secondary"
                  style={{ width: "100%" }}
                  disabled={formMode === "view" ? true : false}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(event) => {
                    mynewSqlSyntaxRef.current = event.target.value;
                    setSqlSyntax(event.target.value);
                    mySqlSyntaxRef.current = false;
                  }}
                  // onBlur={(event) => {
                  //   myTextFieldPositionRef.current = event.target?.selectionStart;
                  // }}
                />
              </Grid>
              <Grid
                container
                style={{
                  paddingTop: "20px",
                  paddingRight: "20px",
                  paddingLeft: "20px",
                  paddingBottom: "10px",
                  placeContent: "center",
                }}
              >
                <Grid item xs={12} sm={12} md={3}>
                  <GradientButton
                    disabled={
                      isLocalLoading ||
                      verifySql.isLoading ||
                      formMode === "view"
                        ? true
                        : false
                    }
                    endIcon={
                      verifySql.isLoading ? (
                        <CircularProgress size={20} />
                      ) : null
                    }
                    onClick={() => {
                      if (Boolean(sqlSyntax)) {
                        verifySql.mutate({ sqlSyntax, detailsData: data });
                      } else {
                        enqueueSnackbar("Please Enter SQL Syntax.", {
                          variant: "warning",
                        });
                      }
                    }}
                  >
                    Verify
                  </GradientButton>
                </Grid>
                <Grid item xs={12} sm={12} md={3}>
                  <GradientButton
                    onClick={() => {
                      if (!Boolean(sqlSyntax)) {
                        enqueueSnackbar("Please Enter SQL Syntax.", {
                          variant: "warning",
                        });
                      } else if (!mySqlSyntaxRef.current) {
                        enqueueSnackbar("Please Verify SQL Syntax.", {
                          variant: "warning",
                        });
                      } else {
                        // createRetrievalMetaData(sqlSyntax);
                        setIsOpenRerieval(true);
                      }
                    }}
                    disabled={
                      isLocalLoading ||
                      verifySql.isLoading ||
                      formMode === "view"
                        ? true
                        : false
                    }
                  >
                    Parameters
                  </GradientButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </>
      )}
      {isOpenRerieval ? (
        <RetrievalParametersGrid
          isOpen={isOpenRerieval}
          formMode={undefined}
          onClose={onCloseDialog}
          rowsData={myparameterDataRef.current}
          onSaveData={onSaveParameters}
        />
      ) : null}
      ;
    </>
  );
};

export const ViewEditDynamicReportConfigWrapper = ({
  isDataChangedRef,
  closeDialog,
  defaultView,
}) => {
  const { state: data }: any = useLocation();
  return (
    <Fragment>
      <Dialog
        open={true}
        PaperProps={{
          style: {
            width: "100%",
          },
        }}
        maxWidth="lg"
      >
        <ViewEditDynamicReportConfig
          transactionID={data?.[0]?.data?.TRAN_CD}
          isDataChangedRef={isDataChangedRef}
          closeDialog={closeDialog}
          data={data}
          defaultView={defaultView}
        />
      </Dialog>
    </Fragment>
  );
};
