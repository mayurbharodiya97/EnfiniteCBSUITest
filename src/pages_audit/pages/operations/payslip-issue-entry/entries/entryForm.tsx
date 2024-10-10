import {
  ClearCacheProvider,
  extractGridMetaData,
  extractMetaData,
  FormWrapper,
  GradientButton,
  LoadingTextAnimation,
  MetaDataType,
  RemarksAPIWrapper,
  SubmitFnType,
  usePopupContext,
  utilFunction,
} from "@acuteinfo/common-base";
import { CircularProgress, Dialog, Paper } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { ddTransactionFormMetaData } from "./metaData";
import { useLocation } from "react-router-dom";
import { commonDataRetrive, getVoucherList, headerDataRetrive } from "../api";
import { Mutation, useMutation, useQuery } from "react-query";
import { AuthContext } from "pages_audit/auth";
import * as API from "./api";
import { t } from "i18next";
import { enqueueSnackbar } from "notistack";
import { format } from "date-fns";

const EntryFormView = ({
  onClose,
  gridData,
  currentIndex,
  handlePrev,
  handleNext,
  rowsData,
  headerLabel,
  screenFlag,
  trans_type,
}) => {
  const [formMode, setFormMode] = useState("add");
  const [isDeleteRemark, SetDeleteRemark] = useState(false);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const isErrorFuncRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);

  const requestData = {
    COMP_CD: authState?.companyID,
    BRANCH_CD: authState.user.branchCode,
    TRAN_CD: rowsData?.TRAN_CD,
    SR_CD: rowsData?.SR_CD,
  };
  useEffect(() => {
    if (screenFlag === "CANCELCONFRM") {
      setFormMode("edit");
    }
  }, [screenFlag]);
  const { data: acctDtlData, isLoading: isAcctDtlLoading } = useQuery(
    ["headerData", requestData],
    () => headerDataRetrive(requestData)
  );
  const { data: reasonData, isLoading: isReasonDataLoading } = useQuery(
    ["getReasonData", requestData],
    () => API.getReasonData(requestData)
  );
  const { data: draftDtlData, isLoading: isdraftDtlLoading } = useQuery(
    ["draftdata", requestData],
    () => API.getRealizedHeaderData(requestData)
  );
  ddTransactionFormMetaData.form.label = headerLabel;
  const voucherMutation = useMutation(getVoucherList, {
    onError: async (error: any) => {
      const btnName = await MessageBox({
        message: error?.error_msg,
        messageTitle: "error",
        buttonNames: ["Ok"],
      });
      isErrorFuncRef.current?.endSubmit(false);
    },
    onSuccess: async (data: any) => {
      if (data[0]?.VOUCHER_MSG === "") {
        return;
      } else {
        const btnName = await MessageBox({
          message: data[0]?.VOUCHER_MSG,
          messageTitle: "Vouchers Confirmation",
          buttonNames: ["Ok"],
        });
      }
      // closeDialog();
      CloseMessageBox();
    },
  });
  const mutation = useMutation(API.payslipRealizeEntrySave, {
    onError: async (error: any) => {
      let errorMsg = t("Unknownerroroccured");
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      const btnName = await MessageBox({
        message: `${errorMsg}`,
        messageTitle: "Error",
        icon: "ERROR",
        buttonNames: ["Ok"],
      });
      if (btnName === "Ok") {
        onClose();
      }

      CloseMessageBox();
    },
    onSuccess: (data) => {
      enqueueSnackbar(t("insertSuccessfully"), {
        variant: "success",
      });
      if (data[0]?.TRAN_CD) {
        voucherMutation.mutate({
          A_ENT_COMP_CD: authState?.companyID,
          A_ENT_BRANCH_CD: authState?.user?.branchCode,
          A_TRAN_DT: format(new Date(authState?.workingDate), "dd/MMM/yyyy"),
          A_TRAN_CD: rowsData?.TRAN_CD,
          A_TRN_FLAG: "Y",
          A_SDC: "PSLP",
          A_SR_CD: rowsData?.SR_CD,
        });
      }
      CloseMessageBox();
      onClose();
    },
  });
  const confirmMutation = useMutation(API.DoddTransactionConfirmation, {
    onError: async (error: any) => {
      let errorMsg = t("Unknownerroroccured");
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      const btnName = await MessageBox({
        message: `${errorMsg}`,
        messageTitle: "Error",
        icon: "ERROR",
        buttonNames: ["Ok"],
      });
      if (btnName === "Ok") {
        onClose();
      }

      CloseMessageBox();
    },
    onSuccess: (data) => {
      enqueueSnackbar(t("insertSuccessfully"), {
        variant: "success",
      });
      CloseMessageBox();
      onClose();
    },
  });

  const rejectMutaion = useMutation(
    "rejectMutaion",
    API.DoddTransactionConfirmation,
    {
      onSuccess: (data) => {
        SetDeleteRemark(false);
        enqueueSnackbar(`${data}`, {
          variant: "success",
        });
        CloseMessageBox();
        onClose();
      },
      onError: async (error: any) => {
        let errorMsg = t("Unknownerroroccured");
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        const btnName = await MessageBox({
          message: `${errorMsg}`,
          messageTitle: "Error",
          icon: "ERROR",
          buttonNames: ["Ok"],
        });
        if (btnName === "Ok") {
          onClose();
        }

        CloseMessageBox();
      },
    }
  );
  console.log(reasonData, "GETRETURNREASON");

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData: any,
    endSubmit,
    setFieldError
  ) => {
    endSubmit(true);
    // console.log(data);

    if (screenFlag === "REALIZEENTRY") {
      const newTransferAccountData = {
        TRF_COMP_CD: data?.TRF_COMP_CD_DISP,
        TRF_BRANCH_CD: data?.TRF_BRANCH_CD,
        TRF_ACCT_TYPE: data?.TRF_ACCT_TYPE,
        TRF_ACCT_CD: data?.TRF_ACCT_CD,
        // TRF_NAME: data?.TRF_NAME,
      };
      let newData = {
        COLLECT_COMISSION: data?.COLLECT_COMISSION,
        REALIZE_AMT: data?.REALIZE_AMT,
        C_C_T_SP_C: data?.C_C_T_SP_C,
        REALIZE_BRANCH_CD: authState?.user?.branchCode,
        REALIZE_COMP_CD: authState?.companyID,
        REALIZE_BY: authState?.user?.id,
        REALIZE_DATE:
          format(new Date(data?.REALIZE_DATE_DISP), "dd/MMM/yyyy") ?? "",
        PENDING_FLAG: "Y",
        ...(data?.C_C_T_SP_C !== "G" ? { CHEQUE_NO: data?.TOKEN_NO } : {}),
        ...(data?.C_C_T_SP_C === "T" ? newTransferAccountData : {}),
        ...(data.C_C_T_SP_C === "C" ? { PENDING_FLAG: "Y" } : {}),
        ...(rowsData?.PARA_243 === "Y"
          ? {
              REALIZE_FLAG: "Y",
            }
          : {}),
      };

      const oldTransferAccountData = {
        TRF_COMP_CD: draftDtlData[0]?.TRF_COMP_CD,
        TRF_BRANCH_CD: draftDtlData[0]?.TRF_BRANCH_CD,
        TRF_ACCT_TYPE: draftDtlData[0]?.TRF_ACCT_TYPE,
        TRF_ACCT_CD: draftDtlData[0]?.TRF_ACCT_CD,
        // TRF_NAME: draftDtlData[0]?.TRF_NAME,
      };

      const oldData = {
        COLLECT_COMISSION: draftDtlData[0]?.COLLECT_COMISSION,
        REALIZE_AMT: draftDtlData[0]?.REALIZE_AMT,
        C_C_T_SP_C: draftDtlData[0]?.C_C_T_SP_C,
        ...(draftDtlData?.C_C_T_SP_C !== "G"
          ? { CHEQUE_NO: draftDtlData[0]?.CHEQUE_NO }
          : {}),
        REALIZE_BY: draftDtlData[0]?.REALIZE_BY,
        // REALIZE_DATE_DISP: authState?.workingDate,
        REALIZE_DATE: draftDtlData[0]?.REALIZE_DATE,
        REALIZE_BRANCH_CD: draftDtlData[0]?.REALIZE_BRANCH_CD,
        REALIZE_COMP_CD: draftDtlData[0]?.REALIZE_COMP_CD,
        PENDING_FLAG: draftDtlData[0]?.PENDING_FLAG,
        ...(data?.C_C_T_SP_C === "T" ? oldTransferAccountData : {}),
        ...(rowsData?.PARA_243 === "Y"
          ? {
              REALIZE_FLAG: rowsData.REALIZE_FLAG,
            }
          : {}),
      };

      let upd = utilFunction.transformDetailsData(newData, oldData);
      console.log(newData, "newdata");
      console.log(oldData, "olddata");
      console.log(upd, "..");

      isErrorFuncRef.current = {
        data: {
          ...newData,
          ...upd,
          ENTERED_COMP_CD: authState?.companyID,
          ENTERED_BRANCH_CD: authState?.user?.branchCode,
          TRAN_CD: rowsData?.TRAN_CD,
          SR_CD: rowsData?.SR_CD,
        },
        displayData,
        endSubmit,
        setFieldError,
      };

      mutation.mutate({
        ...isErrorFuncRef.current?.data,
      });
      console.log(isErrorFuncRef.current?.data, "PAYLOAD");
    } else if (screenFlag === "CANCELENTRY") {
      const newTransferAccountData = {
        TRF_COMP_CD: data?.TRF_COMP_CD_DISP,
        TRF_BRANCH_CD: data?.TRF_BRANCH_CD,
        TRF_ACCT_TYPE: data?.TRF_ACCT_TYPE,
        TRF_ACCT_CD: data?.TRF_ACCT_CD,
      };
      let newData = {
        COLLECT_COMISSION: data?.COLLECT_COMISSION,
        REALIZE_AMT: data?.REALIZE_AMT,
        C_C_T_SP_C: data?.C_C_T_SP_C,
        REALIZE_BRANCH_CD: authState?.user?.branchCode,
        REALIZE_COMP_CD: authState?.companyID,
        REALIZE_BY: authState?.user?.id,
        REALIZE_DATE:
          format(new Date(data?.REALIZE_DATE_DISP), "dd/MMM/yyyy") ?? "",
        PENDING_FLAG: "Y",
        ...(data?.C_C_T_SP_C !== "G" ? { CHEQUE_NO: data?.TOKEN_NO } : {}),
        ...(data?.C_C_T_SP_C === "T" ? newTransferAccountData : {}),
        ...(data.C_C_T_SP_C === "C" ? { PENDING_FLAG: "Y" } : {}),
        ...(rowsData?.PARA_243 === "Y"
          ? {
              REALIZE_FLAG: "Y",
            }
          : {}),
      };

      const oldTransferAccountData = {
        TRF_COMP_CD: draftDtlData[0]?.TRF_COMP_CD,
        TRF_BRANCH_CD: draftDtlData[0]?.TRF_BRANCH_CD,
        TRF_ACCT_TYPE: draftDtlData[0]?.TRF_ACCT_TYPE,
        TRF_ACCT_CD: draftDtlData[0]?.TRF_ACCT_CD,
        // TRF_NAME: draftDtlData[0]?.TRF_NAME,
      };

      const oldData = {
        COLLECT_COMISSION: draftDtlData[0]?.COLLECT_COMISSION,
        REALIZE_AMT: draftDtlData[0]?.REALIZE_AMT,
        C_C_T_SP_C: draftDtlData[0]?.C_C_T_SP_C,
        ...(draftDtlData?.C_C_T_SP_C !== "G"
          ? { CHEQUE_NO: draftDtlData[0]?.CHEQUE_NO }
          : {}),
        REALIZE_BY: draftDtlData[0]?.REALIZE_BY,
        // REALIZE_DATE_DISP: authState?.workingDate,
        REALIZE_DATE: draftDtlData[0]?.REALIZE_DATE,
        REALIZE_BRANCH_CD: draftDtlData[0]?.REALIZE_BRANCH_CD,
        REALIZE_COMP_CD: draftDtlData[0]?.REALIZE_COMP_CD,
        PENDING_FLAG: draftDtlData[0]?.PENDING_FLAG,
        ...(data?.C_C_T_SP_C === "T" ? oldTransferAccountData : {}),
        ...(rowsData?.PARA_243 === "Y"
          ? {
              REALIZE_FLAG: rowsData.REALIZE_FLAG,
            }
          : {}),
      };

      let upd = utilFunction.transformDetailsData(newData, oldData);
      console.log(newData, "newdata");
      console.log(oldData, "olddata");
      console.log(upd, "..");

      isErrorFuncRef.current = {
        data: {
          ...newData,
          ...upd,
          ENTERED_COMP_CD: authState?.companyID,
          ENTERED_BRANCH_CD: authState?.user?.branchCode,
          TRAN_CD: rowsData?.TRAN_CD,
          PARA_812: rowsData?.PARA_812,
          PARA_243: rowsData?.PARA_243,
          SR_CD: rowsData?.SR_CD,
          A_ENTRY_MODE: data?.CANCEL,
        },
        displayData,
        endSubmit,
        setFieldError,
      };

      mutation.mutate({
        ...isErrorFuncRef.current?.data,
      });
    }
  };
  console.log(rowsData?.RETRIVE_ENTRY_MODE);

  return (
    <>
      <Dialog
        open={true}
        PaperProps={{
          style: {
            height: "auto",
            width: "100%",
          },
        }}
        maxWidth="xl"
      >
        {!isAcctDtlLoading && !isdraftDtlLoading && !isReasonDataLoading ? (
          <>
            <FormWrapper
              key={"modeMasterForm" + formMode}
              metaData={
                extractMetaData(
                  ddTransactionFormMetaData,
                  formMode
                ) as MetaDataType
              }
              displayMode={formMode}
              onSubmitHandler={onSubmitHandler}
              formState={{
                MessageBox: MessageBox,
                Mode: formMode,
                docCd: "RPT/014",
              }}
              initialValues={{
                SCREENFLAG: screenFlag,
                CCTFLAG: draftDtlData?.[0]?.C_C_T,
                REALIZE_AMT: draftDtlData?.[0]?.AMOUNT,
                REALIZE_DATE_DISP: authState?.workingDate,
                STOP_DATE: authState?.workingDate,
                TOKEN_NO: draftDtlData[0]?.CHEQUE_NO,
                TRF_COMP_CD_DISP: authState?.companyID,
                CHEQUE_NO_DISP: acctDtlData?.[0]?.CHEQUE_NO,
                ...((acctDtlData?.length ? acctDtlData[0] : {}) || {}),
                ...((draftDtlData?.length ? draftDtlData[0] : {}) || {}),
                CANCEL_REASON: [...reasonData],
              }}
              formStyle={{
                background: "white",
              }}
            >
              {({ isSubmitting, handleSubmit }) => (
                <>
                  {gridData?.length !== 1 ? (
                    <>
                      <GradientButton
                        disabled={rowsData === undefined}
                        onClick={() => {
                          if (currentIndex && currentIndex !== gridData) {
                          }
                          handlePrev();
                        }}
                      >
                        {t("Previous")}
                      </GradientButton>

                      <GradientButton
                        disabled={rowsData?.INDEX === undefined}
                        onClick={() => {
                          if (currentIndex && currentIndex !== gridData)
                            console.log("next cliked and data", rowsData?.id);

                          handleNext();
                        }}
                      >
                        {t("MoveForward")}
                      </GradientButton>

                      {screenFlag === "CANCELCONFRM" ||
                      screenFlag === "REALIZECONF" ? (
                        <>
                          <GradientButton
                            onClick={async () => {
                              // if (
                              //   authState?.user?.id ===
                              //   draftDtlData[0]?.REALIZE_BY
                              // ) {
                              //   await MessageBox({
                              //     messageTitle: t("ValidationFailed"),
                              //     message: t("ConfirmRestrictMsg"),
                              //     buttonNames: ["Ok"],
                              //   });
                              // }
                              if (
                                trans_type === "TC" &&
                                rowsData?.PARA_812 === "N" &&
                                rowsData?.RETRIVE_ENTRY_MODE === "D"
                              ) {
                                if (
                                  draftDtlData[0]?.ENTERED_BY ===
                                  draftDtlData[0]?.REVALID_BY
                                ) {
                                  await MessageBox({
                                    messageTitle: t("ValidationFailed"),
                                    message: t("ConfirmRestrictMsg"),
                                    buttonNames: ["Ok"],
                                  });
                                } else {
                                  if (
                                    draftDtlData[0]?.ENTERED_BY ===
                                    draftDtlData[0]?.REALIZE_BY
                                  ) {
                                    await MessageBox({
                                      messageTitle: t("ValidationFailed"),
                                      message: t("ConfirmRestrictMsg"),
                                      buttonNames: ["Ok"],
                                    });
                                  }
                                }
                              } else if (authState?.role === "1") {
                                const buttonName = await MessageBox({
                                  messageTitle: t("ValidationFailed"),
                                  message: t("authoeizationFailed"),
                                  buttonNames: ["Yes", "No"],
                                  loadingBtnName: ["Yes"],
                                });
                              } else if (rowsData?.REALIZE_FLAG === "Y") {
                                const buttonName = await MessageBox({
                                  messageTitle: t("ValidationFailed"),
                                  message: t("payslipAlreadyConfirmed"),
                                  buttonNames: ["Ok"],
                                });
                              } else {
                                const buttonName = await MessageBox({
                                  messageTitle: t("Confirmation"),
                                  message: `${t(
                                    "payslipRealizeconfirmRestrictNSG"
                                  )}PAYSLIP No. ${rowsData?.PAYSLIP_NO}`,
                                  buttonNames: ["Yes", "No"],
                                  loadingBtnName: ["Yes"],
                                });
                                if (buttonName === "Yes") {
                                  confirmMutation.mutate({
                                    _isConfirmed: true,
                                    TRAN_TYPE: trans_type,
                                    ENTERED_COMP_CD: rowsData?.ENTERED_COMP_CD,
                                    PARA_243: rowsData?.PARA_243,
                                    ENETERED_COMP_CD:
                                      rowsData?.ENETERED_COMP_CD,
                                    ENTERED_BRANCH_CD:
                                      rowsData?.ENTERED_BRANCH_CD,
                                    TRAN_CD: rowsData?.TRAN_CD,
                                    SR_CD: rowsData?.SR_CD,
                                  });
                                }
                              }
                            }}
                          >
                            {t("Confirm")}
                          </GradientButton>
                          <GradientButton
                            onClick={() => {
                              SetDeleteRemark(true);
                            }}
                          >
                            {t("Reject")}
                          </GradientButton>
                        </>
                      ) : (
                        <GradientButton
                          disabled={isSubmitting}
                          endIcon={
                            mutation?.isLoading ? (
                              <CircularProgress size={20} />
                            ) : null
                          }
                          onClick={() => {
                            let event: any = { preventDefault: () => {} };
                            handleSubmit(event, "SAVE");
                          }}
                        >
                          {t("save")}
                        </GradientButton>
                      )}
                    </>
                  ) : (
                    ""
                  )}

                  <GradientButton onClick={() => onClose()} color={"primary"}>
                    Close
                  </GradientButton>
                </>
              )}
            </FormWrapper>
          </>
        ) : (
          <Paper sx={{ display: "flex", p: 2, justifyContent: "center" }}>
            <LoadingTextAnimation />
          </Paper>
        )}
      </Dialog>
      {isDeleteRemark ? (
        <RemarksAPIWrapper
          TitleText={
            "Enter Removal Remarks For PAYSLP REALIZE CONFIRMATION RPT/18"
          }
          onActionNo={() => {
            SetDeleteRemark(false);
          }}
          onActionYes={async (val, rows) => {
            const buttonName = await MessageBox({
              messageTitle: t("Confirmation"),
              message: t("DoYouWantDeleteRow"),
              buttonNames: ["Yes", "No"],
              defFocusBtnName: "Yes",
              loadingBtnName: ["Yes"],
            });
            if (buttonName === "Yes") {
              rejectMutaion.mutate({
                _isConfirmed: false,
                COMP_CD: authState?.companyID,
                ENTERED_BRANCH_CD: rowsData?.ENTERED_BRANCH_CD,
                TRAN_CD: rowsData?.TRAN_CD,
                SR_CD: rowsData?.SR_CD,
                PAYSLIP_NO: rowsData?.PAYSLIP_NO,
                TRAN_TYPE: "RC",
                A_ENTRY_MODE: "P",
                REALIZE_DATE: draftDtlData[0]?.REALIZE_DATE,
                REVALID_DT: rowsData?.REVALID_DT,
                TRAN_DT: authState?.workingDate,
                REALIZE_FLAG: rowsData?.REALIZE_FLAG,
                PENDING_FLAG: rowsData?.PENDING_FLAG,
                STOP_REMARKS: "",
                PARA_243: rowsData?.PARA_243,
                PARA_812: rowsData?.PARA_812,
                A_REJECT_FLAG: "Y",
                BRANCH_CD: acctDtlData[0]?.BRANCH_CD,
                ACCT_TYPE: acctDtlData[0]?.ACCT_TYPE,
                ACCT_CD: acctDtlData[0]?.ACCT_CD,
                AMOUNT: rowsData?.TOTAL_AMT,
                USER_DEF_REMARKS: val,
                SCREEN_REF: "RPT/18",
              });
            }
          }}
          isEntertoSubmit={true}
          AcceptbuttonLabelText="Ok"
          CanceltbuttonLabelText="Cancel"
          open={isDeleteRemark}
          defaultValue={
            "WRONG ENTRY FROM PAYSLIP REALIZE CONFIRMATION (RPT/18)"
          }
          rows={rowsData}
        />
      ) : (
        ""
      )}
    </>
  );
};

export const EntryForm = ({
  onClose,
  gridData,
  currentIndexRef,
  handleNext,
  handlePrev,
  headerLabel,
  screenFlag,
  trans_type,
}) => {
  const { state: rows } = useLocation();
  currentIndexRef.current = rows?.index;

  return (
    <>
      <ClearCacheProvider>
        <EntryFormView
          onClose={onClose}
          gridData={gridData}
          rowsData={rows?.gridData}
          currentIndex={rows.index}
          handleNext={handleNext}
          handlePrev={handlePrev}
          headerLabel={headerLabel}
          screenFlag={screenFlag}
          trans_type={trans_type}
        />
      </ClearCacheProvider>
    </>
  );
};
