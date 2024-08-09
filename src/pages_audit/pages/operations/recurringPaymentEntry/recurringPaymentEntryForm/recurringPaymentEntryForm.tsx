import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { forwardRef, useContext, useEffect, useState } from "react";
import { usePopupContext } from "components/custom/popupContext";
import { extractMetaData, utilFunction } from "components/utils";
import { InitialValuesType } from "packages/form";
import { RecurringContext } from "../context/recurringPaymentContext";
import { useLocation } from "react-router-dom";
import { RecurringPaymentEntryFormMetaData } from "./metaData/recurringPmtEntryMetaData";
import { AuthContext } from "pages_audit/auth";
import { Dialog } from "@mui/material";
import { LienDetailsGrid } from "../lienDetailsGrid";
import { useMutation } from "react-query";
import * as API from "../api";
import { queryClient } from "cache";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { enqueueSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import ClosingAdvice from "../closingAdvice";
import { GradientButton } from "components/styledComponent/button";

export const RecurringPaymentEntryForm = forwardRef<any, any>(
  (
    {
      defaultView,
      recurEntrySubmitHandler,
      closeDialog,
      entryScreenFlagData,
      screenFlag,
    },
    ref
  ) => {
    const {
      rpState,
      getAcctDatafromValApi,
      updateClosingAdviceData,
      handleDisableButton,
      updateDataForJasperParam,
    } = useContext(RecurringContext);
    const { MessageBox, CloseMessageBox } = usePopupContext();
    const [formMode, setFormMode] = useState(defaultView);
    const { state: rows }: any = useLocation();
    const { authState } = useContext(AuthContext);
    const [openLienGrid, setOpenLienGrid] = useState(false);
    const [lienGridData, getLienGridData] = useState<any>([]);
    const { t } = useTranslation();
    let currentPath = useLocation().pathname;
    const [openClosingAdvice, setOpenClosingAdvice] = useState(false);

    //Mutation for Closing Advice
    const closingAdviceDtlMutation = useMutation(
      "getRecurAdviceDtl",
      API.getRecurAdviceDtl,
      {
        onError: (error: any) => {
          let errorMsg = "Unknownerroroccured";
          if (typeof error === "object") {
            errorMsg = error?.error_msg ?? errorMsg;
          }
          enqueueSnackbar(errorMsg, {
            variant: "error",
          });
          CloseMessageBox();
        },
        onSuccess: (data) => {
          updateClosingAdviceData(data);
          CloseMessageBox();
        },
      }
    );

    //Close Lien component
    const handleCloseLienDialog = () => {
      setOpenLienGrid(false);
    };

    //Mutation for Lien details
    const getLienDetailMutation: any = useMutation(
      "lienGridDetail",
      API.lienGridDetail,
      {
        onSuccess: (data) => {
          getLienGridData(data);
          CloseMessageBox();
        },
        onError: (error: any) => {
          let errorMsg = t("Unknownerroroccured");
          if (typeof error === "object") {
            errorMsg = error?.error_msg ?? errorMsg;
          }
          enqueueSnackbar(errorMsg, {
            variant: "error",
          });
          CloseMessageBox();
        },
      }
    );

    useEffect(() => {
      return () => {
        queryClient.removeQueries(["getRecurAdviceDtl"]);
        queryClient.removeQueries([
          "lienGridDetail",
          authState?.user?.branchCode,
        ]);
      };
    }, []);

    //Close Advice details
    const handleCloseAdviceDetails = () => {
      setOpenClosingAdvice(false);
      updateClosingAdviceData([]);
    };

    //Form Header title
    useEffect(() => {
      if (formMode === "view" && rows?.length > 0) {
        let label = utilFunction.getDynamicLabel(
          currentPath,
          authState?.menulistdata,
          false
        );
        const label2 = `${label ?? ""}\u00A0\u00A0 ${t("EnteredBy")}: ${
          rows?.[0]?.data?.ENTERED_BY ?? ""
        }\u00A0\u00A0 ${t("Status")}: ${
          rows?.[0]?.data?.CONF_STATUS ?? ""
        }\u00A0\u00A0`;
        RecurringPaymentEntryFormMetaData.form.label = label2;
      } else {
        RecurringPaymentEntryFormMetaData.form.label = "";
      }
    }, []);

    return (
      <>
        {formMode === "new" ? (
          !entryScreenFlagData ? (
            <LoaderPaperComponent />
          ) : (
            <FormWrapper
              key={"recurringPaymentEntryForm" + formMode}
              metaData={
                extractMetaData(
                  RecurringPaymentEntryFormMetaData,
                  formMode
                ) as MetaDataType
              }
              initialValues={{
                ...(rpState?.recurPmtEntryData as InitialValuesType),
              }}
              onSubmitHandler={recurEntrySubmitHandler}
              ref={ref}
              formState={{
                MessageBox: MessageBox,
                isBackButton: rpState?.isBackButton,
                entryScreenFlagDataForm: entryScreenFlagData?.[0],
                handleDisableButton: handleDisableButton,
                screenFlag: screenFlag,
              }}
              displayMode={formMode}
              setDataOnFieldChange={(action, payload) => {
                if (action === "SHOW_LIEN") {
                  setOpenLienGrid(true);
                  getLienDetailMutation.mutate(payload);
                }
                if (action === "GET_ACCT_DATA") {
                  getAcctDatafromValApi(payload);
                }
              }}
              onFormButtonClickHandel={async (flag, dependentFields) => {
                if (flag === "CLOSING_ADVICE") {
                  if (
                    authState?.companyID &&
                    dependentFields?.BRANCH_CD?.value &&
                    dependentFields?.ACCT_TYPE?.value &&
                    dependentFields?.ACCT_CD?.value
                  ) {
                    let reqParam = {
                      COMP_CD: authState?.companyID ?? "",
                      BRANCH_CD: dependentFields?.BRANCH_CD?.value ?? "",
                      ACCT_TYPE: dependentFields?.ACCT_TYPE?.value ?? "",
                      ACCT_CD: dependentFields?.ACCT_CD?.value ?? "",
                      INT_RATE: dependentFields?.INT_RATE?.value ?? "",
                      INT_AMOUNT: dependentFields?.INT_AMOUNT?.value ?? "",
                      REC_PENALTY_AMT:
                        dependentFields?.REC_PENALTY_AMT?.value ?? "",
                      PENAL_RATE: dependentFields?.PENAL_RATE?.value ?? "",
                      PAYMENT_TYPE: dependentFields?.PREMATURE_VAL?.value ?? "",
                      TRAN_CD: "",
                    };
                    setOpenClosingAdvice(true);
                    updateDataForJasperParam(reqParam);
                    closingAdviceDtlMutation?.mutate(reqParam);
                  }
                }
              }}
              formStyle={{
                background: "white",
              }}
            />
          )
        ) : (
          <FormWrapper
            key={"recurringPaymentEntryForm" + formMode}
            metaData={
              extractMetaData(
                RecurringPaymentEntryFormMetaData,
                formMode
              ) as MetaDataType
            }
            initialValues={{
              ...(rows?.[0]?.data as InitialValuesType),
              FORM_60:
                rows?.[0]?.data?.FORM_60 === "Y"
                  ? "FORM 60 Submitted"
                  : rows?.[0]?.data?.FORM_60 === "F"
                  ? "FORM 61 Submitted"
                  : "",
            }}
            formState={{
              screenFlag: screenFlag,
            }}
            displayMode={formMode}
            hideHeader={screenFlag === "recurringPmtConf" ? true : false}
            onFormButtonClickHandel={async (flag, dependentFields) => {
              if (flag === "CLOSING_ADVICE") {
                if (
                  authState?.companyID &&
                  rows?.[0]?.data?.BRANCH_CD &&
                  rows?.[0]?.data?.ACCT_TYPE &&
                  rows?.[0]?.data?.ACCT_CD
                ) {
                  let reqParam = {
                    COMP_CD: authState?.companyID ?? "",
                    BRANCH_CD: rows?.[0]?.data?.BRANCH_CD ?? "",
                    ACCT_TYPE: rows?.[0]?.data?.ACCT_TYPE ?? "",
                    ACCT_CD: rows?.[0]?.data?.ACCT_CD ?? "",
                    INT_RATE: rows?.[0]?.data?.INT_RATE ?? "",
                    INT_AMOUNT: rows?.[0]?.data?.INT_AMOUNT ?? "",
                    REC_PENALTY_AMT: rows?.[0]?.data?.REC_PENALTY_AMT ?? "",
                    PENAL_RATE: rows?.[0]?.data?.PENAL_RATE ?? "",
                    PAYMENT_TYPE: rows?.[0]?.data?.PREMATURE ?? "",
                    TRAN_CD: rows?.[0]?.data?.TRAN_CD,
                  };
                  setOpenClosingAdvice(true);
                  updateDataForJasperParam(reqParam);
                  closingAdviceDtlMutation?.mutate(reqParam);
                }
              }
            }}
            formStyle={{
              background: "white",
            }}
          >
            <GradientButton onClick={closeDialog}>Close</GradientButton>
          </FormWrapper>
        )}

        {/*Open Lien component */}
        {openLienGrid && (
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
            {getLienDetailMutation?.isLoading ? (
              <LoaderPaperComponent />
            ) : (
              <LienDetailsGrid
                lienGridData={lienGridData}
                handleCloseLienDialog={handleCloseLienDialog}
                loading={getLienDetailMutation.isLoading}
                fetching={getLienDetailMutation.isFetching}
                error={getLienDetailMutation.isError}
              />
            )}
          </Dialog>
        )}

        {/*Open Closing Advice component */}
        {openClosingAdvice ? (
          <Dialog
            open={true}
            fullWidth={true}
            PaperProps={{
              style: {
                width: "100%",
                overflow: "auto",
                padding: "10px 0",
              },
            }}
            maxWidth="xl"
          >
            {closingAdviceDtlMutation?.isLoading ? (
              <LoaderPaperComponent />
            ) : (
              <ClosingAdvice
                handleCloseAdviceDetails={handleCloseAdviceDetails}
              />
            )}
          </Dialog>
        ) : null}
      </>
    );
  }
);
