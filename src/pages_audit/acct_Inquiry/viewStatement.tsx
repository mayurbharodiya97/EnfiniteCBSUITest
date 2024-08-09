import { CircularProgress, Dialog, useTheme } from "@mui/material";
import { queryClient } from "cache";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { usePopupContext } from "components/custom/popupContext";
import { MetaDataType } from "components/dyanmicForm";
import { FormWrapper } from "components/dyanmicForm/formWrapper";
import { GradientButton } from "components/styledComponent/button";
import { format } from "date-fns";
import { InitialValuesType, SubmitFnType } from "packages/form";
import { AuthContext } from "pages_audit/auth";
import { useContext, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import * as API from "./api";
import {
  AccountInquiry,
  PassbookStatement,
  PassbookPrintingInq,
} from "./metaData";
import { useTranslation } from "react-i18next";
import { enqueueSnackbar } from "notistack";

export const ViewStatement = ({ open, onClose, rowsData, screenFlag }) => {
  const [disableButton, setDisableButton] = useState(false);
  const formRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const parameterRef = useRef<any>();
  const accountDetailsRef = useRef<any>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const acctInqData: any = useQuery<any, any, any>(
    ["getAcctInqStatement", { rowsData, COMP_CD: authState.companyID }],
    () =>
      API.getAcctInqStatement({
        rowsData,
        COMP_CD: authState.companyID,
        workingDate: authState?.workingDate,
        screenFlag: screenFlag,
        FULL_ACCT_NO: "",
      })
  );

  const passbookInqData: any = useMutation(
    "getPassbookStatement",
    API.getPassbookStatement,
    {
      onSuccess: async (data) => {
        navigate("/cbsenfinity/operation/passbook-printing", {
          state: {
            passbookDetail: data,
            parameterRef: parameterRef.current,
            accountDetailsRef: accountDetailsRef.current,
            acctInqDataRef: acctInqData?.data?.[0],
          },
        });
        handleClose();
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

  const passbookValidation: any = useMutation(
    "passbookPrintingValidation",
    API.passbookPrintingValidation,
    {
      onSuccess: async (data: any) => {
        if (data?.[0]?.O_STATUS === "999") {
          const btnName = await MessageBox({
            messageTitle: "Validation Failed",
            message: data?.[0]?.O_MESSAGE,
            buttonNames: ["Ok"],
          });
        } else if (data?.[0]?.O_STATUS === "0") {
          passbookInqData.mutate({
            COMP_CD: authState.companyID ?? "",
            BRANCH_CD: parameterRef?.current?.BRANCH_CD ?? "",
            ACCT_TYPE: parameterRef?.current?.ACCT_TYPE ?? "",
            ACCT_CD: parameterRef?.current?.ACCT_CD ?? "",
            ENTERED_BRANCH_CD: parameterRef?.current?.BRANCH_CD ?? "",
            FROM_DT: parameterRef?.current?.PASS_BOOK_DT ?? "",
            TO_DT: parameterRef?.current?.PASS_BOOK_TO_DT ?? "",
            PRINT_PAGE: parameterRef?.current?.PID_DESCRIPION ?? "",
            TEMPL_TRAN_CD: parameterRef?.current?.TRAN_CD ?? "",
            LAST_LINE_NO: parameterRef?.current?.PASS_BOOK_LINE ?? "",
            REPRINT: parameterRef?.current?.REPRINT_VALUE ?? "",
          });
        }
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
      queryClient.removeQueries([
        "getAcctInqStatement",
        {
          rowsData,
          COMP_CD: authState.companyID,
          workingDate: authState?.workingDate,
          screenFlag: screenFlag,
        },
      ]);
      queryClient.removeQueries(["getPassbookStatement"]);
      queryClient.removeQueries(["passbookPrintingCompleted"]);
      queryClient.removeQueries(["passbookPrintingValidation"]);
    };
  }, []);

  const handleClose = () => {
    onClose();
  };
  const onSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    // onClose();
    endSubmit(true);
    if (screenFlag === "ACCT_INQ" && data?.PD_DESTION === "S") {
      const combinedData = { ...rowsData?.[0]?.data, ...data };
      const dataString = JSON.stringify(combinedData);
      sessionStorage.setItem("myData", dataString);
      const newWindow = window.open("/cbsenfinity/view-statement", "_blank");
      if (newWindow) {
        newWindow.focus();
      }
    } else if (screenFlag === "ACCT_INQ" && data?.PD_DESTION === "P") {
      parameterRef.current = {
        ...rowsData?.[0]?.data,
        ...acctInqData?.data?.[0],
        ...data,
      };
      passbookValidation.mutate({
        COMP_CD: authState.companyID ?? "",
        BRANCH_CD: parameterRef.current?.BRANCH_CD ?? "",
        ACCT_TYPE: parameterRef.current?.ACCT_TYPE ?? "",
        ACCT_CD: parameterRef.current?.ACCT_CD ?? "",
        TRAN_CD: parameterRef.current?.TRAN_CD ?? "",
        FLAG: "",
        LINE_ID: "",
        LINE_PER_PAGE: "",
        FROM_DT: format(
          new Date(parameterRef.current["PASS_BOOK_DT"]),
          "dd/MMM/yyyy"
        ),
        GD_DATE: format(
          new Date(parameterRef.current["PASS_BOOK_TO_DT"]),
          "dd/MMM/yyyy"
        ),
        SCREEN_REF: "",
      });
    } else if (screenFlag === "ACCT_PASSBOOK") {
      parameterRef.current = data;
      passbookValidation.mutate({
        COMP_CD: authState.companyID ?? "",
        BRANCH_CD: parameterRef.current?.BRANCH_CD ?? "",
        ACCT_TYPE: parameterRef.current?.ACCT_TYPE ?? "",
        ACCT_CD: parameterRef.current?.ACCT_CD ?? "",
        TRAN_CD: parameterRef.current?.TRAN_CD ?? "",
        FLAG: "",
        LINE_ID: "",
        LINE_PER_PAGE: "",
        FROM_DT: (parameterRef.current["PASS_BOOK_DT"] = format(
          new Date(parameterRef.current["PASS_BOOK_DT"]),
          "dd/MMM/yyyy"
        )),
        GD_DATE: (parameterRef.current["PASS_BOOK_TO_DT"] = format(
          new Date(parameterRef.current["PASS_BOOK_TO_DT"]),
          "dd/MMM/yyyy"
        )),
        SCREEN_REF: "",
      });
    }
  };

  let finalMetadata: any = null;
  if (screenFlag === "STATEMENT") {
    finalMetadata = PassbookStatement as MetaDataType;
  } else if (screenFlag === "ACCT_PASSBOOK") {
    finalMetadata = PassbookPrintingInq as MetaDataType;
  } else if (screenFlag === "ACCT_INQ") {
    finalMetadata = AccountInquiry as MetaDataType;
  }

  const handleButonDisable = (disable) => {
    setDisableButton(disable);
  };

  const renderResult = (
    <>
      <Dialog open={open} maxWidth={"sm"}>
        {screenFlag === "ACCT_INQ" && acctInqData?.isLoading ? (
          <>
            <div style={{ width: "600px", height: "100px" }}>
              <LoaderPaperComponent />
            </div>
          </>
        ) : (
          <FormWrapper
            key={`ViewStatement`}
            metaData={finalMetadata}
            initialValues={
              {
                ...acctInqData?.data?.[0],
              } as InitialValuesType
            }
            onSubmitHandler={onSubmitHandler}
            loading={
              acctInqData?.isLoading ||
              acctInqData?.isFetching ||
              passbookInqData?.isLoading ||
              passbookInqData?.isFetching ||
              passbookValidation?.isLoading ||
              passbookValidation?.isFetching
            }
            formStyle={{
              background: "white",
            }}
            controlsAtBottom={true}
            ref={formRef}
            formState={{
              rowsData: rowsData?.[0]?.data,
              acctInqData: acctInqData?.data?.[0],
              handleButonDisable: handleButonDisable,
              MessageBox: MessageBox,
              docCD: "RPT/430"
            }}
            setDataOnFieldChange={(action, payload) => {
              if (action === "accountDetails") {
                accountDetailsRef.current = payload;
              }
            }}
          >
            {({ isSubmitting, handleSubmit }) => (
              <>
                <GradientButton
                  style={{ marginRight: "5px" }}
                  onClick={(event) => {
                    handleSubmit(event, "Save");
                  }}
                  color={"primary"}
                  disabled={
                    acctInqData?.isLoading ||
                    acctInqData?.isFetching ||
                    passbookInqData?.isLoading ||
                    passbookInqData?.isFetching ||
                    passbookValidation?.isLoading ||
                    passbookValidation?.isFetching ||
                    disableButton
                  }
                  endicon={
                    acctInqData?.isLoading ||
                    acctInqData?.isFetching ||
                    passbookInqData?.isLoading ||
                    passbookInqData?.isFetching ||
                    passbookValidation?.isLoading ||
                    passbookValidation?.isFetching
                      ? null
                      : "CheckCircleOutline"
                  }
                  rotateIcon="scale(1.4)"
                >
                  {acctInqData?.isLoading ||
                  passbookValidation?.isLoading ||
                  passbookInqData?.isLoading ? (
                    <CircularProgress size={25} thickness={4.6} />
                  ) : (
                    t("Ok")
                  )}
                </GradientButton>
                <GradientButton
                  onClick={handleClose}
                  color={"primary"}
                  endicon="CancelOutlined"
                  rotateIcon="scale(1.4) rotateY(360deg)"
                >
                  {t("Close")}
                </GradientButton>
              </>
            )}
          </FormWrapper>
        )}
      </Dialog>
    </>
  );
  return renderResult;
};
