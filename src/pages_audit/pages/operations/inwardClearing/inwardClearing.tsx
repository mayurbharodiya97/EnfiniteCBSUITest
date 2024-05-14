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
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { GradientButton } from "components/styledComponent/button";
import { useSnackbar } from "notistack";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useStyles } from "pages_audit/auth/style";
import SearchIcon from "@mui/icons-material/Search";
import { TextField } from "components/styledComponent";
import { Alert } from "components/common/alert";
import { queryClient } from "cache";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import {
  InwardCleaingGridMetaData,
  InwardClearingRetrievalMetadata,
} from "./gridMetadata";
import { GridMetaDataType } from "components/dataTableStatic";
import { ActionTypes } from "components/dataTable";
import { ChequeSignForm } from "./inwardClearingForm/chequeSignForm";
import { format } from "date-fns";
import { ChequeReturnPostFormWrapper } from "./inwardClearingForm/chequeReturnPostForm";
import { usePopupContext } from "components/custom/popupContext";
import { Route, Routes, useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { ShareDividendFormWrapper } from "./inwardClearingForm/shareDividendForm";

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
    actionLabel: "Retrieve",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "view-detail",
    actionLabel: "Edit Detail",
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

  const [state, setState] = useState<any>({
    selectedRows: authState?.user?.branchCode ?? [],
    selectedRowsData: authState?.user?.branchCode ?? [],
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
    }
  }, []);
  const { data, isLoading, isFetching, refetch, error, isError, status } =
    useQuery<any, any>(["BranchSelectionGridData"], () =>
      API.BranchSelectionGridData()
    );
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

  const validatePostData: any = useMutation(API.validatePost, {
    onSuccess: async (data, variables) => {
      if (data?.[0]?.O_STATUS === "0") {
        const buttonName = await MessageBox({
          messageTitle: "Validation Successful",
          message: "Are you sure to post this Cheque?",
          buttonNames: ["No", "Yes"],
          loadingBtnName: ["Yes"],
        });
        if (buttonName === "Yes") {
          postConfigDML.mutate({
            COMP_CD: mysubdtlRef.current?.COMP_CD,
            BRANCH_CD: mysubdtlRef.current?.BRANCH_CD,
            TRAN_CD: mysubdtlRef.current?.TRAN_CD,
            ACCT_TYPE: mysubdtlRef.current?.ACCT_TYPE,
            ACCT_CD: mysubdtlRef.current?.ACCT_CD,
            CHEQUE_NO: mysubdtlRef.current?.CHEQUE_NO,
            DRAFT_DIV: mysubdtlRef.current?.DRAFT_DIV,
            MICR_TRAN_CD: mysubdtlRef.current?.MICR_TRAN_CD,
            CHEQUE_DT: mysubdtlRef.current?.CHEQUE_DT
              ? format(
                  new Date(mysubdtlRef.current["CHEQUE_DT"]),
                  "dd/MMM/yyyy"
                )
              : "",
            _UPDATEDCOLUMNS: [],
            _OLDROWVALUE: {},
            _isNewRow: true,
          });
        }
      } else if (data?.[0]?.O_STATUS === "9") {
        MessageBox({
          messageTitle: "Validation Alert",
          message: data?.[0]?.O_MESSAGE,
        });
      } else if (data?.[0]?.O_STATUS === "99") {
        const buttonName = await MessageBox({
          messageTitle: "Are you sure do you want to continue?",
          message: data?.[0]?.O_MESSAGE,
          buttonNames: ["No", "Yes"],
          loadingBtnName: ["Yes"],
        });
        if (buttonName === "Yes") {
          postConfigDML.mutate({
            COMP_CD: mysubdtlRef.current?.COMP_CD,
            BRANCH_CD: mysubdtlRef.current?.BRANCH_CD,
            TRAN_CD: mysubdtlRef.current?.TRAN_CD,
            ACCT_TYPE: mysubdtlRef.current?.ACCT_TYPE,
            ACCT_CD: mysubdtlRef.current?.ACCT_CD,
            CHEQUE_NO: mysubdtlRef.current?.CHEQUE_NO,
            DRAFT_DIV: mysubdtlRef.current?.DRAFT_DIV,
            MICR_TRAN_CD: mysubdtlRef.current?.MICR_TRAN_CD,
            CHEQUE_DT: mysubdtlRef.current?.CHEQUE_DT
              ? format(
                  new Date(mysubdtlRef.current["CHEQUE_DT"]),
                  "dd/MMM/yyyy"
                )
              : "",
            _UPDATEDCOLUMNS: [],
            _OLDROWVALUE: {},
            _isNewRow: true,
          });
        }
      } else if (data?.[0]?.O_STATUS === "999") {
        MessageBox({
          messageTitle: "Validation Failed",
          message: data?.[0]?.O_MESSAGE,
        });
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
      if (data?.[0]?.O_STATUS === "0") {
        const buttonName = await MessageBox({
          messageTitle: "Validation Successful",
          message:
            "Do you want to allow this transaction - Voucher No." +
            variables?.DAILY_TRN_CD +
            "?",
          buttonNames: ["No", "Yes"],
          loadingBtnName: ["Yes"],
        });
        if (buttonName === "Yes") {
          confirmPostedConfigDML.mutate({
            COMP_CD: mysubdtlRef.current?.COMP_CD,
            BRANCH_CD: mysubdtlRef.current?.BRANCH_CD,
            ENTERED_BY: mysubdtlRef.current?.ENTERED_BY,
            TRAN_CD: mysubdtlRef.current?.TRAN_CD,
            ACCT_TYPE: mysubdtlRef.current?.ACCT_TYPE,
            ACCT_CD: mysubdtlRef.current?.ACCT_CD,
            CHEQUE_NO: mysubdtlRef.current?.CHEQUE_NO,
            AMOUNT: mysubdtlRef.current?.AMOUNT,
            MICR_TRAN_CD: mysubdtlRef.current?.MICR_TRAN_CD,
            CHEQUE_DT: mysubdtlRef.current?.CHEQUE_DT
              ? format(
                  new Date(mysubdtlRef.current["CHEQUE_DT"]),
                  "dd/MMM/yyyy"
                )
              : "",
            SCREEN_REF: "TRN/650",
          });
        }
      } else if (data?.[0]?.O_STATUS === "9") {
        MessageBox({
          messageTitle: "Validation Alert",
          message: data?.[0]?.O_MESSAGE,
        });
      } else if (data?.[0]?.O_STATUS === "99") {
        const buttonName = await MessageBox({
          messageTitle: "Are you sure do you want to continue?",
          message: data?.[0]?.O_MESSAGE,
          buttonNames: ["No", "Yes"],
          loadingBtnName: ["Yes"],
        });
        if (buttonName === "Yes") {
          confirmPostedConfigDML.mutate({
            COMP_CD: mysubdtlRef.current?.COMP_CD,
            BRANCH_CD: mysubdtlRef.current?.BRANCH_CD,
            ENTERED_BY: mysubdtlRef.current?.ENTERED_BY,
            TRAN_CD: mysubdtlRef.current?.TRAN_CD,
            ACCT_TYPE: mysubdtlRef.current?.ACCT_TYPE,
            ACCT_CD: mysubdtlRef.current?.ACCT_CD,
            CHEQUE_NO: mysubdtlRef.current?.CHEQUE_NO,
            AMOUNT: mysubdtlRef.current?.AMOUNT,
            MICR_TRAN_CD: mysubdtlRef.current?.MICR_TRAN_CD,
            CHEQUE_DT: mysubdtlRef.current?.CHEQUE_DT
              ? format(
                  new Date(mysubdtlRef.current["CHEQUE_DT"]),
                  "dd/MMM/yyyy"
                )
              : "",
            SCREEN_REF: "TRN/650",
          });
        }
      } else if (data?.[0]?.O_STATUS === "999") {
        MessageBox({
          messageTitle: "Validation Failed",
          message: data?.[0]?.O_MESSAGE,
        });
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
    setState((prevState) => ({
      ...prevState,
      isOpenRetrieve: false,
    }));
    const index = (indexRef.current -= 1);
    setTimeout(() => {
      setCurrentAction({
        name: "view-detail",
        rows: [
          {
            data: getInwardClearingData?.data[index],
            id: String(index - 1),
          },
        ],
      });
    }, 0);
  }, [getInwardClearingData?.data]);
  const handleNext = useCallback(() => {
    navigate(".");
    setState((prevState) => ({
      ...prevState,
      isOpenRetrieve: false,
    }));
    const index = indexRef.current++;
    setTimeout(() => {
      setCurrentAction({
        name: "view-detail",
        rows: [
          {
            data: getInwardClearingData?.data[index + 1],
            id: String(index + 1),
          },
        ],
      });
    }, 0);
  }, [getInwardClearingData?.data]);
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
  }, [isLoading, isFetching, data]);

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["BranchSelectionGridData"]);
    };
  }, []);

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
                  isOpenRetrieve: false, // Close the retrieve dialog
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
              placeholder="Search"
              id=""
              name={"Search"}
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
              {isLoading || isFetching ? (
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
                          <div>Bank</div>
                          <div>Branch</div>
                          <div>Branch Name</div>
                          <div style={{ marginLeft: "24px" }}>Status</div>
                        </>
                      </Box>
                      <List style={{ paddingTop: "0px", paddingBottom: "0px" }}>
                        {[...filteredData]
                          .sort((a, b) => {
                            // If 'a' is selected and 'b' is not, move 'a' up
                            if (
                              selectedRows.includes(a?.value) &&
                              !selectedRows.includes(b?.value)
                            ) {
                              return -1;
                            }
                            // If 'b' is selected and 'a' is not, move 'b' up
                            if (
                              selectedRows.includes(b?.value) &&
                              !selectedRows.includes(a?.value)
                            ) {
                              return 1;
                            }
                            // Otherwise, maintain the current order
                            return 0;
                          })
                          ?.map((item) => (
                            <ListItemData
                              key={item?.value}
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
                                    "Please select at least one row.",
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
                  {getInwardClearingData?.status === "success" && selectAll
                    ? "Deselect All"
                    : "Select All"}
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
                      enqueueSnackbar("Please select at least one row.", {
                        variant: "error",
                      });
                    } else {
                      setState((prevState) => ({
                        ...prevState,
                        isOpenRetrieve: false,
                      }));
                      myRef?.current?.handleSubmit(event, "save");
                      selectedRowsRef.current = selectedRows;
                    }
                  }}
                  ref={inputButtonRef}
                >
                  Ok
                </GradientButton>

                <GradientButton
                  onClick={() => {
                    setState((prevState) => ({
                      ...prevState,
                      isOpenRetrieve: false,
                    }));
                  }}
                >
                  Close
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
          key={"inwardCleringGrid"}
          finalMetaData={InwardCleaingGridMetaData as GridMetaDataType}
          data={getInwardClearingData?.data ?? []}
          setData={() => null}
          loading={getInwardClearingData.isLoading || isFetching}
          actions={actions}
          setAction={setCurrentAction}
          ReportExportButton={true}
          refetchData={() =>
            getInwardClearingData.mutate({
              data: {
                ...formData,
                BRANCH_CD: selectedRowsRef?.current?.toString() ?? "",
                COMP_CD: authState?.companyID ?? "",
              },
            })
          }
          onlySingleSelectionAllow={true}
          onClickActionEvent={async (index, id, data) => {
            if (id === "SIGN_PATH") {
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
                    messageTitle: "Confirmation",
                    message:
                      authState?.role < "2"
                        ? "Do you want to realize Draft?"
                        : "Do you want to realize Draft? Or Want to direct post in GL?\nPress Yes to Realize Draft\nPress No to Direct Post in GL",
                    buttonNames:
                      authState?.role < "2"
                        ? ["Yes", "No"]
                        : ["Yes", "No", "Cancel"],
                    loadingBtnName: ["Yes" || "No"],
                  });
                  const postData = {
                    COMP_CD: mysubdtlRef.current?.COMP_CD,
                    BRANCH_CD: mysubdtlRef.current?.BRANCH_CD,
                    ACCT_TYPE: mysubdtlRef.current?.ACCT_TYPE,
                    ACCT_CD: mysubdtlRef.current?.ACCT_CD,
                    TRAN_CD: mysubdtlRef.current?.TRAN_CD,
                    CHEQUE_NO: mysubdtlRef.current?.CHEQUE_NO,
                    DRAFT_DIV: mysubdtlRef.current?.DRAFT_DIV,
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
                      COMP_CD: mysubdtlRef.current?.COMP_CD ?? "",
                      BRANCH_CD: mysubdtlRef.current?.BRANCH_CD ?? "",
                      ACCT_TYPE: mysubdtlRef.current?.ACCT_TYPE ?? "",
                      ACCT_CD: mysubdtlRef.current?.ACCT_CD ?? "",
                      ERROR_STATUS: mysubdtlRef.current?.ERR_STATUS ?? "",
                      SCREEN_REF: "TRN/650",
                      ENTERED_BY: mysubdtlRef.current?.ENTERED_BY ?? "",
                      ENTERED_BRANCH_CD:
                        mysubdtlRef.current?.ENTERED_BRANCH_CD ?? "",
                      REMARKS: mysubdtlRef.current?.REMARKS ?? "",
                      CHEQUE_DT: mysubdtlRef.current?.CHEQUE_DT ?? "",
                      CHEQUE_NO: mysubdtlRef.current?.CHEQUE_NO ?? "",
                      AMOUNT: mysubdtlRef.current?.AMOUNT ?? "",
                      TRAN_CD: mysubdtlRef.current?.TRAN_CD ?? "",
                      MICR_TRAN_CD: mysubdtlRef.current?.MICR_TRAN_CD ?? "",
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
