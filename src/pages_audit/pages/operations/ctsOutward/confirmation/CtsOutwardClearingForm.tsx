import {
  FC,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  CTSOutwardClearingConfirmMetaData,
  DualConfHistoryGridMetaData,
  ctsOutwardChequeDetailConfirmMetaData,
  inwardReturnChequeDetailConfirmMetaData,
} from "./ConfirmationMetadata";
import * as API from "./api";
import { useMutation, useQuery } from "react-query";
import { AuthContext } from "pages_audit/auth";
import {
  AppBar,
  Dialog,
  DialogContent,
  Theme,
  Toolbar,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";
import { format } from "date-fns";
import { useLocation } from "react-router-dom";
import { ChequeSignImage } from "../../inwardClearing/inwardClearingForm/chequeSignImage";
import { Box } from "@mui/system";
import { t } from "i18next";
import {
  RemarksAPIWrapper,
  usePopupContext,
  GridWrapper,
  Alert,
  LoaderPaperComponent,
  ActionTypes,
  queryClient,
  ClearCacheProvider,
  FormWrapper,
  MetaDataType,
  GradientButton,
  extractMetaData,
} from "@acuteinfo/common-base";
const useTypeStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    background: "var(--theme-color5)",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--white)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
  refreshiconhover: {},
}));
const actions: ActionTypes[] = [
  {
    actionName: "close",
    actionLabel: t("Close"),
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
  formLabel?: any;
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
  formLabel,
}) => {
  const { authState } = useContext(AuthContext);
  const headerClasses = useTypeStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const [isDeleteRemark, SetDeleteRemark] = useState(false);
  const [isChequeSign, setIsChequeSign] = useState<any>(false);
  const [isVisibleSign, setIsVisibleSign] = useState<any>(false);
  const [isConfHistory, setIsConfHistory] = useState<any>(false);
  let currentPath = useLocation().pathname;
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
      onSuccess: (data) => {},
      onError: (error: any) => {},
    }
  );
  const confHistory: any = useMutation(
    "getConfirmHistoryData",
    API.getConfirmHistoryData,
    {
      onSuccess: (data) => {},
      onError: (error: any) => {},
    }
  );
  const confirmation: any = useMutation(
    "getCtsAndInwardConfirmtion",
    API.getCtsAndInwardConfirmtion,
    {
      onSuccess: async (data) => {
        if (data[0]?.STATUS === "999") {
          await MessageBox({
            messageTitle: "ValidationFailed",
            message: data[0]?.MSG,
            buttonNames: ["Ok"],
            icon: "ERROR",
          });
        } else if (data[0]?.O_STATUS === "0") {
          enqueueSnackbar(data, {
            variant: "success",
          });
          isDataChangedRef.current = true;
          onClose();
        }

        CloseMessageBox();
      },
      onError: (error: any) => {
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
      enqueueSnackbar(t("RecordSuccessfullyDeleted"), {
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
            messageTitle: t("ValidationFailed"),
            message: t("CannotDeleteConfirmedTransaction"),
            buttonNames: ["Ok"],
          });
        } else if (
          !(
            format(new Date(rowsData?.TRAN_DT), "dd/MMM/yyyy") ===
            format(new Date(authState?.workingDate), "dd/MMM/yyyy")
          )
        ) {
          await MessageBox({
            messageTitle: t("ValidationFailed"),
            message: t("CannotDeleteBackDatedEntry"),
            buttonNames: ["Ok"],
          });
        } else {
          SetDeleteRemark(true);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
  }, []);
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
          <AppBar
            position="static"
            sx={{
              height: "auto",
              background: "var(--theme-color5)",
              margin: "10px",
              width: "auto",
            }}
          >
            <Toolbar>
              <Typography
                variant="h6"
                style={{ flexGrow: 1 }}
                sx={{
                  fontWeight: 700,
                  color: "var(--theme-color2)",
                  fontSize: "1.2rem",
                }}
              >
                {zoneTranType === "S"
                  ? formLabel
                  : zoneTranType === "R"
                  ? formLabel
                  : zoneTranType === "W"
                  ? formLabel
                  : null}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <GradientButton
                  onClick={async () => {
                    if (authState?.user?.id === data?.[0]?.ENTERED_BY) {
                      await MessageBox({
                        messageTitle: t("ValidationFailed"),
                        message: t("ConfirmRestrictMsg"),
                        buttonNames: ["Ok"],
                      });
                    } else {
                      const buttonName = await MessageBox({
                        messageTitle: t("Confirmation"),
                        message: t(
                          "DoYouWantToAllowTheTransaction" +
                            " - " +
                            "Slip No." +
                            data?.[0]?.SLIP_CD +
                            " " +
                            "?"
                        ),
                        buttonNames: ["No", "Yes"],
                        loadingBtnName: ["Yes"],
                      });
                      if (buttonName === "Yes") {
                        confirmation.mutate({
                          ENTERED_COMP_CD: data?.[0]?.ENTERED_COMP_CD,
                          ENTERED_BRANCH_CD: data?.[0]?.ENTERED_BRANCH_CD,
                          BRANCH_CD: data?.[0]?.BRANCH_CD,
                          TRAN_DT: data?.[0]?.TRAN_DT,
                          TRAN_CD: data?.[0]?.TRAN_CD,
                          ACCT_TYPE: data?.[0]?.ACCT_TYPE,
                          ACCT_CD: data?.[0]?.ACCT_CD,
                          ENTERED_BY: data?.[0]?.ENTERED_BY,
                          AMOUNT: data?.[0]?.AMOUNT,
                          SCREEN_REF:
                            zoneTranType === "S"
                              ? "TRN/560"
                              : zoneTranType === "R"
                              ? "TRN/029"
                              : "TRN/346",
                        });
                      }
                    }
                  }}
                >
                  {t("Confirm")}
                </GradientButton>
                <GradientButton
                  onClick={async () => {
                    if (rowsData?.CONFIRMED === "Y" && authState?.role < "2") {
                      await MessageBox({
                        messageTitle: t("Validation Failed"),
                        message: t("CannotDeleteConfirmedTransaction"),
                        buttonNames: ["Ok"],
                      });
                    } else if (
                      format(new Date(rowsData?.TRAN_DT), "dd/MMM/yyyy") ===
                      format(new Date(authState?.workingDate), "dd/MMM/yyyy")
                    ) {
                      await MessageBox({
                        messageTitle: t("Validation Failed"),
                        message: t("CannotDeleteBackDatedEntry"),
                        buttonNames: ["Ok"],
                      });
                    } else {
                      SetDeleteRemark(true);
                    }
                  }}
                >
                  {t("Remove")}
                </GradientButton>
                <GradientButton
                  onClick={() => {
                    if (currentIndex && currentIndex !== totalData)
                      handleNext();
                  }}
                >
                  {t("MoveForward")}
                </GradientButton>
                <GradientButton
                  onClick={() => {
                    if (currentIndex && currentIndex !== totalData)
                      handlePrev();
                  }}
                >
                  {t("Previous")}
                </GradientButton>
                {zoneTranType === "R" &&
                  data?.[0]?.CHEQUE_DETAIL?.[0]?.CP_TRAN_CD !== null &&
                  data?.[0]?.CHEQUE_DETAIL?.[0]?.CP_TRAN_CD !== undefined && (
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
                            TRAN_CD: data?.[0]?.CHEQUE_DETAIL?.[0]?.CP_TRAN_CD,
                            TRAN_DT: data?.[0]?.TRAN_DT,
                            TRAN_FLAG: "E",
                            WITH_SIGN: "Y",
                            ENTERED_BY: data?.[0]?.ENTERED_BY,
                          });
                          setIsChequeSign(true);
                          setIsVisibleSign(false);
                        }}
                      >
                        {t("ViewCheque")}
                      </GradientButton>
                    </>
                  )}
                <GradientButton
                  onClick={() => {
                    confHistory.mutate({
                      TRAN_CD: rowsData?.TRAN_CD,
                      ENTERED_COMP_CD: rowsData?.ENTERED_COMP_CD ?? "",
                      ENTERED_BRANCH_CD: rowsData?.ENTERED_BRANCH_CD ?? "",
                      TRAN_DT: rowsData?.TRAN_DT,
                      SCREEN_REF: "OW_CLG",
                    });
                    setIsConfHistory(true);
                  }}
                >
                  {t("ConfHistory")}
                </GradientButton>
                <GradientButton
                  onClick={() => {
                    onClose();
                  }}
                >
                  {t("Close")}
                </GradientButton>
              </Box>
            </Toolbar>
          </AppBar>
          <DialogContent sx={{ padding: "0px" }}>
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
                <FormWrapper
                  key={"CTSOutwardClearingConfirm"}
                  metaData={
                    extractMetaData(
                      CTSOutwardClearingConfirmMetaData,
                      formMode
                    ) as MetaDataType
                  }
                  initialValues={data?.[0] ?? {}}
                  onSubmitHandler={() => {}}
                  //@ts-ignore
                  displayMode={formMode}
                  hideHeader={true}
                  formStyle={{
                    background: "white",
                    width: "100%",
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
                  onSubmitHandler={() => {}}
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
                        ? t("EnterRemovalRemarksCTSOWCONFIRMATION")
                        : zoneTranType === "R"
                        ? t("EnterRemovalRemarksINWARDRETURNCONFIRMATION")
                        : t("EnterRemovalRemarksOUTWARDRETURNCONFIRMATION")
                    }
                    onActionNo={() => SetDeleteRemark(false)}
                    onActionYes={async (val, rows) => {
                      const buttonName = await MessageBox({
                        messageTitle: t("Confirmation"),
                        message: t("DoYouWantDeleteRow"),
                        buttonNames: ["No", "Yes"],
                        defFocusBtnName: "Yes",
                        loadingBtnName: ["Yes"],
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
                              {t("Close")}
                            </GradientButton>
                          </Toolbar>
                        </AppBar>

                        {mutation.isLoading ? (
                          <LoaderPaperComponent />
                        ) : mutation.isError ? (
                          <Alert
                            severity="error"
                            errorMsg={
                              mutation.error?.error_msg ??
                              "Unknown error occured"
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
          </DialogContent>
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
  formLabel,
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
        formLabel={formLabel}
      />
    </ClearCacheProvider>
  );
};
