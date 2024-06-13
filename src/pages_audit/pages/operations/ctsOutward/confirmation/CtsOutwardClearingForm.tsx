import { ClearCacheProvider, queryClient } from "cache";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { GradientButton } from "components/styledComponent/button";
import { extractMetaData } from "components/utils";
import {
  FC,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  CTSOutwardClearingConfirmMetaData,
  DualConfHistoryGridMetaData,
  ctsOutwardChequeDetailConfirmMetaData,
  inwardReturnChequeDetailConfirmMetaData,
} from "./ConfirmationMetadata";
import * as API from "./api";
import { ActionTypes } from "components/dataTable";
import { useMutation, useQuery } from "react-query";
import { AuthContext } from "pages_audit/auth";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { Alert } from "components/common/alert";
import {
  AppBar,
  Dialog,
  DialogActions,
  DialogTitle,
  Theme,
  Toolbar,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import GridWrapper from "components/dataTableStatic";
import KeyboardDoubleArrowRightOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowRightOutlined";
import KeyboardDoubleArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowLeftOutlined";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { useSnackbar } from "notistack";
import { usePopupContext } from "components/custom/popupContext";
import { format } from "date-fns";
import { useLocation } from "react-router-dom";
import { ChequeSignImage } from "../../inwardClearing/inwardClearingForm/chequeSignImage";
import { RemarksAPIWrapper } from "components/custom/Remarks";

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
  appBar: {
    position: "fixed",
    top: 0,
    width: "100%",
  },
  refreshiconhover: {},
}));
const actions: ActionTypes[] = [
  {
    actionName: "close",
    actionLabel: "Close",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
];

const CtsOutwardAndInwardReturnConfirm: FC<{
  zoneTranType: any;
  formMode?: any;
  rowsData?: any;
  onClose?: any;
  isDataChangedRef?: any;
  handlePrev?: any;
  handleNext?: any;
  currentIndex?: number;
  totalData?: number;
}> = ({
  zoneTranType,
  formMode,
  rowsData,
  onClose,
  isDataChangedRef,
  handlePrev,
  handleNext,
  currentIndex,
  totalData,
}) => {
    const { authState } = useContext(AuthContext);
    const headerClasses = useTypeStyles();
    const { enqueueSnackbar } = useSnackbar();
    const { MessageBox, CloseMessageBox } = usePopupContext();
    const [isDeleteRemark, SetDeleteRemark] = useState(false);
    const [isChequeSign, setIsChequeSign] = useState<any>(false);
    const [isVisibleSign, setIsVisibleSign] = useState<any>(false);
    const [isConfHistory, setIsConfHistory] = useState<any>(false);

    const { data, isLoading, isError, error } = useQuery<any, any>(
      ["getOutwardConfirmViewDetailData", rowsData?.TRAN_CD],
      () =>
        API.getOutwardConfirmViewDetailData({
          TRAN_CD: rowsData?.TRAN_CD,
          ENTERED_COMP_CD: rowsData?.ENTERED_COMP_CD ?? "",
          ENTERED_BRANCH_CD: rowsData?.ENTERED_BRANCH_CD ?? "",
          TRAN_TYPE: zoneTranType,
        })
    );
    const setCurrentAction = useCallback((data) => {
      if (data.name === "close") {
        setIsConfHistory(false);
      }
    }, []);
    useEffect(() => {
      return () => {
        queryClient.removeQueries(["getOutwardConfirmViewDetailData"]);
      };
    }, []);
    const mutation: any = useMutation(
      "getInwardChequeSignFormData",
      API.getInwardChequeSignFormData,
      {
        onSuccess: (data) => { },
        onError: (error: any) => { },
      }
    );
    const confHistory: any = useMutation(
      "getConfirmHistoryData",
      API.getConfirmHistoryData,
      {
        onSuccess: (data) => { },
        onError: (error: any) => { },
      }
    );
    const confirmation: any = useMutation(
      "getCtsAndInwardConfirmtion",
      API.getCtsAndInwardConfirmtion,
      {
        onSuccess: (data) => {
          enqueueSnackbar(data, {
            variant: "success",
          });
          isDataChangedRef.current = true;
          onClose();
          CloseMessageBox();
        },
        onError: (error: any) => {
          MessageBox({
            messageTitle: "Validation Failed..",
            message: error?.error_msg,
            buttonNames: ["Ok"],
          });
          CloseMessageBox();
        },
      }
    );
    const deleteMutation = useMutation(API.outwardClearingConfigDML, {
      onError: (error: any) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
        CloseMessageBox();
        SetDeleteRemark(false);
      },
      onSuccess: (data) => {
        // isDataChangedRef.current = true;
        enqueueSnackbar("Records successfully deleted", {
          variant: "success",
        });
        isDataChangedRef.current = true;
        onClose();
        CloseMessageBox();
        SetDeleteRemark(false);
      },
    });

    useEffect(() => {
      const handleKeyDown = async (event) => {
        if (event.ctrlKey && (event.key === "D" || event.key === "d")) {
          event.preventDefault();
          if (rowsData?.CONFIRMED === "Y" && authState?.role < "2") {
            await MessageBox({
              messageTitle: "Validation Failed..",
              message: "Cannot Delete Confirmed Transaction",
              buttonNames: ["Ok"],
            });
          } else if (
            !(
              format(new Date(rowsData?.TRAN_DT), "dd/MMM/yyyy") ===
              format(new Date(authState?.workingDate), "dd/MMM/yyyy")
            )
          ) {
            await MessageBox({
              messageTitle: "Validation Failed..",
              message: "Cannot Delete Back Dated Entry",
              buttonNames: ["Ok"],
            });
          } else {
            SetDeleteRemark(true);
          }
        }
      };
      document.addEventListener("keydown", handleKeyDown);
    }, []);
    if (zoneTranType === "S") {
      CTSOutwardClearingConfirmMetaData.form.label = "CTS O/W Confirmation";
    } else if (zoneTranType === "R") {
      CTSOutwardClearingConfirmMetaData.form.label = "Inward Return Confirmation";
    } else if (zoneTranType === "W") {
      CTSOutwardClearingConfirmMetaData.form.label =
        "Outward Return Confirmation";
    }

    return (
      <Fragment>
        <>
          <Dialog
            open={true}
            PaperProps={{
              style: {
                width: "100%",
              },
            }}
            maxWidth="lg"
          >
            {isLoading ? (
              <LoaderPaperComponent />
            ) : isError ? (
              <>
                <div
                  style={{
                    paddingRight: "10px",
                    paddingLeft: "10px",
                    height: 100,
                    paddingTop: 10,
                  }}
                >
                  <AppBar position="relative" color="primary">
                    <Alert
                      severity="error"
                      errorMsg={error?.error_msg ?? "Unknow Error"}
                      errorDetail={error?.error_detail ?? ""}
                      color="error"
                    />
                  </AppBar>
                </div>
              </>
            ) : (
              <>
                <DialogTitle
                  className={headerClasses.title}
                  sx={{
                    marginLeft: "5px",
                    // marginTop: "5px",
                    p: 0,
                    position: "fixed",
                    zIndex: 1000,
                    background: "var(--theme-color5)",
                    color: "var(--theme-color2)",
                    display: "flex",
                    justifyContent: "space-between", // Align items to start and end
                    alignItems: "center",
                    width: "100%",
                    maxWidth: "87%",
                    "& .MuiTypography-body1": {
                      flex: "1 1 100%",
                      color: "var(--theme-color2)",
                      // letterSpacing: "1px",
                      fontSize: "1.5rem",
                    },
                  }}
                  id="customized-dialog-title"
                >
                  <Typography>
                    {zoneTranType === "S"
                      ? " CTS O/W Confirmation"
                      : zoneTranType === "R"
                        ? "Inward Return Confirmation"
                        : zoneTranType === "W"
                          ? "Outward Return Confirmation"
                          : null}
                  </Typography>

                  <>
                    <DialogActions
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end", // Align items to the end
                      }}
                    >
                      <GradientButton
                        onClick={async () => {
                          const buttonName = await MessageBox({
                            messageTitle: "Confirmation",
                            message: " Proceed ?",
                            buttonNames: ["No", "Yes"],
                            loadingBtnName: "Yes",
                          });
                          if (buttonName === "Yes") {
                            confirmation.mutate({
                              ENTERED_COMP_CD: data?.[0]?.ENTERED_COMP_CD,
                              ENTERED_BRANCH_CD: data?.[0]?.ENTERED_BRANCH_CD,
                              TRAN_CD: data?.[0]?.TRAN_CD,
                              ACCT_TYPE: data?.[0]?.ACCT_TYPE,
                              ACCT_CD: data?.[0]?.ACCT_CD,
                              CONFIRMED: "N",
                              ENTERED_BY: data?.[0]?.ENTERED_BY,
                              AMOUNT: data?.[0]?.AMOUNT,
                              SCREEN_REF:
                                zoneTranType === "S"
                                  ? "ETRN/560"
                                  : zoneTranType === "R"
                                    ? "ETRN/029"
                                    : "ETRN/346",
                            });
                          }
                        }}
                      >
                        Confirm
                      </GradientButton>
                      <GradientButton
                        onClick={async () => {
                          if (
                            rowsData?.CONFIRMED === "Y" &&
                            authState?.role < "2"
                          ) {
                            await MessageBox({
                              messageTitle: "Validation Failed..",
                              message: "Cannot Delete Confirmed Transaction",
                              buttonNames: ["Ok"],
                            });
                          } else if (
                            !(
                              format(
                                new Date(rowsData?.TRAN_DT),
                                "dd/MMM/yyyy"
                              ) ===
                              format(
                                new Date(authState?.workingDate),
                                "dd/MMM/yyyy"
                              )
                            )
                          ) {
                            await MessageBox({
                              messageTitle: "Validation Failed..",
                              message: "Cannot Delete Back Dated Entry",
                              buttonNames: ["Ok"],
                            });
                          } else {
                            SetDeleteRemark(true);
                          }
                        }}
                      >
                        Remove
                      </GradientButton>
                      <GradientButton
                        onClick={() => {
                          if (currentIndex && currentIndex !== totalData)
                            handleNext();
                        }}
                      >
                        Move Forward
                      </GradientButton>
                      <GradientButton
                        onClick={() => {
                          if (currentIndex && currentIndex !== totalData)
                            handlePrev();
                        }}
                      >
                        Previous
                      </GradientButton>
                      {zoneTranType === "R" &&
                        data?.[0]?.CHEQUE_DETAIL?.[0]?.CP_TRAN_CD ===
                        undefined && (
                          <>
                            <GradientButton
                              onClick={() => {
                                mutation.mutate({
                                  COMP_CD: data?.[0]?.COMP_CD,
                                  ENTERED_COMP_CD: data?.[0]?.ENTERED_COMP_CD,
                                  ENTERED_BRANCH_CD: data?.[0]?.ENTERED_BRANCH_CD,
                                  BRANCH_CD: data?.[0]?.BRANCH_CD,
                                  ACCT_TYPE: data?.[0]?.ACCT_TYPE,
                                  ACCT_CD: data?.[0]?.ACCT_CD,
                                  DAILY_TRN_CD: "",
                                  TRAN_CD:
                                    data?.[0]?.CHEQUE_DETAIL?.[0]?.CP_TRAN_CD,
                                  TRAN_DT: data?.[0]?.TRAN_DT,
                                  TRAN_FLAG: "E",
                                  WITH_SIGN: "Y",
                                  ENTERED_BY: data?.[0]?.ENTERED_BY,
                                });
                                setIsChequeSign(true);
                                setIsVisibleSign(false);
                              }}
                            >
                              View Cheque
                            </GradientButton>
                          </>
                        )}
                      <GradientButton
                        onClick={() => {
                          confHistory.mutate({
                            ENTERED_COMP_CD: data?.[0]?.ENTERED_COMP_CD,
                            ENTERED_BRANCH_CD: data?.[0]?.ENTERED_BRANCH_CD,
                            TRAN_DT: data?.[0]?.TRAN_DT,
                            TRAN_CD: data?.[0]?.TRAN_CD,
                            SCREEN_REF: "OW_CLG",
                          });
                          setIsConfHistory(true);
                        }}
                      >
                        Conf.History
                      </GradientButton>
                      <GradientButton
                        onClick={() => {
                          onClose();
                        }}
                      >
                        Close
                      </GradientButton>
                    </DialogActions>
                  </>
                </DialogTitle>
                <FormWrapper
                  key={"CTSOutwardClearingConfirm"}
                  metaData={
                    extractMetaData(
                      CTSOutwardClearingConfirmMetaData,
                      formMode
                    ) as MetaDataType
                  }
                  initialValues={data?.[0]}
                  onSubmitHandler={{}}
                  //@ts-ignore
                  displayMode={formMode}
                  hideHeader={true}
                  formStyle={{
                    background: "white",
                    width: "100%",
                    paddingTop: "55px",
                    // paddingTop: "54px",
                  }}
                />
                <FormWrapper
                  key={`ChequeDetails` + formMode}
                  metaData={
                    extractMetaData(
                      zoneTranType === "S"
                        ? ctsOutwardChequeDetailConfirmMetaData
                        : zoneTranType === "R"
                          ? inwardReturnChequeDetailConfirmMetaData
                          : inwardReturnChequeDetailConfirmMetaData,
                      formMode
                    ) as MetaDataType
                  }
                  displayMode={formMode}
                  onSubmitHandler={{}}
                  initialValues={{
                    chequeDetails: data?.[0]?.CHEQUE_DETAIL ?? "",
                  }}
                  hideHeader={true}
                  containerstyle={{ padding: "0px !important" }}
                  formStyle={{
                    height: "65%",
                  }}
                />

                {isDeleteRemark && (
                  <RemarksAPIWrapper
                    TitleText={
                      zoneTranType === "S"
                        ? "Enter Removal Remarks For CTS O/W CONFIRMATION (TRN/560)"
                        : zoneTranType === "R"
                          ? "Enter Removal Remarks For INWARD RETURN CONFIRMATION(TRN/332)"
                          : "Enter Removal Remarks For OUTWARD RETURN CONFIRMATION(TRN/346)"
                    }
                    onActionNo={() => SetDeleteRemark(false)}
                    onActionYes={async (val, rows) => {
                      const buttonName = await MessageBox({
                        messageTitle: "Confirmation",
                        message: "Do You Want to delete this row?",
                        buttonNames: ["No", "Yes"],
                        defFocusBtnName: "Yes",
                        loadingBtnName: "Yes",
                      });
                      if (buttonName === "Yes") {
                        deleteMutation.mutate({
                          DAILY_CLEARING: {
                            _isNewRow: false,
                            _isDeleteRow: true,
                            _isUpdateRow: false,
                            ENTERED_COMP_CD: rowsData?.ENTERED_COMP_CD,
                            ENTERED_BRANCH_CD: rowsData?.ENTERED_BRANCH_CD,
                            TRAN_CD: rowsData?.TRAN_CD,
                            CONFIRMED: rowsData?.CONFIRMED,
                            ENTERED_BY: rowsData?.ENTERED_BY,
                          },
                          BRANCH_CD: data?.[0]?.CHEQUE_DETAIL?.[0]?.BRANCH_CD,
                          SR_CD: rowsData?.SR_NO,
                          ACCT_TYPE: data?.[0]?.ACCT_TYPE,
                          ACCT_CD: data?.[0]?.ACCT_CD,
                          AMOUNT: data?.[0]?.AMOUNT,
                          TRAN_DT: data?.[0]?.TRAN_DT,
                          TRAN_CD: rowsData?.TRAN_CD,
                          USER_DEF_REMARKS: val
                            ? val
                            : zoneTranType === "S"
                              ? "WRONG ENTRY FROM CTS O/W CONFIRMATION (TRN/560)"
                              : zoneTranType === "R"
                                ? "WRONG ENTRY FROM INWARD RETURN CONFIRMATION(TRN/332)"
                                : "WRONG ENTRY FROM OUTWARD RETURN CONFIRMATION(TRN/346)",

                          ACTIVITY_TYPE:
                            zoneTranType === "S"
                              ? "CTS O/W CONFIRMATION (TRN/560)"
                              : zoneTranType === "R"
                                ? "INWARD RETURN CONFIRMATION(TRN/332)"
                                : "OUTWARD RETURN CONFIRMATION(TRN/346)",
                          DETAILS_DATA: {
                            isNewRow: [],
                            isDeleteRow: [
                              {
                                TRAN_CD: rowsData?.TRAN_CD,
                              },
                            ],
                            isUpdatedRow: [],
                          },
                          _isDeleteRow: true,
                        });

                        deleteMutation.mutate({
                          DAILY_CLEARING: {
                            TRAN_CD: rowsData?.TRAN_CD,
                          },
                          DETAILS_DATA: {
                            isNewRow: [],
                            isDeleteRow: [
                              {
                                TRAN_CD: rowsData?.TRAN_CD,
                              },
                            ],
                            isUpdatedRow: [],
                          },
                          _isDeleteRow: true,
                        });
                      }
                    }}
                    // isLoading={crudLimitData?.isLoading}
                    isEntertoSubmit={true}
                    AcceptbuttonLabelText="Ok"
                    CanceltbuttonLabelText="Cancel"
                    open={isDeleteRemark}
                    // rows={deleteDataRef.current}
                    defaultValue={
                      zoneTranType === "S"
                        ? "WRONG ENTRY FROM CTS O/W CONFIRMATION (TRN/560)"
                        : zoneTranType === "R"
                          ? "WRONG ENTRY FROM INWARD RETURN CONFIRMATION(TRN/332)"
                          : "WRONG ENTRY FROM OUTWARD RETURN CONFIRMATION(TRN/346)"
                    }
                    rows={undefined}
                  />
                )}

                <>
                  {isChequeSign ? (
                    <>
                      <Dialog
                        fullWidth
                        maxWidth="md"
                        open={true} // Assuming this is controlled by a state
                        onKeyUp={(event) => {
                          if (event.key === "Escape") {
                            onClose();
                          }
                        }}
                        key="chequeSignDialog"
                        PaperProps={{
                          style: {
                            width: "100%",
                            // height: "78%",
                            // height: "70%",
                          },
                        }}
                      >
                        <AppBar position="relative" color="secondary">
                          <Toolbar
                            className={headerClasses.root}
                            variant={"dense"}
                          >
                            <Typography
                              className={headerClasses.title}
                              color="inherit"
                              variant={"h6"}
                              component="div"
                            >
                              Inward Return Confirmation
                            </Typography>
                            <GradientButton
                              onClick={() => {
                                setIsChequeSign(false);
                              }}
                            >
                              Close
                            </GradientButton>
                          </Toolbar>
                        </AppBar>

                        {mutation.isLoading ? (
                          <LoaderPaperComponent />
                        ) : mutation.isError ? (
                          <Alert
                            severity="error"
                            errorMsg={
                              mutation.error?.error_msg ?? "Unknown error occured"
                            }
                            errorDetail={mutation.error?.error_detail ?? ""}
                          />
                        ) : (
                          <div style={{ paddingTop: 10 }}>
                            <ChequeSignImage
                              imgData={mutation?.data}
                            // isVisibleSign={isVisibleSign}
                            />
                          </div>
                        )}
                      </Dialog>
                    </>
                  ) : null}
                </>
                <>
                  {isConfHistory ? (
                    <>
                      <Dialog
                        fullWidth
                        maxWidth="md"
                        open={true} // Assuming this is controlled by a state
                        onKeyUp={(event) => {
                          if (event.key === "Escape") {
                            onClose();
                          }
                        }}
                        key="chequeSignDialog"
                        PaperProps={{
                          style: {
                            width: "100%",
                            // height: "78%",
                            // height: "70%",
                          },
                        }}
                      >
                        <GridWrapper
                          key={"CtsOutwardClearingConfirmGrid" + zoneTranType}
                          finalMetaData={DualConfHistoryGridMetaData}
                          data={confHistory?.data ?? []}
                          setData={() => null}
                          loading={
                            confHistory.isLoading || confHistory.isFetching
                          }
                          actions={actions}
                          setAction={setCurrentAction}
                        />
                      </Dialog>
                    </>
                  ) : null}
                </>
              </>
            )}
          </Dialog>
        </>
        {/* )} */}
      </Fragment>
    );
  };

export const CtsOutwardClearingConfirmForm = ({
  zoneTranType,
  handleDialogClose,
  isDataChangedRef,
  handlePrev,
  handleNext,
  currentIndexRef,
  totalData,
}) => {
  const { state: rows } = useLocation();
  currentIndexRef.current = rows?.index;

  return (
    <ClearCacheProvider>
      <CtsOutwardAndInwardReturnConfirm
        zoneTranType={zoneTranType}
        formMode={rows?.formMode}
        rowsData={rows?.gridData}
        onClose={handleDialogClose}
        handlePrev={handlePrev}
        handleNext={handleNext}
        currentIndex={rows.index}
        isDataChangedRef={isDataChangedRef}
        totalData={totalData}
      />
    </ClearCacheProvider>
  );
};
