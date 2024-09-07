import { Alert, AppBar, Dialog } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { GradientButton } from "components/styledComponent/button";
import { InitialValuesType, SubmitFnType } from "packages/form";
import { useLocation } from "react-router-dom";
import { LoanRegenerateFormMetaData } from "./metadata";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { AuthContext } from "pages_audit/auth";
import * as API from "../api";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { queryClient } from "cache";
import { utilFunction } from "components/utils";
import { enqueueSnackbar } from "notistack";
import { format } from "date-fns";
import { usePopupContext } from "components/custom/popupContext";

export const LoanRegenerateForm = ({ isDataChangedRef, closeDialog }) => {
  const isErrorFuncRef = useRef<any>(null);
  const { state: rows }: any = useLocation();
  const { t } = useTranslation();
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();

  const {
    data: detailsData,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery<any, any>(
    ["getLoanRegenerateDetails", authState?.user?.branchCode],
    () =>
      API.getLoanRegenerateDetails({
        BRANCH_CD: authState?.user?.branchCode ?? "",
        COMP_CD: authState?.companyID ?? "",
        ACCT_TYPE: rows?.[0]?.ACCT_TYPE ?? "",
        ACCT_CD: rows?.[0]?.ACCT_CD ?? "",
      })
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries([
        "getLoanRegenerateDetails",
        authState?.user?.branchCode,
      ]);
    };
  }, []);

  const regenerateValidation = useMutation(API.validateRegenerateData, {
    onError: (error: any) => {
      let errorMsg = t("Unknownerroroccured");
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
      // CloseMessageBox();
    },
    onSuccess: (data, variables) => {},
  });
  const regenerateConfirmValidation = useMutation(
    API.regenerateDataConfirmation,
    {
      onError: (error: any) => {
        let errorMsg = t("Unknownerroroccured");
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
        // CloseMessageBox();
      },
      onSuccess: (data) => {
        enqueueSnackbar("Success", {
          variant: "success",
        });
        isDataChangedRef.current = true;
        // CloseMessageBox();
        closeDialog();
      },
    }
  );

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    //@ts-ignore
    // endSubmit(true);

    let newData = {
      ...data,
    };
    let oldData = {
      ...detailsData?.[0],
    };
    let upd = utilFunction.transformDetailsData(newData, oldData);

    if (Boolean(oldData["INST_DUE_DT"])) {
      oldData["INST_DUE_DT"] = format(
        new Date(oldData["INST_DUE_DT"]),
        "dd/MMM/yyyy"
      );
    }
    if (Boolean(oldData["RATE_WEF"])) {
      oldData["RATE_WEF"] = format(
        new Date(oldData["RATE_WEF"]),
        "dd/MMM/yyyy"
      );
    }
    if (Boolean(newData["RATE_WEF"])) {
      newData["RATE_WEF"] = format(
        new Date(newData["RATE_WEF"]),
        "dd/MMM/yyyy"
      );
    }
    if (Boolean(newData["INST_DUE_DT"])) {
      newData["INST_DUE_DT"] = format(
        new Date(newData["INST_DUE_DT"]),
        "dd/MMM/yyyy"
      );
    }
    const validateData = {
      COMP_CD: authState?.companyID ?? "",
      BRANCH_CD: authState?.user?.branchCode ?? "",
      ACCT_TYPE: oldData?.ACCT_TYPE ?? "",
      ACCT_CD: oldData?.ACCT_CD ?? "",
      LIMIT_AMOUNT: newData?.LIMIT_AMOUNT ?? "",
      INT_RATE: newData?.INT_RATE ?? "",
      INST_RS: newData?.INST_RS ?? "",
      INST_NO: newData?.INST_NO ?? "",
      INST_DUE_DT: newData?.INST_DUE_DT ?? "",
      RATE_WEF: newData?.RATE_WEF ?? "",
      ORG_LIMIT_AMOUNT: oldData?.LIMIT_AMOUNT ?? "",
      ORG_INT_RATE: oldData?.INT_RATE ?? "",
      ORG_INST_RS: oldData?.INST_RS ?? "",
      ORG_INST_NO: oldData?.INST_NO ?? "",
      ORG_INST_DUE_DT: oldData?.INST_DUE_DT ?? "",
      ORG_RATE_WEF: oldData?.RATE_WEF ?? "",
      SCREEN_REF: "MST/006",
    };

    regenerateValidation.mutate(validateData, {
      onSuccess: async (data, variables) => {
        for (let i = 0; i < data?.length; i++) {
          if (data[i]?.O_STATUS === "999") {
            const btnName = await MessageBox({
              messageTitle: "ValidationFailed",
              message: data[i]?.O_MESSAGE,
              buttonNames: ["Ok"],
            });
            if (btnName === "Ok") {
              endSubmit(true);
            }
          } else if (data[i]?.O_STATUS === "9") {
            const btnName = await MessageBox({
              messageTitle: "Alert",
              message: data?.[0]?.O_MESSAGE,
            });
          } else if (data[i]?.O_STATUS === "99") {
            const btnName = await MessageBox({
              messageTitle: "Confirmation",
              message: data?.[0]?.O_MESSAGE,
              buttonNames: ["Yes", "No"],
            });
            if (btnName === "No") {
              endSubmit(true);
              break;
            } else if (
              // Check this functionality in form while click on yes button
              btnName === "Yes" &&
              data?.[0]?.O_COLUMN_NM === "REGERATE"
            ) {
              const confirmData = {
                COMP_CD: authState?.companyID ?? "",
                BRANCH_CD: authState?.user?.branchCode ?? "",
                ACCT_TYPE: oldData?.ACCT_TYPE ?? "",
                ACCT_CD: oldData?.ACCT_CD ?? "",
                INT_RATE: newData?.INT_RATE ?? "",
                INST_RS: newData?.INST_RS ?? "",
                INST_NO: newData?.INST_NO ?? "",
                LIMIT_AMOUNT: newData?.LIMIT_AMOUNT ?? "",
                DISBURSEMENT_DT: oldData?.DISBURSEMENT_DT ?? "",
                INSTALLMENT_TYPE: newData?.INSTALLMENT_TYPE ?? "",
                INS_START_DT: newData?.INS_START_DT ?? "",
                TYPE_CD: newData?.TYPE_CD ?? "",
                INST_DUE_DT: newData?.INST_DUE_DT ?? "",
              };
              regenerateConfirmValidation.mutate(confirmData);
            }
          } else if (data[i]?.O_STATUS === "0") {
            // Remain to add
            const confirmData = {
              COMP_CD: authState?.companyID ?? "",
              BRANCH_CD: authState?.user?.branchCode ?? "",
              ACCT_TYPE: oldData?.ACCT_TYPE ?? "",
              ACCT_CD: oldData?.ACCT_CD ?? "",
              INT_RATE: newData?.INT_RATE ?? "",
              INST_RS: newData?.INST_RS ?? "",
              INST_NO: newData?.INST_NO ?? "",
              LIMIT_AMOUNT: newData?.LIMIT_AMOUNT ?? "",
              DISBURSEMENT_DT: oldData?.DISBURSEMENT_DT ?? "",
              INSTALLMENT_TYPE: newData?.INSTALLMENT_TYPE ?? "",
              INS_START_DT: newData?.INS_START_DT ?? "",
              TYPE_CD: newData?.TYPE_CD ?? "",
              INST_DUE_DT: newData?.INST_DUE_DT ?? "",
            };
            regenerateConfirmValidation.mutate(confirmData);
          }
        }
      },
    });
  };

  const dtlData = detailsData?.[0];
  return (
    <>
      {isLoading || isFetching ? (
        <div style={{ width: "600px", height: "100px" }}>
          <LoaderPaperComponent />
        </div>
      ) : (
        <>
          {isError && (
            <AppBar position="relative" color="secondary">
              <Alert
                severity={error?.severity ?? "error"}
                //@ts-ignore
                errorMsg={error?.error_msg ?? "Something went to wrong.."}
                errorDetail={error?.error_detail ?? ""}
                color="error"
              />
            </AppBar>
          )}
          <FormWrapper
            key={"loanRegenerateForm"}
            metaData={LoanRegenerateFormMetaData as MetaDataType}
            onSubmitHandler={onSubmitHandler}
            initialValues={detailsData?.[0] as InitialValuesType}
            formStyle={{
              background: "white",
            }}
            formState={{
              rows: rows,
              dtlData: dtlData,
              flag: false,
            }}
          >
            {({ isSubmitting, handleSubmit }) => (
              <>
                <GradientButton
                  onClick={(event) => {
                    handleSubmit(event, "Save");
                  }}
                  disabled={isSubmitting}
                  color={"primary"}
                >
                  {t("Regenerate")}
                </GradientButton>
                <GradientButton onClick={closeDialog} color={"primary"}>
                  {t("Close")}
                </GradientButton>
              </>
            )}
          </FormWrapper>
        </>
      )}
    </>
  );
};

export const LoanRegenerateFormWrapper = ({
  isDataChangedRef,
  closeDialog,
}) => {
  return (
    <Dialog
      open={true}
      PaperProps={{
        style: {
          width: "auto",
          overflow: "auto",
        },
      }}
      maxWidth="lg"
    >
      <LoanRegenerateForm
        isDataChangedRef={isDataChangedRef}
        closeDialog={closeDialog}
      />
    </Dialog>
  );
};
