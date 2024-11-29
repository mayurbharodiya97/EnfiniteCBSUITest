import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "pages_audit/auth";
import {
  AppBar,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  Grid,
  InputAdornment,
  List,
  ListItem,
  Toolbar,
  Theme,
  Typography,
} from "@mui/material";
import { GradientButton, LoaderPaperComponent } from "@acuteinfo/common-base";
import { useSnackbar } from "notistack";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import { useStyles } from "pages_audit/auth/style";
import SearchIcon from "@mui/icons-material/Search";
import { TextField } from "@acuteinfo/common-base";
import {
  InwardCleaingGridMetaData,
  InwardClearingRetrievalMetadata,
} from "./gridMetadata";
import { ChequeSignForm } from "./inwardClearingForm/chequeSignForm";
import { format } from "date-fns";
import { ChequeReturnPostFormWrapper } from "./inwardClearingForm/chequeReturnPostForm";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { ShareDividendFormWrapper } from "./inwardClearingForm/shareDividendForm";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

import {
  usePopupContext,
  GridWrapper,
  GridMetaDataType,
  ActionTypes,
  queryClient,
  MetaDataType,
  FormWrapper,
} from "@acuteinfo/common-base";

const useTypeStyles = makeStyles((theme: Theme) => ({
  root: {
    background: "var(--theme-color5)",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--theme-color2)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
  refreshiconhover: {},
}));
const actions: ActionTypes[] = [
  {
    actionName: "retrieve",
    actionLabel: t("Retrieve"),
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "view-detail",
    actionLabel: t("ViewDetail"),
    multiple: false,
    rowDoubleClick: true,
  },
];
export const InwardClearing = () => {
  const { enqueueSnackbar } = useSnackbar();
  const headerClasses = useTypeStyles();
  const actionClasses = useStyles();
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const selectedRowsRef = useRef<any>(null);
  const myRef = useRef<any>();
  const inputButtonRef = useRef<any>(null);
  const isDataChangedRef = useRef(false);
  const mysubdtlRef = useRef<any>({});
  const indexRef = useRef(0);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [state, setState] = useState<any>({
    selectedRows: authState?.user?.branchCode
      ? [authState.user.branchCode]
      : [],
    selectedRowsData: authState?.user?.branchCode
      ? [authState.user.branchCode]
      : [],
    isOpenRetrieve: true,
    selectAll: false,
    searchQuery: "",
    filteredData: [],
    isChequeSign: false,
    formData: {},
    isOpenDividend: false,
  });
  const {
    selectedRows,
    selectedRowsData,
    isOpenRetrieve,
    selectAll,
    searchQuery,
    filteredData,
    isChequeSign,
    formData,
    isOpenDividend,
  } = state;

  const setCurrentAction = useCallback((data) => {
    if (data?.name === "retrieve") {
      setState((prevState) => ({
        ...prevState,
        isOpenRetrieve: true,
      }));
    } else if (data?.name === "view-detail") {
      indexRef.current = Number(data?.rows?.[0].id);
      navigate("view-detail", {
        state: {
          gridData: data?.rows?.[0]?.data,
          index: indexRef.current,
        },
      });
    } else if (data.name === "_rowChanged") {
      if (data?.rows?.[0]?.data?.P2F_FLAG_MSG?.length > 0) {
        MessageBox({
          messageTitle: "Information",
          message: data?.rows?.[0]?.data?.P2F_FLAG_MSG,
          buttonNames: ["Ok"],
        });
      }
    }
  }, []);

  const { data, isLoading, isFetching, refetch, error, isError, status } =
    useQuery<any, any>(
      ["BranchSelectionGridData", isOpenRetrieve],
      () => API.BranchSelectionGridData(),
      {
        enabled: isOpenRetrieve, // The query only runs when isOpenRetrieve is true
      }
    );
  useEffect(() => {
    if (isOpenRetrieve) {
      setState((prevState) => ({
        ...prevState,
        selectedRows: authState?.user?.branchCode
          ? [authState.user.branchCode]
          : [],
        selectedRowsData: authState?.user?.branchCode
          ? [authState.user.branchCode]
          : [],
      }));
    }
  }, [isOpenRetrieve]);
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["BranchSelectionGridData", isOpenRetrieve]);
    };
  }, []);
  const getInwardClearingData: any = useMutation(API.getInwardClearingData, {
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
    },

    onSuccess: (data) => {},
  });
  const postConfigDML: any = useMutation(API.postConfigDML, {
    onSuccess: (data, variables) => {
      // enqueueSnackbar(data, { variant: "success" });
      MessageBox({
        messageTitle: "Success",
        message: data,
      });
      isDataChangedRef.current = true;
      handleDialogClose();
      CloseMessageBox();
    },
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
      CloseMessageBox();
    },
  });
  const confirmPostedConfigDML: any = useMutation(API.confirmPostedConfigDML, {
    onSuccess: (data, variables) => {
      enqueueSnackbar(data, { variant: "success" });
      isDataChangedRef.current = true;
      handleDialogClose();
      CloseMessageBox();
    },
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
      CloseMessageBox();
    },
  });
  const commonReqData = {
    COMP_CD: mysubdtlRef.current?.COMP_CD,
    BRANCH_CD: mysubdtlRef.current?.BRANCH_CD,
    TRAN_CD: mysubdtlRef.current?.TRAN_CD,
    ACCT_TYPE: mysubdtlRef.current?.ACCT_TYPE,
    ACCT_CD: mysubdtlRef.current?.ACCT_CD,
    CHEQUE_NO: mysubdtlRef.current?.CHEQUE_NO,
    MICR_TRAN_CD: mysubdtlRef.current?.MICR_TRAN_CD,
  };
  const validatePostData: any = useMutation(API.validatePost, {
    onSuccess: async (data, variables) => {
      for (let i = 0; i < data?.length; i++) {
        if (data[i]?.O_STATUS === "0") {
          const buttonName = await MessageBox({
            messageTitle: t("ValidationSuccessful"),
            message: t("AreYouSurePostThisCheque"),
            buttonNames: ["Yes", "No"],
            loadingBtnName: ["Yes"],
          });
          if (buttonName === "Yes") {
            postConfigDML.mutate({
              ...commonReqData,
              CHEQUE_DT: mysubdtlRef.current?.CHEQUE_DT
                ? format(
                    new Date(mysubdtlRef.current["CHEQUE_DT"]),
                    "dd/MMM/yyyy"
                  )
                : "",
              DRAFT_DIV: mysubdtlRef.current?.DRAFT_DIV,
              _UPDATEDCOLUMNS: [],
              _OLDROWVALUE: {},
              _isNewRow: true,
            });
          }
        } else if (data[i]?.O_STATUS === "9") {
          MessageBox({
            messageTitle: data[i]?.O_MSG_TITLE,
            message: data[i]?.O_MESSAGE,
            icon: "WARNING",
          });
        } else if (data[i]?.O_STATUS === "99") {
          const buttonName = await MessageBox({
            messageTitle: data[i]?.O_MSG_TITLE,
            message: data[i]?.O_MESSAGE,
            buttonNames: ["Yes", "No"],
            loadingBtnName: ["Yes"],
          });
          if (buttonName === "Yes") {
            postConfigDML.mutate({
              ...commonReqData,
              CHEQUE_DT: mysubdtlRef.current?.CHEQUE_DT
                ? format(
                    new Date(mysubdtlRef.current["CHEQUE_DT"]),
                    "dd/MMM/yyyy"
                  )
                : "",
              DRAFT_DIV: mysubdtlRef.current?.DRAFT_DIV,
              _UPDATEDCOLUMNS: [],
              _OLDROWVALUE: {},
              _isNewRow: true,
            });
          }
        } else if (data[i]?.O_STATUS === "999") {
          MessageBox({
            messageTitle: data[i]?.O_MSG_TITLE,
            message: data[i]?.O_MESSAGE,
            icon: "ERROR",
          });
        }
      }
    },
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
    },
  });
  const validateConfirmData: any = useMutation(API.validateConfirm, {
    onSuccess: async (data, variables) => {
      for (let i = 0; i < data?.length; i++) {
        if (data[i]?.O_STATUS === "0") {
          const buttonName = await MessageBox({
            messageTitle: t("ValidationSuccessful"),
            message:
              t("DoYouWantAllowTransactionVoucherNo") +
              variables?.DAILY_TRN_CD +
              "?",
            buttonNames: ["Yes", "No"],
            loadingBtnName: ["Yes"],
          });
          if (buttonName === "Yes") {
            confirmPostedConfigDML.mutate({
              ...commonReqData,
              CHEQUE_DT: mysubdtlRef.current?.CHEQUE_DT
                ? format(
                    new Date(mysubdtlRef.current["CHEQUE_DT"]),
                    "dd/MMM/yyyy"
                  )
                : "",
              SCREEN_REF: "TRN/650",
              AMOUNT: mysubdtlRef.current?.AMOUNT,
              ENTERED_BY: mysubdtlRef.current?.ENTERED_BY,
            });
          }
        } else if (data[i]?.O_STATUS === "9") {
          MessageBox({
            messageTitle: t("Alert"),
            message: data[i]?.O_MESSAGE,
            icon: "WARNING",
          });
        } else if (data[i]?.O_STATUS === "99") {
          const buttonName = await MessageBox({
            messageTitle: t("Confirmation"),
            message: data[i]?.O_MESSAGE,
            buttonNames: ["Yes", "No"],
            loadingBtnName: ["Yes"],
          });
          if (buttonName === "Yes") {
            confirmPostedConfigDML.mutate({
              ...commonReqData,
              CHEQUE_DT: mysubdtlRef.current?.CHEQUE_DT
                ? format(
                    new Date(mysubdtlRef.current["CHEQUE_DT"]),
                    "dd/MMM/yyyy"
                  )
                : "",
              ENTERED_BY: mysubdtlRef.current?.ENTERED_BY,
              SCREEN_REF: "TRN/650",
            });
          }
        } else if (data[i]?.O_STATUS === "999") {
          MessageBox({
            messageTitle: t("ValidationFailed"),
            message: data[i]?.O_MESSAGE,
            icon: "ERROR",
          });
        }
      }
    },
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
    },
  });
  const handlePrev = useCallback(() => {
    navigate(".");
    if (indexRef.current > 1) {
      indexRef.current -= 1;
      const index = indexRef.current;
      setTimeout(() => {
        setCurrentAction({
          name: "view-detail",
          rows: [
            { data: getInwardClearingData?.data[index - 1], id: String(index) },
          ],
        });
      }, 0);
    }
  }, [getInwardClearingData?.data, indexRef.current]);
  const handleNext = useCallback(() => {
    navigate(".");
    const index = indexRef.current++;
    setTimeout(() => {
      setCurrentAction({
        name: "view-detail",

        rows: [
          { data: getInwardClearingData?.data[index], id: String(index + 1) },
        ],
      });
    }, 0);
  }, [getInwardClearingData?.data, indexRef.current]);

  const handleDialogClose = () => {
    if (isDataChangedRef.current === true) {
      isDataChangedRef.current = true;
      getInwardClearingData.mutate({
        data: {
          ...formData,
          BRANCH_CD: selectedRowsRef?.current?.toString(),
          COMP_CD: authState?.companyID ?? "",
        },
      });
      isDataChangedRef.current = false;
    }
    navigate(".");
    setState((prevState) => ({
      ...prevState,
      isOpenRetrieve: false,
    }));

    CloseMessageBox();
    setState((prevState) => ({
      ...prevState,
      isOpenDividend: false,
    }));
  };

  useEffect(() => {
    if (!isLoading && !isFetching) {
      setState((prevState) => ({
        ...prevState,
        filteredData: data,
      }));
    }
  }, [isLoading, isFetching]);

  if (getInwardClearingData) {
    const { isLoading, data } = getInwardClearingData;
    InwardCleaingGridMetaData.gridConfig.footerNote =
      !isLoading && data?.length > 0
        ? `Batch ID: ${data[0].BATCH_ID}    , Double click on records for detailed view , In Green Colour Indicates Posted and Confirmation Pending , In Pink Colour Indicates Draft/Banker Cheque , Blue Colour Indicates Share Dividend Warrant`
        : "";
  }

  const handleRowClick = (event: any, name: string, label: string) => {
    setState((prevState) => ({
      ...prevState,
      selectAll: false,
      selectedRows: event.ctrlKey
        ? prevState.selectedRows.includes(name) ||
          prevState.selectedRowsData.includes(label)
          ? prevState.selectedRows?.filter((row) => row !== name)
          : [...prevState.selectedRows, name]
        : [name],
      selectedRowsData: event.ctrlKey
        ? prevState.selectedRows.includes(name) ||
          prevState.selectedRowsData.includes(label)
          ? prevState.selectedRowsData?.filter((row) => row !== label)
          : [...prevState.selectedRowsData, label]
        : [label],
    }));
  };

  const handleSearchInputChange = (event) => {
    const value = event.target.value;
    setState((prevState) => ({
      ...prevState,
      searchQuery: value,
      filteredData: data?.filter((item) =>
        item.label.toLowerCase().includes(value?.toLowerCase())
      ),
    }));
  };

  return (
    <>
      <div
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            inputButtonRef?.current?.click?.();
            setState((prevState) => ({
              ...prevState,
              isOpenRetrieve: false,
            }));
          }
        }}
      >
        {" "}
        <Dialog
          open={isOpenRetrieve}
          //@ts-ignore
          PaperProps={{
            style: {
              width: "55%",
            },
          }}
          maxWidth="md"
        >
          <>
            {" "}
            <AppBar position="relative" color="secondary">
              <Toolbar className={headerClasses.root} variant={"dense"}>
                <Typography
                  className={headerClasses.title}
                  color="inherit"
                  variant={"h6"}
                  component="div"
                >
                  Parameters
                </Typography>
              </Toolbar>
            </AppBar>
            <FormWrapper
              key={"inwardClearingRetrieval"}
              metaData={InwardClearingRetrievalMetadata as MetaDataType}
              initialValues={{}}
              onSubmitHandler={async (
                data: any,
                displayData,
                endSubmit,
                setFieldError,
                actionFlag
              ) => {
                endSubmit(true);
                getInwardClearingData.mutate({
                  data: {
                    ...data,
                    BRANCH_CD: selectedRowsRef?.current?.toString(),
                    COMP_CD: authState?.companyID ?? "",
                  },
                  endSubmit,
                });
                setState((prevState) => ({
                  ...prevState,
                  formData: data, // Update formData in the state
                  // isOpenRetrieve: false, // Close the retrieve dialog
                }));
              }}
              //@ts-ignore
              formStyle={{
                background: "white",
                padding: "0px",
              }}
              containerstyle={{ paddingTop: "0px !important" }}
              ref={myRef}
              hideHeader={true}
            />
            <TextField
              placeholder={t("Search")}
              id=""
              name={t("Search")}
              size="small"
              value={searchQuery}
              onChange={handleSearchInputChange}
              style={{ width: "96%", margin: "0px 11px auto" }}
              InputProps={{
                style: { margin: "0px" },
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              //@ts-ignore
            />
            <>
              {/* {isLoading || isFetching ? (
                <LoaderPaperComponent />
              ) : isError ? (
                <>
                  <div style={{ width: "100%", paddingTop: "10px" }}>
                    <Alert
                      severity={error?.severity ?? "error"}
                      errorMsg={error?.error_msg ?? "Error"}
                      errorDetail={error?.error_detail ?? ""}
                    />
                  </div>
                </>
              ) : ( */}
              {isLoading || isFetching ? (
                <LoaderPaperComponent />
              ) : (
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{ padding: "3px 19px 0px 10px" }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      // maxWidth: 400,
                      bgcolor: "background.paper",
                      height: "50vh",
                      overflow: "scroll",
                      border: "ridge",
                      borderRadius: "3",
                    }}
                  >
                    <nav
                      aria-label="main mailbox folders"
                      style={{ position: "relative" }}
                    >
                      <Box
                        sx={{
                          position: "sticky",
                          top: 0,
                          textAlign: "left",
                          padding: ".45rem",
                          fontWeight: 500,
                          fontFamily: "Roboto, Helvetica",
                          background: "var(--theme-color1)",
                          color: "#fff",
                          alignItems: "center",
                          display: "grid",
                          gridTemplateColumns: "0.62fr 0.7fr 2fr 1fr",
                          gap: "0 18px",
                          zIndex: 9,
                        }}
                      >
                        <>
                          <div>{t("Bank")}</div>
                          <div>{t("Branch")}</div>
                          <div>{t("BranchName")}</div>
                          <div style={{ marginLeft: "24px" }}>
                            {t("status")}
                          </div>
                        </>
                      </Box>
                      <List style={{ paddingTop: "0px", paddingBottom: "0px" }}>
                        {[...(filteredData ?? [])]
                          // ?.sort((a, b) => {
                          //   // If 'a' is selected and 'b' is not, move 'a' up
                          //   if (
                          //     selectedRows.includes(a?.value) &&
                          //     !selectedRows.includes(b?.value)
                          //   ) {
                          //     return -1;
                          //   }
                          //   // If 'b' is selected and 'a' is not, move 'b' up
                          //   if (
                          //     selectedRows.includes(b?.value) &&
                          //     !selectedRows.includes(a?.value)
                          //   ) {
                          //     return 1;
                          //   }
                          //   // Otherwise, maintain the current order
                          //   return 0;
                          // })
                          ?.map((item, index) => (
                            <ListItemData
                              key={index}
                              name={item?.label}
                              disabled={false}
                              selected={
                                selectAll ||
                                selectedRows.includes(item?.value) ||
                                selectedRowsData.includes(item.label)
                              }
                              onClick={(event) =>
                                handleRowClick(event, item?.value, item?.label)
                              }
                              onDoubleClick={(event) => {
                                if (
                                  selectedRows?.length === 0 ||
                                  selectedRowsData?.length === 0
                                ) {
                                  enqueueSnackbar(
                                    t("PleaseSelectAtLeastOneRow"),
                                    {
                                      variant: "error",
                                    }
                                  );
                                } else {
                                  setState((prevState) => ({
                                    ...prevState,
                                    isOpenRetrieve: false,
                                  }));
                                  myRef?.current?.handleSubmit(event, "save");
                                  selectedRowsRef.current = selectedRows;
                                }
                              }}
                            />
                          ))}
                      </List>
                    </nav>
                  </Box>
                </Grid>
              )}
            </>
            <DialogActions
              className={actionClasses.verifybutton}
              style={{ marginTop: "2px", marginBottom: "2px" }}
            >
              <>
                <GradientButton
                  onClick={() => {
                    setState((prevState) => ({
                      ...prevState,
                      selectAll: !prevState.selectAll,
                      selectedRows: !prevState.selectAll
                        ? filteredData?.map((item) => item?.value)
                        : [],
                      selectedRowsData: !prevState.selectAll
                        ? filteredData?.map((item) => item?.label)
                        : [],
                    }));
                  }}
                >
                  {(getInwardClearingData?.status === "success" && selectAll) ||
                  selectAll
                    ? t("DeselectAll")
                    : t("SelectAll")}
                </GradientButton>
                <GradientButton
                  endIcon={
                    getInwardClearingData.isLoading ? (
                      <CircularProgress size={20} />
                    ) : null
                  }
                  onClick={(event) => {
                    if (
                      selectedRows?.length === 0 ||
                      selectedRowsData?.length === 0
                    ) {
                      enqueueSnackbar(t("PleaseSelectAtLeastOneRow"), {
                        variant: "error",
                      });
                    } else {
                      setState((prevState) => ({
                        ...prevState,
                        isOpenRetrieve: false,
                        searchQuery: "",
                      }));
                      myRef?.current?.handleSubmit(event, "save");
                      selectedRowsRef.current = selectedRows;
                    }
                  }}
                  ref={inputButtonRef}
                  disabled={
                    selectedRows?.length === 0 || selectedRowsData?.length === 0
                  }
                >
                  {`${t("Ok")}${
                    data?.length > 0 ? ` (${selectedRows.length})` : ""
                  }`}
                </GradientButton>

                <GradientButton
                  onClick={() => {
                    setState((prevState) => ({
                      ...prevState,
                      isOpenRetrieve: false,
                      searchQuery: "",
                    }));
                  }}
                >
                  {t("Close")}
                </GradientButton>
              </>
            </DialogActions>
          </>
        </Dialog>
      </div>

      <>
        {/* {getInwardClearingData?.data &&
        getInwardClearingData?.data?.length > 0 ? ( */}
        <GridWrapper
          key={"inwardCleringGrid" + getInwardClearingData.isLoading}
          finalMetaData={InwardCleaingGridMetaData as GridMetaDataType}
          data={getInwardClearingData?.data ?? []}
          setData={() => null}
          loading={getInwardClearingData.isLoading}
          actions={actions}
          setAction={setCurrentAction}
          enableExport={true}
          refetchData={() =>
            Object.entries(formData).length &&
            selectedRowsRef?.current?.toString() &&
            authState?.companyID
              ? getInwardClearingData.mutate({
                  data: {
                    ...formData,
                    BRANCH_CD: selectedRowsRef?.current?.toString(),
                    COMP_CD: authState?.companyID,
                  },
                })
              : null
          }
          disableMultipleRowSelect={true}
          onClickActionEvent={async (index, id, data) => {
            if (id === "WITH_SIGN") {
              mysubdtlRef.current = data;
              setState((prevState) => ({
                ...prevState,
                isChequeSign: true,
              }));
            } else if (id === "POST_CONF") {
              mysubdtlRef.current = data;

              if (data && data?.POST_CONF === "C") {
                validateConfirmData.mutate({
                  COMP_CD: data?.COMP_CD ?? "",
                  BRANCH_CD: data?.BRANCH_CD ?? "",
                  ACCT_TYPE: data?.ACCT_TYPE ?? "",
                  ACCT_CD: data?.ACCT_CD ?? "",
                  DAILY_TRN_CD: data?.DAILY_TRN_CD ?? "",
                  ZONE_CD: data?.ZONE_CD ?? "",
                  ENTERED_COMP_CD: data?.ENTERED_COMP_CD ?? "",
                  ENTERED_BY: data?.ENTERED_BY ?? "",
                  LAST_ENTERED_BY: data?.LAST_ENTERED_BY ?? "",
                  LAST_MACHINE_NM: data?.LAST_MACHINE_NM ?? "",
                  REMARKS: data?.REMARKS ?? "",
                  CHEQUE_DT: data?.CHEQUE_DT ?? "",
                  CHEQUE_NO: data?.CHEQUE_NO ?? "",
                  AMOUNT: data?.AMOUNT ?? "",
                  TRAN_CD: data?.TRAN_CD ?? "",
                  MICR_TRAN_CD: data?.MICR_TRAN_CD ?? "",
                });
              } else {
                if (data && data?.DRAFT_DIV === "DRAFT") {
                  const buttonName = await MessageBox({
                    messageTitle: t("Confirmation"),
                    message:
                      authState?.role < "2"
                        ? t("DoYouWantRealizeDraft")
                        : t("DoWantRealizeDraftOrDirectPostInGL"),
                    buttonNames:
                      authState?.role < "2"
                        ? ["Yes", "No"]
                        : ["Yes", "No", "Cancel"],
                    loadingBtnName: ["Yes", "No"],
                  });
                  const postData = {
                    COMP_CD: data?.COMP_CD,
                    BRANCH_CD: data?.BRANCH_CD,
                    ACCT_TYPE: data?.ACCT_TYPE,
                    ACCT_CD: data?.ACCT_CD,
                    TRAN_CD: data?.TRAN_CD,
                    CHEQUE_NO: data?.CHEQUE_NO,
                    DRAFT_DIV: data?.DRAFT_DIV,
                    _UPDATEDCOLUMNS: [],
                    _OLDROWVALUE: {},
                    _isNewRow: false,
                    _isUpdateRow: true,
                  };
                  if (authState?.role < "2" && buttonName === "Yes") {
                    postConfigDML.mutate(postData);
                  } else if (buttonName === "Yes") {
                    postConfigDML.mutate(postData);
                  } else if (buttonName === "No") {
                    validatePostData.mutate({
                      COMP_CD: data?.COMP_CD,
                      BRANCH_CD: data?.BRANCH_CD,
                      TRAN_CD: data?.TRAN_CD,
                      ACCT_TYPE: data?.ACCT_TYPE,
                      ACCT_CD: data?.ACCT_CD,
                      CHEQUE_NO: data?.CHEQUE_NO,
                      MICR_TRAN_CD: data?.MICR_TRAN_CD,
                      ERROR_STATUS: data?.ERR_STATUS ?? "",
                      SCREEN_REF: "TRN/650",
                      ENTERED_BY: data?.ENTERED_BY ?? "",
                      ENTERED_BRANCH_CD: data?.ENTERED_BRANCH_CD ?? "",
                      REMARKS: data?.REMARKS ?? "",
                      CHEQUE_DT: data?.CHEQUE_DT ?? "",
                      AMOUNT: data?.AMOUNT ?? "",
                    });
                  }
                } else if (data && data?.DRAFT_DIV === "DIVIDEND") {
                  setState((prevState) => ({
                    ...prevState,
                    isOpenDividend: true,
                  }));
                } else {
                  validatePostData.mutate({
                    COMP_CD: data?.COMP_CD ?? "",
                    BRANCH_CD: data?.BRANCH_CD ?? "",
                    ACCT_TYPE: data?.ACCT_TYPE ?? "",
                    ACCT_CD: data?.ACCT_CD ?? "",
                    ERROR_STATUS: data?.ERR_STATUS ?? "",
                    SCREEN_REF: "TRN/650",
                    ENTERED_BY: data?.ENTERED_BY ?? "",
                    ENTERED_BRANCH_CD: data?.ENTERED_BRANCH_CD ?? "",
                    REMARKS: data?.REMARKS ?? "",
                    CHEQUE_DT: data?.CHEQUE_DT ?? "",
                    CHEQUE_NO: data?.CHEQUE_NO ?? "",
                    AMOUNT: data?.AMOUNT ?? "",
                    TRAN_CD: data?.TRAN_CD ?? "",
                    MICR_TRAN_CD: data?.MICR_TRAN_CD ?? "",
                  });
                }
              }
            } else if (id === "VIEW_DETAIL") {
              indexRef.current = Number(index);
              navigate("view-detail", {
                state: { gridData: data, index: indexRef.current },
              });
            }
          }}
        />
        {/* ) : null} */}
      </>
      <>
        {isChequeSign ? (
          <ChequeSignForm
            onClose={() => {
              setState((prevState) => ({
                ...prevState,
                isChequeSign: false,
              }));
            }}
            reqDataRef={mysubdtlRef}
          />
        ) : null}
      </>
      <>
        {isOpenDividend ? (
          <ShareDividendFormWrapper
            onClose={handleDialogClose}
            dividendData={mysubdtlRef.current}
          />
        ) : null}
      </>
      <Routes>
        <Route
          path="view-detail/*"
          element={
            <ChequeReturnPostFormWrapper
              isDataChangedRef={isDataChangedRef}
              onClose={handleDialogClose}
              // inwardData={data?.length ?? 0}
              handlePrev={handlePrev}
              handleNext={handleNext}
              currentIndexRef={indexRef}
              totalData={getInwardClearingData?.data?.length ?? 0}
            />
          }
        />
      </Routes>
    </>
  );
};
export const ListItemData = ({
  name,
  disabled,
  selected,
  onClick,
  onDoubleClick,
}) => {
  //@ts-ignore
  const splitNames = name?.split("|");
  return (
    <div>
      <ListItem
        button
        style={{
          color: selected ? "white" : "black",
          fontSize: "14px",
          backgroundColor: selected ? "var(--theme-color3)" : "transparent",
          border: "0.5px solid #F3F6F9",
          paddingTop: "3px",
          paddingBottom: "3px",
        }}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
      >
        {splitNames?.map((names, index) => (
          <span
            key={index}
            style={{
              textAlign: "left",
              flex: index === 2 ? 1.5 : 0.5,
              // padding: ".35rem 0",
              fontWeight: 400,
              fontFamily: "Roboto, Helvetica",
            }}
          >
            {names}
          </span>
        ))}
      </ListItem>
    </div>
  );
};
