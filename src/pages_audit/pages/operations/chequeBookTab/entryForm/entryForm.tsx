import React, { useContext, useEffect } from "react";
import { ChequeBookEntryMetaData } from "./chequebookEntryMetadata";
import { AppBar, Button, Dialog, LinearProgress } from "@mui/material";
import { t } from "i18next";
import { AuthContext } from "pages_audit/auth";
import { chequeBookCfm, validateCheqbkCfm, validateInsert } from "../api";
import { useMutation } from "react-query";
import { Route, Routes, useLocation } from "react-router-dom";
import { MultipleChequebook } from "../multipleChequebook/multipleChequebook";
import { IssuedChequebook } from "../issuedChequebook/issuedChequebook";
import { enqueueSnackbar } from "notistack";
import {
  Alert,
  FormWrapper,
  MetaDataType,
  queryClient,
  SubmitFnType,
  usePopupContext,
  utilFunction,
} from "@acuteinfo/common-base";
import { LinearProgressBarSpacer } from "components/common/custom/linerProgressBarSpacer";

export const EntryForm = (props) => {
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const {
    reqDataRef,
    crudChequeData,
    navigate,
    myMasterRef,
    setIsData,
    confirmData,
    closeDialog,
    result,
  } = props;

  // API calling function for validate data before Insert
  const validateInsertData: any = useMutation(
    "validateInsert",
    validateInsert,
    {
      onSuccess: (data) => {
        async function validData() {
          let insertReq = reqDataRef.current?.insertReq;
          let apiReq = {
            _isNewRow: true,
            _isDeleteRow: false,
            COMP_CD: authState?.companyID,
            BRANCH_CD: insertReq?.BRANCH_CD,
            ACCT_TYPE: insertReq?.ACCT_TYPE,
            ACCT_CD: insertReq?.ACCT_CD,
            CHEQUE_FROM: insertReq?.CHEQUE_FROM,
            CHEQUE_TOTAL: insertReq?.CHEQUE_TOTAL,
            CHARACTERISTICS: insertReq?.CHARACTERISTICS,
            PAYABLE_AT_PAR: insertReq?.PAYABLE_AT_PAR,
            REQUISITION_DT: insertReq?.REQUISITION_DT,
            REMARKS: insertReq?.REMARKS,
            SR_CD: insertReq?.SR_CD,
            NO_OF_CHQBK: insertReq?.NO_OF_CHQBK,
            AUTO_CHQBK_FLAG: insertReq?.AUTO_CHQBK_FLAG,
            SERVICE_TAX: insertReq?.SERVICE_TAX,
            AMOUNT: insertReq?.AMOUNT,
            ENTERED_BRANCH_CD: insertReq?.ENTERED_BRANCH_CD,
            REQUEST_CD: "",
          };
          // After validating data then inside the response multiple message with multiple statuses, so merge all the same status messages and conditionally display status-wise.
          if (Array.isArray(data) && data?.length > 0) {
            const btnName = async (buttonNames, msg, msgTitle, icon) => {
              return await MessageBox({
                messageTitle: msgTitle,
                message: msg,
                buttonNames: buttonNames,
                loadingBtnName: ["Yes"],
                icon: icon,
              });
            };
            let messages = { "999": [], "99": [], "9": [], "0": [] };
            let status = { "999": false, "99": false, "9": false, "0": false };

            data.forEach((item) => {
              if (messages[item.O_STATUS] !== undefined) {
                messages[item.O_STATUS].push(`⁕ ${item?.O_MESSAGE}`);
                status[item.O_STATUS] = true;
              }
            });
            let concatenatedMessages = {};
            for (let key in messages) {
              concatenatedMessages[key] = messages[key].join("\n");
            }
            if (status["999"]) {
              btnName(
                ["Ok"],
                concatenatedMessages["999"],
                "ValidationFailed",
                "ERROR"
              );
            } else if (status["99"]) {
              let buttonName = await btnName(
                ["Yes", "No"],
                concatenatedMessages["99"],
                "DoYouContinueWithRecord",
                "INFO"
              );

              if (buttonName === "Yes" && status["9"]) {
                btnName(
                  ["Ok"],
                  concatenatedMessages["9"],
                  "ValidationAlert",
                  "INFO"
                );
              } else if (
                buttonName === "Yes" &&
                data?.[0]?.RESTRICT_WINDOW === "N"
              ) {
                crudChequeData.mutate(apiReq);
              } else if (
                buttonName === "Yes" &&
                data?.[0]?.RESTRICT_WINDOW === "Y"
              ) {
                navigate("issuedChequebook/", {
                  state: {
                    ...apiReq,
                    CHEQUE_TO: insertReq?.CHEQUE_TO,
                    COMP_CD: authState?.companyID,
                  },
                });
                CloseMessageBox();
              } else if (buttonName === "Yes") {
                crudChequeData.mutate(apiReq);
              }
            } else if (status["9"]) {
              btnName(
                ["Ok"],
                concatenatedMessages["9"],
                "ValidationAlert",
                "INFO"
              );
            } else if (status["0"]) {
              let buttonName = await btnName(
                ["Yes", "No"],
                "AreYouSureToProceed",
                "ValidationSuccessfull",
                "INFO"
              );
              if (buttonName === "Yes") {
                crudChequeData.mutate(apiReq);
              }
            }
          }
        }
        validData();
      },
      onError() {
        setIsData((old) => ({ ...old, closeAlert: true }));
      },
    }
  );
  // API calling function for validate data before confirm or reject
  const chequeBkValidateCfm: any = useMutation(
    "validateCheqbkCfm",
    validateCheqbkCfm
  );

  // API calling function for data confirm od reject
  const chequeBkCfm: any = useMutation("chequeBookCfm", chequeBookCfm, {
    onError: () => {
      CloseMessageBox();
    },
    onSuccess: (data, variables) => {
      CloseMessageBox();
      closeDialog();

      const resultData = {
        screenFlag: "chequebookCFM",
        COMP_CD: authState?.companyID,
        BRANCH_CD: confirmData?.BRANCH_CD,
        FROM_DATE: result?.variables?.FROM_DATE ?? authState.workingDate,
        TO_DATE: result?.variables?.TO_DATE ?? authState.workingDate,
        FLAG: variables?.FLAG ?? "",
      };

      if (data?.[0]?.STATUS === "999") {
        MessageBox({
          messageTitle: "InvalidConfirmation",
          message: data?.message || data?.[0]?.MESSAGE,
          icon: "ERROR",
        });
      } else {
        result.mutate(resultData);
        enqueueSnackbar(
          t(
            variables?.IS_CONFIMED ? "DataConfirmMessage" : "DataRejectMessage"
          ),
          { variant: "success" }
        );
      }
    },
  });

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["chequeBookCfm"]);
    };
  }, []);

  const onSubmitHandler: SubmitFnType = (data: any, displayData, endSubmit) => {
    console.log("<<<dadadad", data);
    // @ts-ignore
    endSubmit(true);
    let reqPara = {
      ...data,
      COMP_CD: authState?.companyID,
      AUTO_CHQBK_FLAG: data?.PER_CHQ_ALLOW,
      NO_OF_CHQBK: data?.NO_OF_CHQBK ?? "1",
      CHEQUE_TOTAL: data?.CHEQUE_TOTAL ?? data?.CHEQUE_TOTALS,
      CHARACTERISTICS: data?.CHARACTERISTICS ?? "B",
      PAYABLE_AT_PAR: data?.PAYABLE_AT_PAR ?? "Y",
      SR_CD: data?.AUTO_CHQBK_FLAG === "N" ? "0" : data?.SR_CD,
    };
    reqDataRef.current.insertReq = reqPara;

    if (Number(reqPara.NO_OF_CHQBK) > 1 && reqPara?.CHEQUE_TO) {
      navigate("multiChequebook/", {
        state: reqPara,
      });
    } else {
      validateInsertData.mutate({
        COMP_CD: authState?.companyID,
        BRANCH_CD: reqPara?.BRANCH_CD,
        ACCT_TYPE: reqPara?.ACCT_TYPE,
        ACCT_CD: reqPara?.ACCT_CD,
        AMOUNT: reqPara?.AMOUNT,
        SERVICE_TAX: reqPara?.SERVICE_TAX,
        CHEQUE_FROM: reqPara?.CHEQUE_FROM,
        CHEQUE_TO: reqPara?.CHEQUE_TO,
        AUTO_CHQBK_FLAG: reqPara?.AUTO_CHQBK_FLAG,
        SR_CD: reqPara?.SR_CD,
        STATUS: reqPara?.STATUS,
        SCREEN_REF: "TRN/045",
      });
    }
  };

  console.log("<<<entry ", props);

  const handelChange = async (isConfirm) => {
    chequeBkValidateCfm.mutate(
      {
        AUTO_CHQBK_FLAG: confirmData?.AUTO_CHQBK_FLAG,
        AUTO_CHQBK_PRINT_FLAG: confirmData?.AUTO_CHQBK_PRINT_FLAG,
        FLAG: confirmData?.REQ_FLAG,
        SCREEN_REF: "TRN/371",
      },
      {
        onSuccess: async (data) => {
          console.log("<<<dara", data);
          const messagebox = async (msgTitle, msg, buttonNames, icon) => {
            let buttonName = await MessageBox({
              messageTitle: msgTitle,
              message: msg,
              buttonNames: buttonNames,
              icon: icon,
            });
            return buttonName;
          };

          if (data?.length) {
            for (let i = 0; i < data?.length; i++) {
              let btnName = await messagebox(
                data[i]?.O_STATUS === "999"
                  ? "validation fail"
                  : data[i]?.O_STATUS === "0"
                  ? "confirmation"
                  : "ALert message",
                data[i]?.O_STATUS === "0"
                  ? "Are you sure to proceed"
                  : data[i]?.O_MESSAGE,
                data[i]?.O_STATUS === "99" || data[i]?.O_STATUS === "0"
                  ? ["Yes", "No"]
                  : ["Ok"],
                data[i]?.O_STATUS === "999" ? "ERROR" : "WARNING"
              );
              if (btnName === "No") {
                break;
              } else if (btnName === "Ok" && data[i]?.O_STATUS === "0") {
                let apiReq = {
                  IS_CONFIMED: isConfirm === "C" ? true : false,
                  FLAG: confirmData?.REQ_FLAG,
                  COMP_CD: authState?.companyID,
                  BRANCH_CD: confirmData?.BRANCH_CD,
                  TRAN_CD: confirmData?.TRAN_CD,
                  AUTO_CHQBK_PRINT_FLAG: confirmData?.AUTO_CHQBK_PRINT_FLAG,
                  LAST_ENTERED_BY: confirmData?.LAST_ENTERED_BY,
                };
                let res = await MessageBox({
                  messageTitle: t("confirmation"),
                  message:
                    isConfirm === "C"
                      ? t("AreYouSureToConfirm")
                      : t("AreYouSureToReject"),
                  buttonNames: ["No", "Yes"],
                  defFocusBtnName: "Yes",
                  loadingBtnName: ["Yes"],
                  icon: "WARNING",
                });
                if (res === "Yes") {
                  chequeBkCfm.mutate(apiReq);
                }
              }
            }
          }
        },
      }
    );
  };

  ChequeBookEntryMetaData.form.label = utilFunction.getDynamicLabel(
    useLocation().pathname,
    authState?.menulistdata,
    true
  );
  return (
    <>
      {validateInsertData?.isLoading || chequeBkValidateCfm.isLoading ? (
        <LinearProgress color="inherit" />
      ) : validateInsertData?.isError ||
        chequeBkCfm.isError ||
        chequeBkValidateCfm.isError ? (
        <AppBar position="relative" color="primary">
          <Alert
            severity="error"
            errorMsg={
              validateInsertData?.error?.error_msg ??
              chequeBkValidateCfm?.error?.error_msg ??
              chequeBkCfm?.error?.error_msg ??
              "Unknow Error"
            }
            errorDetail={
              validateInsertData?.error?.error_detail ??
              chequeBkValidateCfm?.error?.error_detail ??
              chequeBkCfm?.error?.error_detail ??
              ""
            }
            color="error"
          />
        </AppBar>
      ) : (
        <LinearProgressBarSpacer />
      )}
      <FormWrapper
        key={"chequebooksEntry"}
        metaData={ChequeBookEntryMetaData as MetaDataType}
        initialValues={confirmData?.FLAG === "C" ? confirmData : {}}
        displayMode={confirmData?.FLAG === "C" ? "view" : null}
        formStyle={{
          height: "calc(100vh - 336px)",
          // overflowY: "auto",
          // overflowX: "hidden",
        }}
        onSubmitHandler={onSubmitHandler}
        ref={myMasterRef}
        formState={{
          MessageBox: MessageBox,
          workingDate: authState?.workingDate,
        }}
        setDataOnFieldChange={(action, payload) => {
          if (action === "DTL_TAB") {
            setIsData((old) => ({ ...old, isVisible: payload.DTL_TAB }));
          }
          if (action === "NO_OF_CHQBK") {
            myMasterRef?.current?.handleSubmit(
              { preventDefault: () => {} },
              "Save"
            );
          }
        }}
      >
        {({ isSubmitting, handleSubmit }) => (
          <>
            {confirmData?.FLAG === "C" ? (
              <>
                {confirmData?.CONFIRMED !== "N" && (
                  <>
                    <Button color="primary" onClick={() => handelChange("C")}>
                      {t("Confirm")}
                    </Button>
                    <Button color="primary" onClick={() => handelChange("R")}>
                      {t("Reject")}
                    </Button>
                  </>
                )}
                <Button color="primary" onClick={closeDialog}>
                  {t("Close")}
                </Button>
              </>
            ) : (
              <Button
                onClick={(event) => {
                  handleSubmit(event, "Save");
                }}
                disabled={isSubmitting}
                //   endIcon={
                //     isSubmitting ? <CircularProgress size={20} /> : null
                //   }
                color={"primary"}
              >
                {t("Save")}
              </Button>
            )}
          </>
        )}
      </FormWrapper>

      <Routes>
        <Route
          path="multiChequebook/*"
          element={
            <MultipleChequebook
              navigate={navigate}
              validateInsertData={validateInsertData}
            />
          }
        />
        <Route
          path="issuedChequebook/*"
          element={<IssuedChequebook navigate={navigate} />}
        />
      </Routes>
    </>
  );
};

export const ChequebookCfmForm = ({ closeDialog, result }) => {
  const { state: rows }: any = useLocation();

  return (
    <Dialog
      open={true}
      fullWidth={true}
      PaperProps={{
        style: {
          maxWidth: "1300px",
        },
      }}
    >
      <>
        <EntryForm
          confirmData={{ ...rows?.[0]?.data, FLAG: "C" }}
          closeDialog={closeDialog}
          result={result}
        />
      </>
    </Dialog>
  );
};
