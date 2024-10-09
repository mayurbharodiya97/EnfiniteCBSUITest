import {
  ClearCacheProvider,
  extractGridMetaData,
  extractMetaData,
  FormWrapper,
  GradientButton,
  LoadingTextAnimation,
  MetaDataType,
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
}) => {
  const [formMode, setFormMode] = useState("edit");
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const isErrorFuncRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);

  const requestData = {
    COMP_CD: authState?.companyID,
    BRANCH_CD: authState.user.branchCode,
    TRAN_CD: rowsData?.TRAN_CD,
    SR_CD: rowsData?.SR_CD,
  };
  const { data: acctDtlData, isLoading: isAcctDtlLoading } = useQuery(
    ["headerData", requestData],
    () => headerDataRetrive(requestData)
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

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData: any,
    endSubmit,
    setFieldError
  ) => {
    endSubmit(true);
    // console.log(data);

    if (screenFlag === "REALIZE") {
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
      console.log(upd, "UPD");

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
    }
  };
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
        {!isAcctDtlLoading && !isdraftDtlLoading ? (
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
                          <GradientButton onClick={() => {}}>
                            {t("Confirmed")}
                          </GradientButton>
                          <GradientButton onClick={() => {}}>
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
        />
      </ClearCacheProvider>
    </>
  );
};
