import {
  AppBar,
  Dialog,
  Toolbar,
  Typography,
  Theme,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "pages_audit/auth";
import { makeStyles } from "@mui/styles";
import {
  usePopupContext,
  GradientButton,
  SubmitFnType,
  InitialValuesType,
  FormWrapper,
  MetaDataType,
  extractMetaData,
  GridWrapper,
  GridMetaDataType,
  queryClient,
  LoaderPaperComponent,
  Alert,
  ActionTypes,
  RemarksAPIWrapper,
} from "@acuteinfo/common-base";
import { t } from "i18next";
import { ViewMasterForm } from "../../fix-deposit/fixDepositForm/viewMasterForm";
import { FixDepositDetailFormMetadata } from "../../fix-deposit/fixDepositForm/metaData/fdDetailMetaData";
import { FDPaymentMetadata } from "../../fix-deposit/fixDepositForm/metaData/fdPaymentMetadata";
import {
  FDConfDetailsGridMetadata,
  FDConfUpdatedtlMetadata,
} from "../gridMetadata";
import { useMutation, useQuery } from "react-query";
import {
  fdConfirmationDeleteFormData,
  fdConfirmFormData,
  getFdConfPaymentData,
  getFdConfPaymentDepositGridData,
  getFdConfUpdateGridData,
  ValidateFDConfirm,
  ValidateFDDelete,
} from "../api";
import { DualConfHistoryGridMetaData } from "../../rtgsEntry/confirmation/ConfirmationMetadata";
import { getConfirmHistoryData } from "../../rtgsEntry/confirmation/api";
import { format } from "date-fns";
import PhotoSignWithHistory from "components/common/custom/photoSignWithHistory/photoSignWithHistory";

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
  footerTypoG: {
    color: "var(--theme-color1)",
    fontSize: "1rem",
    fontWeight: "500",
    padding: "0px 0px 5px 10px",
  },
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
export const FDConfirmationForm = ({ isDataChangedRef, closeDialog }) => {
  const isErrorFuncRef = useRef<any>(null);
  const { state: rows }: any = useLocation();
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const [openViewMaster, setOpenViewMaster] = useState<any>(false);
  const headerClasses = useTypeStyles();
  const [displayPhotoSign, setDisplayPhotoSign] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState({});
  const [openConfHistoryForm, setOpenConfHistoryForm] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const setCurrentAction = useCallback(async (data) => {
    if (data?.name === "close") {
      setOpenConfHistoryForm(false);
    }
  }, []);

  const {
    data: paymentData,
    isLoading: paymentIsLoading,
    isFetching: paymentIsFetching,
    isError: paymentIsError,
    error: paymentError,
  } = useQuery<any, any>(
    ["getFdConfPaymentData", authState?.user?.branchCode],
    () =>
      getFdConfPaymentData({
        BRANCH_CD: authState?.user?.branchCode ?? "",
        COMP_CD: authState?.companyID ?? "",
        ACCT_TYPE: rows?.[0]?.data?.ACCT_TYPE ?? "",
        ACCT_CD: rows?.[0]?.data?.ACCT_CD ?? "",
        FD_NO: rows?.[0]?.data?.FD_NO ?? "",
      }),
    {
      enabled: rows?.[0]?.data?.TRN_FLAG === "P",
      onSuccess: (payData) => {
        payData.forEach((item) => {
          item.PAY_DATA = JSON.parse(item.PAY_DATA);
        });
        return paymentData;
      },
    }
  );

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(
    ["getFdConfPaymentDepositGridData", authState?.user?.branchCode],
    () =>
      getFdConfPaymentDepositGridData({
        BRANCH_CD: authState?.user?.branchCode ?? "",
        COMP_CD: authState?.companyID ?? "",
        REMARKS: rows?.[0]?.data?.REMARKS ?? "",
        TRN_FLAG: rows?.[0]?.data?.TRN_FLAG ?? "",
        FD_NO: rows?.[0]?.data?.FD_NO ?? "",
      }),
    {
      enabled:
        rows?.[0]?.data?.TRN_FLAG === "P" || rows?.[0]?.data?.TRN_FLAG === "F",
    }
  );

  const {
    data: updateGridData,
    isLoading: updateIsLoading,
    isFetching: updateIsFetching,
    isError: updateIsError,
    error: updateError,
  } = useQuery<any, any>(
    ["getFdConfUpdateGridData", authState?.user?.branchCode],
    () =>
      getFdConfUpdateGridData({
        BRANCH_CD: authState?.user?.branchCode ?? "",
        COMP_CD: authState?.companyID ?? "",
        ACCT_TYPE: rows?.[0]?.data?.ACCT_TYPE ?? "",
        ACCT_CD: rows?.[0]?.data?.ACCT_CD ?? "",
        FD_NO: rows?.[0]?.data?.FD_NO ?? "",
      }),
    {
      enabled: rows?.[0]?.data?.TRN_FLAG === "U",
    }
  );

  const {
    data: confHistoryData,
    isLoading: confHistoryIsLoading,
    isFetching: confHistoryIsFetching,
    isError: confHistoryIsError,
    error: confHistoryError,
    refetch: confHistoryRefetch,
  } = useQuery<any, any>(
    ["getFdConfirmHistoryData", authState?.user?.branchCode],
    () =>
      getConfirmHistoryData({
        ENTERED_COMP_CD: data?.[0]?.ENTERED_COMP_CD ?? "",
        ENTERED_BRANCH_CD: data?.[0]?.ENTERED_BRANCH_CD ?? "",
        TRAN_DT: data?.[0]?.TRAN_DT
          ? format(new Date(data?.[0]?.TRAN_DT), "dd/MMM/yyyy").toUpperCase()
          : "",
        TRAN_CD: data?.[0]?.TRAN_CD ?? "",
        SCREEN_REF: "FD_CONFIRM",
      }),
    {
      enabled: Boolean(openConfHistoryForm),
    }
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries([
        "getFdConfPaymentDepositGridData",
        authState?.user?.branchCode,
      ]);
      queryClient.removeQueries([
        "getFdConfPaymentData",
        authState?.user?.branchCode,
      ]);
      queryClient.removeQueries([
        "getFdConfUpdateGridData",
        authState?.user?.branchCode,
      ]);
      queryClient.removeQueries([
        "getFdConfirmHistoryData",
        authState?.user?.branchCode,
      ]);
    };
  }, []);

  const validateDelete = useMutation(ValidateFDDelete, {
    onError: (error) => {
      // remain to add
    },
    onSuccess: (data) => {},
  });
  const deleteMutation = useMutation(fdConfirmationDeleteFormData, {
    onError: (error) => {
      // remain to add
    },
    onSuccess: (data) => {},
  });
  const validateConfirm = useMutation(ValidateFDConfirm, {
    onError: (error) => {
      // remain to add
    },
    onSuccess: (data) => {},
  });

  const confirmMutation = useMutation(fdConfirmFormData, {
    onError: (error) => {
      // remain to add
    },
    onSuccess: (data) => {},
  });

  const reqPara = {
    A_LOG_BRANCH: authState?.user?.branchCode ?? "",
    A_LOG_COMP: authState?.companyID ?? "",
    A_BRANCH_CD: rows?.[0]?.data?.BRANCH_CD ?? "",
    A_ACCT_TYPE: rows?.[0]?.data?.ACCT_TYPE ?? "",
    A_ACCT_CD: rows?.[0]?.data?.ACCT_CD ?? "",
    A_FD_NO: rows?.[0]?.data?.FD_NO ?? "",
    A_TRN_FLAG: rows?.[0]?.data?.TRN_FLAG ?? "",
    WORKING_DATE: authState?.workingDate ?? "",
    A_SCREEN_REF: "RPT/402",
    USERNAME: authState?.user?.id ?? "",
    USERROLE: authState?.role ?? "",
    DISPLAY_LANGUAGE: "en",
  };

  const handleDelete = async () => {
    validateDelete.mutate(reqPara, {
      onSuccess: async (data, variables) => {
        for (let i = 0; i < data?.length; i++) {
          if (data[i]?.O_STATUS === "999") {
            const btnName = await MessageBox({
              messageTitle: "ValidationFailed",
              message: data[i]?.O_MESSAGE,
              buttonNames: ["Ok"],
              icon: "ERROR",
            });
          } else if (data[i]?.O_STATUS === "9") {
            const btnName = await MessageBox({
              messageTitle: "Alert",
              message: data[i]?.O_MESSAGE,
              icon: "WARNING",
            });
          } else if (data[i]?.O_STATUS === "99") {
            const btnName = await MessageBox({
              messageTitle: "Confirmation",
              message: data[i]?.O_MESSAGE,
              buttonNames: ["Yes", "No"],
            });
            if (btnName === "No") {
              break;
            }
          } else if (data[i]?.O_STATUS === "0") {
            setIsDelete(true);
          }
        }
      },
    });
  };

  const handleConfirm = async () => {
    validateConfirm.mutate(
      {
        ...reqPara,
        A_REMARKS: rows?.[0]?.data?.REMARKS ?? "",
        A_ENTERED_BY: rows?.[0]?.data?.ENTERED_BY ?? "",
      },
      {
        onSuccess: async (data, variables) => {
          for (let i = 0; i < data?.length; i++) {
            if (data[i]?.O_STATUS === "999") {
              const btnName = await MessageBox({
                messageTitle: "ValidationFailed",
                message: data[i]?.O_MESSAGE,
                buttonNames: ["Ok"],
                icon: "ERROR",
              });
            } else if (data[i]?.O_STATUS === "9") {
              const btnName = await MessageBox({
                messageTitle: "Alert",
                message: data[i]?.O_MESSAGE,
                icon: "WARNING",
              });
            } else if (data[i]?.O_STATUS === "99") {
              const btnName = await MessageBox({
                messageTitle: "Confirmation",
                message: data[i]?.O_MESSAGE,
                buttonNames: ["Yes", "No"],
              });
              if (btnName === "No") {
                break;
              }
            } else if (data[i]?.O_STATUS === "0") {
              const confirmData = {
                A_BRANCH_CD: rows?.[0]?.data?.BRANCH_CD ?? "",
                A_ACCT_TYPE: rows?.[0]?.data?.ACCT_TYPE ?? "",
                A_ACCT_CD: rows?.[0]?.data?.ACCT_CD ?? "",
                A_FD_NO: rows?.[0]?.data?.FD_NO ?? "",
                A_TRN_FLAG: rows?.[0]?.data?.TRN_FLAG ?? "",
                REMARKS: rows?.[0]?.data?.REMARKS ?? "",
                A_SCREEN_REF: "RPT/402",
              };
              confirmMutation.mutate(confirmData);
            }
          }
        },
      }
    );
  };

  return (
    <>
      {paymentIsFetching || paymentIsLoading ? (
        <div style={{ width: "100%", height: "100px" }}>
          <LoaderPaperComponent />
        </div>
      ) : (
        <>
          {paymentIsError ? (
            <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
              <AppBar position="relative" color="primary">
                <Alert
                  severity="error"
                  errorMsg={paymentError?.error_msg ?? "Unknow Error"}
                  errorDetail={paymentError?.error_detail ?? ""}
                  color="error"
                />
              </AppBar>
            </div>
          ) : null}

          <AppBar position="relative" style={{ marginBottom: "10px" }}>
            <Toolbar className={headerClasses.root} variant="dense">
              <Typography
                className={headerClasses.title}
                color="inherit"
                variant={"h5"}
                component="div"
              >
                Fix Deposit Confirmation
              </Typography>

              <GradientButton
                onClick={() => setOpenViewMaster(true)}
                color={"primary"}
                // style={{
                //   paddingRight
                // }}
              >
                {t("View Master")}
              </GradientButton>

              {rows?.[0]?.data?.TRN_FLAG === "P" ||
              rows?.[0]?.data?.TRN_FLAG === "F" ? (
                <GradientButton
                  onClick={() => {
                    setOpenConfHistoryForm(true);
                  }}
                  color={"primary"}
                  disabled={isLoading}
                >
                  {t("ConfHistory")}
                </GradientButton>
              ) : null}

              <GradientButton
                color={"primary"}
                disabled={isLoading || isFetching || validateConfirm?.isLoading}
                endIcon={
                  validateConfirm?.isLoading ? (
                    <CircularProgress size={20} />
                  ) : null
                }
                onClick={handleConfirm}
              >
                {t("Confirm")}
              </GradientButton>

              {rows?.[0]?.data?.ALLOW_DELETE === "Y" ? (
                <GradientButton
                  onClick={handleDelete}
                  disabled={
                    validateDelete?.isLoading || isLoading || isFetching
                  }
                  endIcon={
                    validateDelete?.isLoading ? (
                      <CircularProgress size={20} />
                    ) : null
                  }
                  color={"primary"}
                >
                  {t("Reject")}
                </GradientButton>
              ) : null}

              <GradientButton onClick={closeDialog} color={"primary"}>
                {t("Close")}
              </GradientButton>
            </Toolbar>
          </AppBar>

          <>
            {rows?.[0]?.data?.TRN_FLAG === "F" ||
            rows?.[0]?.data?.TRN_FLAG === "U" ? (
              <Paper
                sx={{
                  height: "42vh",
                  overflow: "auto",
                  margin: "0 10px",
                  border: "1px solid var(--theme-color4)",
                  boxShadow: "none",
                }}
              >
                <FormWrapper
                  key={"fdConfirmationDeposit"}
                  metaData={
                    extractMetaData(
                      FixDepositDetailFormMetadata,
                      "view"
                    ) as MetaDataType
                  }
                  onSubmitHandler={() => {}}
                  displayMode={"view"}
                  initialValues={
                    {
                      FDDTL: [{ ...rows?.[0]?.data }],
                    } as InitialValuesType
                  }
                  formStyle={{
                    background: "white",
                  }}
                  hideHeader={true}
                ></FormWrapper>
              </Paper>
            ) : rows?.[0]?.data?.TRN_FLAG === "P" ? (
              <Paper
                sx={{
                  height: "50vh",
                  overflow: "auto",
                  margin: "0 10px",
                  border: "1px solid var(--theme-color4)",
                  boxShadow: "none",
                }}
              >
                <FormWrapper
                  key={"fDConfirmationPayment"}
                  displayMode={"view"}
                  metaData={FDPaymentMetadata as MetaDataType}
                  onSubmitHandler={() => {}}
                  initialValues={
                    { ...paymentData?.[0].PAY_DATA } as InitialValuesType
                  }
                  formStyle={{
                    background: "white",
                    minWidth: "1200px",
                  }}
                  formState={{ flag: "FDCNF" }}
                  hideHeader={true}
                ></FormWrapper>
              </Paper>
            ) : null}
          </>
          <Paper
            sx={{
              height: "30vh",
              overflow: "auto",
              padding: "5px 10px 0px 10px",
              border: "none",
              boxShadow: "none",
            }}
          >
            {rows?.[0]?.data?.TRN_FLAG === "P" ||
            rows?.[0]?.data?.TRN_FLAG === "F" ? (
              <>
                {isError && (
                  <Alert
                    severity="error"
                    errorMsg={error?.error_msg ?? "Something went to wrong.."}
                    errorDetail={error?.error_detail}
                    color="error"
                  />
                )}
                <GridWrapper
                  key={`FDConfDetailsGridMetadata`}
                  finalMetaData={FDConfDetailsGridMetadata as GridMetaDataType}
                  data={data ?? []}
                  setData={() => {}}
                  loading={isLoading || isFetching}
                  onClickActionEvent={async (index, id, data) => {
                    console.log("data", data);
                    if (id === "SIGNATURE") {
                      setDisplayPhotoSign(true);
                      setSelectedAccount({
                        COMP_CD: data?.COMP_CD ?? "",
                        BRANCH_CD: data?.BRANCH_CD ?? "",
                        ACCT_TYPE: data?.ACCT_TYPE ?? "",
                        ACCT_CD: data?.ACCT_CD ?? "",
                        SCREEN_REF: "RPT/402",
                        ACCT_NM: data?.ACCT_NM ?? "",
                      });
                    }
                  }}
                />
              </>
            ) : rows?.[0]?.data?.TRN_FLAG === "U" ? (
              <>
                {updateIsError && (
                  <Alert
                    severity="error"
                    errorMsg={
                      updateError?.error_msg ?? "Something went to wrong.."
                    }
                    errorDetail={updateError?.error_detail}
                    color="error"
                  />
                )}
                <GridWrapper
                  key={`FDConfUpdatedtlMetadata`}
                  finalMetaData={FDConfUpdatedtlMetadata as GridMetaDataType}
                  data={updateGridData ?? []}
                  setData={() => {}}
                  loading={updateIsLoading || updateIsFetching}
                />
              </>
            ) : null}
          </Paper>

          {openViewMaster && (
            <ViewMasterForm
              requestData={rows?.[0]?.data}
              handleDialogClose={() => {
                setOpenViewMaster(false);
              }}
            />
          )}

          {displayPhotoSign ? (
            <>
              <div style={{ paddingTop: 10 }}>
                <PhotoSignWithHistory
                  data={selectedAccount}
                  onClose={() => {
                    setDisplayPhotoSign(false);
                  }}
                  screenRef={"RPT/402"}
                />
              </div>
            </>
          ) : null}

          {openConfHistoryForm ? (
            <>
              <Dialog
                open={openConfHistoryForm}
                fullWidth
                maxWidth="md"
                PaperProps={{
                  style: {
                    width: "100%",
                  },
                }}
              >
                {confHistoryIsError && (
                  <Alert
                    severity="error"
                    errorMsg={
                      confHistoryError?.error_msg ?? "Something went to wrong.."
                    }
                    errorDetail={confHistoryError?.error_detail}
                    color="error"
                  />
                )}
                <GridWrapper
                  key={"fdDualConfirmationForm"}
                  finalMetaData={
                    DualConfHistoryGridMetaData as GridMetaDataType
                  }
                  data={confHistoryData ?? []}
                  setData={() => null}
                  loading={confHistoryIsLoading || confHistoryIsFetching}
                  actions={actions}
                  setAction={setCurrentAction}
                />
              </Dialog>
            </>
          ) : null}

          {isDelete && (
            <RemarksAPIWrapper
              TitleText={
                "Enter Removal Remarks For Fix Deposit Confirmation (RPT/402)"
              }
              label={"RemovalRemarks"}
              onActionNo={() => setIsDelete(false)}
              onActionYes={(val, rows) => {
                const DeleteData = {
                  LOG_BR: authState?.user?.branchCode ?? "",
                  COMP_CD: authState?.companyID ?? "",
                  BRANCH_CD: rows?.BRANCH_CD ?? "",
                  ACCT_TYPE: rows?.ACCT_TYPE ?? "",
                  ACCT_CD: rows?.ACCT_CD ?? "",
                  FD_NO: rows?.FD_NO ?? "",
                  REMARKS: rows?.REMARKS ?? "",
                  TRN_FLAG: rows?.TRN_FLAG ?? "",
                  USER_REMARKS: val
                    ? val
                    : "WRONG ENTRY FROM FIX DEPOSIT CONFIRMATION (RPT/402)",
                  AMOUNT: data?.[0]?.TOT_AMT ?? "",
                  CONFIRMED: rows?.CONFIRMED ?? "",
                  ENTERED_BY: rows?.ENTERED_BY ?? "",
                  GD_DATE: authState?.workingDate ?? "",
                  SCREEN_REF: "RPT/402",
                };
                deleteMutation.mutate(DeleteData);
              }}
              isLoading={deleteMutation?.isLoading}
              isEntertoSubmit={true}
              AcceptbuttonLabelText="Ok"
              CanceltbuttonLabelText="Cancel"
              open={isDelete}
              rows={rows?.[0]?.data}
              defaultValue={
                "WRONG ENTRY FROM FIX DEPOSIT CONFIRMATION (RPT/402)"
              }
            />
          )}
        </>
      )}
    </>
  );
};

export const FDConfirmationFormWrapper = ({
  isDataChangedRef,
  closeDialog,
}) => {
  return (
    <Dialog
      open={true}
      fullWidth={true}
      PaperProps={{
        style: {
          width: "100%",
        },
      }}
      maxWidth="xl"
    >
      <FDConfirmationForm
        isDataChangedRef={isDataChangedRef}
        closeDialog={closeDialog}
      />
    </Dialog>
  );
};
