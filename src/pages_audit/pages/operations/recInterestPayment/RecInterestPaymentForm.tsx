import { Box, CircularProgress, Dialog } from "@mui/material";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { useLocation } from "react-router-dom";
import * as API from "./api";
import {
  recAccountFindmetaData,
  RecInterestPaymentMetaData,
} from "./RecInterestPaymentMetaData";
import { AuthContext } from "pages_audit/auth";
import {
  FormWrapper,
  GradientButton,
  MetaDataType,
  queryClient,
  SubmitFnType,
  usePopupContext,
  utilFunction,
} from "@acuteinfo/common-base";

export const RecInterestPaymentForm = () => {
  const [isFormOpen, setFormOpen] = useState(true);
  const [recPaymentInstructions, setRecPaymentInstructions] = useState<any>({});
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [balance, setBalance] = useState<any>({});
  const { authState } = useContext(AuthContext);
  const parameterRef = useRef<any>();
  const isErrorFuncRef = useRef<any>(null);
  const { t } = useTranslation();
  const { MessageBox, CloseMessageBox } = usePopupContext();
  let currentPath = useLocation().pathname;

  const fetchRecPaymentInstructions: any = useMutation(
    "getRecPaymentInstrudtl",
    API.fetchRecPaymentDetails,
    {
      onSuccess: async (data) => {
        if (data.length === 0) {
          let buttonName = await MessageBox({
            messageTitle: "ValidationFailed",
            message: "NounPaidFDmsg",
            buttonNames: ["Ok"],
            icon: "ERROR",
          });
        } else {
          setRecPaymentInstructions(data?.[0]);
          setFormOpen(false);
          CloseMessageBox();
        }
      },
      onError: async (error: any) => {
        const btnName = await MessageBox({
          messageTitle: "ValidationFailed",
          message: error?.error_msg ?? "",
          icon: "ERROR",
        });
        CloseMessageBox();
      },
    }
  );
  const updateRecInterestPaymentEntry = useMutation(
    API.updateRecInterestPaymentEntry,
    {
      onSuccess: async (data, variables) => {
        if (variables.data._isDeleteRow) {
          const btnName = await MessageBox({
            messageTitle: "Success",
            message: "RecordsDeletedMsg",
            icon: "SUCCESS",
          });
        } else {
          const btnName = await MessageBox({
            messageTitle: "Success",
            message: "RecordSave",
            icon: "SUCCESS",
          });
        }
        CloseMessageBox();
        setFormOpen(true);
        setRecPaymentInstructions([]);
      },
      onError: async (error: any) => {
        const btnName = await MessageBox({
          messageTitle: "ValidationFailed",
          message: error?.error_msg ?? "",
          icon: "ERROR",
        });
        CloseMessageBox();
      },
    }
  );

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData: any,
    endSubmit,
    setFieldError
  ) => {
    setBalance(data);
    fetchRecPaymentInstructions.mutate(parameterRef.current, {
      onSettled: () => {
        if (!fetchRecPaymentInstructions.isLoading) {
          endSubmit(true);
        }
      },
    });
  };
  const onFinalSubmitHandler: SubmitFnType = async (
    data: any,
    displayData: any,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    let newData = { ...data };
    let oldData = { ...recPaymentInstructions };
    let upd = utilFunction.transformDetailsData(newData, oldData);

    if (actionFlag === "Save") {
      isErrorFuncRef.current = {
        data: {
          ...newData,
          ...upd,
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user.branchCode,
          _isNewRow: !Boolean(recPaymentInstructions?.PAYMENT_MODE)
            ? true
            : false,
        },
        displayData,
        endSubmit,
        setFieldError,
      };

      if (isErrorFuncRef.current?.data?._UPDATEDCOLUMNS.length !== 0) {
        const btnName = await MessageBox({
          messageTitle: "Confirmation",
          message: "SaveData",
          buttonNames: ["Yes", "No"],
          loadingBtnName: ["Yes"],
        });
        if (btnName === "Yes") {
          updateRecInterestPaymentEntry.mutate({
            data: {
              ...isErrorFuncRef.current?.data,
              ENTERED_COMP_CD: authState?.companyID ?? "",
              ENTERED_BRANCH_CD: authState?.user?.branchCode ?? "",
              COMP_CD: recPaymentInstructions?.COMP_CD ?? "",
              CR_COMP_CD: recPaymentInstructions?.COMP_CD ?? "",
              BRANCH_CD: recPaymentInstructions?.BRANCH_CD ?? "",
              ACCT_TYPE: recPaymentInstructions?.ACCT_TYPE ?? "",
              ACCT_CD: recPaymentInstructions?.ACCT_CD ?? "",
              FD_NO: recPaymentInstructions?.FD_NO ?? "",
            },
          });
        }
      }
    } else if (actionFlag === "Delete") {
      const btnName = await MessageBox({
        messageTitle: "Confirmation",
        message: "DoYouWantDeleteRow",
        buttonNames: ["Yes", "No"],
        loadingBtnName: ["Yes"],
      });
      if (btnName === "Yes") {
        updateRecInterestPaymentEntry.mutate({
          data: {
            COMP_CD: recPaymentInstructions?.COMP_CD ?? "",
            CR_COMP_CD: recPaymentInstructions?.COMP_CD ?? "",
            BRANCH_CD: recPaymentInstructions?.BRANCH_CD ?? "",
            FD_NO: recPaymentInstructions?.FD_NO ?? "",
            ACCT_TYPE: recPaymentInstructions?.ACCT_TYPE ?? "",
            ACCT_CD: recPaymentInstructions?.ACCT_CD ?? "",
            _isDeleteRow: true,
          },
        });
      }
    }
    endSubmit(true);
  };
  const handleCloseForm = () => {
    setFormOpen(false);
  };
  const handleRetrieve = async () => {
    let btnName = await MessageBox({
      messageTitle: "Confirmation",
      message: `RetrieveConfirmation`,
      buttonNames: ["Yes", "No"],
    });
    if (btnName === "Yes") {
      setRecPaymentInstructions([]);
      setFormOpen(true);
      setBalance({});
    }
  };
  const handleButtonDisable = (disable) => {
    setButtonDisabled(disable);
  };

  // Clear catch
  useEffect(() => {
    const keysToRemove = [
      "getRecPaymentInstrudtl",
      "getPMISCData",
      "getAccountTypeList",
    ].map((key) => [key, authState?.user?.branchCode]);
    return () => {
      keysToRemove.forEach((key) => queryClient.removeQueries(key));
    };
  }, []);

  const metaData = JSON.parse(JSON.stringify(RecInterestPaymentMetaData));
  metaData.form.label = utilFunction.getDynamicLabel(
    currentPath,
    authState?.menulistdata,
    true
  );
  return (
    <Fragment>
      <Dialog
        open={isFormOpen}
        // @ts-ignore
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            width: "100%",
            overflow: "auto",
          },
        }}
        maxWidth="sm"
      >
        <FormWrapper
          key={"recAccountFindmetaData"}
          metaData={recAccountFindmetaData as MetaDataType}
          formStyle={{
            background: "white",
          }}
          controlsAtBottom={true}
          onSubmitHandler={onSubmitHandler}
          setDataOnFieldChange={(action, payload) => {
            if (action === "fdPaymentInstrudtl") {
              parameterRef.current = { ...payload, A_PARM: "REC" };
            }
          }}
          formState={{
            MessageBox: MessageBox,
            handleButtonDisable: handleButtonDisable,
            docCD: "MST/894",
          }}
        >
          {({ isSubmitting, handleSubmit }) => (
            <>
              <Box display="flex" gap="8px">
                <GradientButton
                  onClick={(event) => {
                    handleSubmit(event, "Save");
                  }}
                  disabled={
                    isSubmitting ||
                    fetchRecPaymentInstructions.isLoading ||
                    isButtonDisabled
                  }
                  endIcon={
                    isSubmitting || fetchRecPaymentInstructions.isLoading ? (
                      <CircularProgress size={20} />
                    ) : null
                  }
                  color={"primary"}
                >
                  {t("Submit")}
                </GradientButton>

                <GradientButton
                  onClick={handleCloseForm}
                  color={"primary"}
                  disabled={
                    isSubmitting ||
                    fetchRecPaymentInstructions.isLoading ||
                    isButtonDisabled
                  }
                >
                  {t("Cancel")}
                </GradientButton>
              </Box>
            </>
          )}
        </FormWrapper>
      </Dialog>

      <FormWrapper
        key={
          "RecInterestPaymentMetaData" +
          Object.keys(recPaymentInstructions)?.length
        }
        metaData={metaData as MetaDataType}
        formStyle={{
          background: "white",
        }}
        onSubmitHandler={onFinalSubmitHandler}
        initialValues={{
          ...recPaymentInstructions,
          ACCT_NAME: recPaymentInstructions?.HOLDER_ACCT_NM ?? "",
          TRAN_BAL: balance?.TRAN_BAL ?? "",
        }}
        formState={{
          MessageBox: MessageBox,
          handleButtonDisable: handleButtonDisable,
          accountDetail: recPaymentInstructions,
        }}
      >
        {({ isSubmitting, handleSubmit }) => (
          <>
            <Box display="flex" gap="8px">
              {Object.keys(recPaymentInstructions).length > 0 && (
                <>
                  <GradientButton
                    onClick={(event) => {
                      handleSubmit(event, "Save");
                    }}
                    disabled={isSubmitting || isButtonDisabled}
                    color={"primary"}
                  >
                    {t("Save")}
                  </GradientButton>

                  <GradientButton
                    onClick={(event) => {
                      handleSubmit(event, "Delete");
                    }}
                    color={"primary"}
                    disabled={isSubmitting || isButtonDisabled}
                  >
                    {t("Delete")}
                  </GradientButton>
                </>
              )}
              <GradientButton
                onClick={handleRetrieve}
                color={"primary"}
                disabled={isSubmitting}
              >
                {t("Retrieve")}
              </GradientButton>
            </Box>
          </>
        )}
      </FormWrapper>
    </Fragment>
  );
};
