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
import { commonDataRetrive, headerDataRetrive } from "../api";
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
      enqueueSnackbar(t("RecordInsertedMsg"), {
        variant: "success",
      });
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
    console.log(data);

    if (screenFlag === "REALIZE") {
      let newData = {
        COLLECT_COMISSION: data?.COLLECT_COMISSION,
        REALIZE_AMT: data?.REALIZE_AMT,
        C_C_T_SP_C: data?.C_C_T_SP_C,
        CHEQUE_NO: data?.CHEQUE_NO_DISP,
        REALIZE_BY: data?.REALIZE_BY,
        REALIZE_DATE: data?.REALIZE_DATE,
        PENDING_FLAG: rowsData?.PENDING_FLAG_DISP,
      };
      //if data?.C_C_T_SP_C ==="T" so merge oldTransferAccountData in olddata and newtransferaccdata in new data
      const oldTransferAccountData = {
        TRF_COMP_CD: draftDtlData[0]?.TRF_COMP_CD,
        TRF_BRANCH_CD: draftDtlData[0]?.TRF_BRANCH_CD,
        TRF_ACCT_TYPE: draftDtlData[0]?.TRF_ACCT_TYPE,
        TRF_ACCT_CD: draftDtlData[0]?.TRF_ACCT_CD,
        TRF_NAME: draftDtlData[0]?.TRF_NAME,
      };
      const newTransferAccountData = {
        TRF_COMP_CD: data?.TRF_COMP_CD,
        TRF_BRANCH_CD: data?.TRF_BRANCH_CD,
        TRF_ACCT_TYPE: data?.TRF_ACCT_TYPE,
        TRF_ACCT_CD: data?.TRF_ACCT_CD,
        TRF_NAME: data?.TRF_NAME,
      };

      const oldData = {
        COLLECT_COMISSION: draftDtlData[0]?.COLLECT_COMISSION,
        REALIZE_AMT: draftDtlData[0]?.REALIZE_AMT,
        C_C_T_SP_C: draftDtlData[0]?.C_C_T_SP_C,
        CHEQUE_NO: acctDtlData[0]?.CHEQUE_NO,
        REALIZE_BY: draftDtlData[0]?.REALIZE_BY,
        REALIZE_DATE: draftDtlData[0]?.REALIZE_DATE,
        PENDING_FLAG: rowsData?.PENDING_FLAG_DISP,
      };
      console.log(newData, "newData");
      console.log(oldData, "oldData");

      let upd = utilFunction.transformDetailsData(newData, oldData);

      isErrorFuncRef.current = {
        data: {
          ...newData,
          ...upd,
          ENTERED_COMP_CD: authState?.companyID,
          ENTERED_BRANCH_CD: authState?.user?.branchCode,
          TRAN_CD: rowsData?.TRAN_CD,
          SR_CD: rowsData?.SR_CD,
          // REALIZE_DATE: data?.REALIZE_DATE,
          // REALIZE_AMT: data?.REALIZE_AMT,
          // C_C_T_SP_C: data?.C_C_T_SP_C,
          // COLLECT_COMISSION: data?.COLLECT_COMISSION,
          // COL_SER_CHARGE: data?.COL_SER_CHARGE,
          // TRF_COMP_CD: data?.TRF_COMP_CD,
          // TRF_BRANCH_CD: data?.TRF_BRANCH_CD,
          // TRF_ACCT_TYPE: data?.TRF_ACCT_TYPE,
          // TRF_ACCT_CD: data?.TRF_ACCT_CD,
          // TRF_NAME: data?.TRF_NAME,
          // TOKEN_NO: data?.TOKEN_NO,
        },
        displayData,
        endSubmit,
        setFieldError,
      };

      mutation.mutate({
        ...isErrorFuncRef.current?.data,
      });
      console.log(isErrorFuncRef.current?.data, "PAYLOAD");
    } else if (screenFlag === "STOPPAYMENT") {
      isErrorFuncRef.current = {
        data: {
          STOP_DATE: data?.STOP_DATE,
          REALEASE_DATE: data?.REALEASE_DATE,
          REASON_STOPPAYMENT: data?.REASON_STOPPAYMENT,
          REASON_CD: data?.REASON_CD,
        },
        displayData,
        endSubmit,
        setFieldError,
      };
      // mutation.mutate({
      //   ...isErrorFuncRef.current?.data,
      // });
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
                REALIZED_DATE: authState?.workingDate,
                STOP_DATE: authState?.workingDate,
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
