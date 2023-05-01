import { FC, useEffect, useState, useContext, useRef } from "react";
import { useMutation } from "react-query";
import { ClearCacheContext, queryClient } from "cache";
import { InitialValuesType, SubmitFnType } from "packages/form";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useSnackbar } from "notistack";
import { useLocation } from "react-router-dom";
import { useDialogStyles } from "pages_audit/common/dialogStyles";
import { Transition } from "pages_audit/common/transition";
import * as API from "./api";
import { EmailSMSTemplateFormMetadata } from "./metaData";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { SMSTemplateWrapper } from "./smsTemplate";
import { EmailTemplateWrapper } from "./emailTemplate";
import { utilFunction } from "components/utils";
import { AuthContext } from "pages_audit/auth";

interface updateAUTHDetailDataType {
  data: any;
  endSubmit?: any;
  displayData?: any;
  setFieldError?: any;
}

const updateAUTHDetailDataWrapperFn =
  (updateAUTHDetailData) =>
  async ({ data }: updateAUTHDetailDataType) => {
    return updateAUTHDetailData(data);
  };

const EmailSMSTemplateForm: FC<{
  isDataChangedRef: any;
  closeDialog?: any;
  formView?: string;
  branchCode: string;
}> = ({ isDataChangedRef, closeDialog, formView, branchCode }) => {
  const { enqueueSnackbar } = useSnackbar();
  const isErrorFuncRef = useRef<any>(null);
  const isEmailNewRef = useRef<any>({});
  const [isOpenSave, setIsOpenSave] = useState(false);
  const [isOpenSMS, setIsOpenSMS] = useState(false);
  const [isOpenEmail, setIsOpenEmail] = useState(false);
  const { state: rows }: any = useLocation();
  const mutation = useMutation(
    updateAUTHDetailDataWrapperFn(API.updateEmailSMSConfig),
    {
      onError: (error: any, { endSubmit }) => {
        let errorMsg = "Unknown Error occured";
        onActionCancel();
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        endSubmit(false, errorMsg, error?.error_detail ?? "");
      },
      onSuccess: (data, { endSubmit }) => {
        endSubmit(true, "");
        enqueueSnackbar(data, {
          variant: "success",
        });
        onActionCancel();
        isDataChangedRef.current = true;
        if (typeof closeDialog === "function") {
          closeDialog();
        }
      },
    }
  );
  const onActionCancel = () => {
    setIsOpenSave(false);
  };
  const onPopupYes = (rows) => {
    mutation.mutate({ ...isErrorFuncRef.current });
  };
  const onSubmitHandler: SubmitFnType = (
    data,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    //@ts-ignore
    endSubmit(true);
    data["MAIL_MSG"] = isEmailNewRef.current?.MAIL_MSG;
    data["MAIL_MSG_JSON"] = JSON.stringify(
      isEmailNewRef.current?.MAIL_MSG_JSON
    );
    data["USER_MSG_TXT"] = isEmailNewRef.current?.USER_MSG_TXT;
    let updateValue = utilFunction.transformDetailsData(
      data,
      rows[0]?.data ?? {}
    );
    if (updateValue?._UPDATEDCOLUMNS?.length === 0) {
      closeDialog();
    } else {
      isErrorFuncRef.current = {
        data: { ...data, ...updateValue },
        displayData,
        endSubmit,
        setFieldError,
      };
      setIsOpenSave(true);
    }
  };

  const ClosedEventCall = () => {
    setIsOpenSMS(false);
    setIsOpenEmail(false);
  };
  const onSaveSMSData = (smsText) => {
    isEmailNewRef.current = {
      ...isEmailNewRef.current,
      USER_MSG_TXT: smsText,
    };
    setIsOpenSMS(false);
  };
  const onSaveEmailData = (emailJson, emailText) => {
    isEmailNewRef.current = {
      ...isEmailNewRef.current,
      MAIL_MSG: emailText,
      MAIL_MSG_JSON: emailJson,
    };
    setIsOpenEmail(false);
  };
  useEffect(() => {
    isEmailNewRef.current = {
      MAIL_MSG: rows?.[0]?.data?.MAIL_MSG,
      MAIL_MSG_JSON: rows?.[0]?.data?.MAIL_MSG_JSON,
      USER_MSG_TXT: rows?.[0]?.data?.USER_MSG_TXT,
      TRAN_CD: rows?.[0]?.data?.TRAN_CD,
    };
  }, []);
  return (
    <>
      <FormWrapper
        key={"EmailSMSTemplateForm"}
        metaData={EmailSMSTemplateFormMetadata as MetaDataType}
        initialValues={rows?.[0]?.data as InitialValuesType}
        onSubmitHandler={onSubmitHandler}
        //@ts-ignore
        // displayMode={formMode}
        formStyle={{
          background: "white",
          height: "calc(65vh - 16vh)",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {({ isSubmitting, handleSubmit }) => (
          <>
            <Button
              onClick={(event) => {
                setIsOpenSMS(true);
              }}
              disabled={isSubmitting}
              //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              color={"primary"}
            >
              SMS
            </Button>
            <Button
              onClick={(event) => {
                setIsOpenEmail(true);
              }}
              disabled={isSubmitting}
              //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              color={"primary"}
            >
              Email
            </Button>
            <Button
              onClick={(event) => {
                handleSubmit(event, "Save");
              }}
              disabled={isSubmitting}
              //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              color={"primary"}
            >
              Save
            </Button>
            <Button
              onClick={closeDialog}
              color={"primary"}
              disabled={isSubmitting}
            >
              Close
            </Button>
            {/* <Button
            onClick={moveToViewMode}
            disabled={isSubmitting}
																		  
            color={"primary"}
          >
            Cancel
          </Button> */}
          </>
        )}
      </FormWrapper>
      {isOpenSave ? (
        <PopupMessageAPIWrapper
          MessageTitle="Confirmation"
          Message="Do you want to save this Request?"
          onActionYes={(rowVal) => onPopupYes(rowVal)}
          onActionNo={() => onActionCancel()}
          rows={rows?.[0]?.data}
          open={isOpenSave}
          loading={mutation.isLoading}
        />
      ) : null}
      {isOpenSMS ? (
        <SMSTemplateWrapper
          open={isOpenSMS}
          handleDialogClose={ClosedEventCall}
          isDataChangedRef={isDataChangedRef}
          onSaveData={onSaveSMSData}
          trnCode={isEmailNewRef.current?.TRAN_CD}
          smsText={isEmailNewRef.current?.USER_MSG_TXT}
        />
      ) : null}
      {isOpenEmail ? (
        <EmailTemplateWrapper
          open={isOpenEmail}
          handleDialogClose={ClosedEventCall}
          isDataChangedRef={isDataChangedRef}
          onSaveData={onSaveEmailData}
          reqdata={isEmailNewRef.current}
        />
      ) : null}
    </>
  );
};

export const EmailSMSTemplateFormWrapper = ({
  handleDialogClose,
  isDataChangedRef,
}) => {
  const classes = useDialogStyles();
  const { state: rows }: any = useLocation();
  const { getEntries } = useContext(ClearCacheContext);
  useEffect(() => {
    return () => {
      let entries = getEntries() as any[];
      entries.forEach((one) => {
        queryClient.removeQueries(one);
      });
    };
  }, [getEntries]);
  return (
    <>
      <Dialog
        open={true}
        //@ts-ignore
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            width: "100%",
          },
        }}
        maxWidth="md"
        classes={{
          scrollPaper: classes.topScrollPaper,
          paperScrollBody: classes.topPaperScrollBody,
        }}
      >
        <EmailSMSTemplateForm
          branchCode={rows[0]?.data.BRANCH_CD ?? ""}
          isDataChangedRef={isDataChangedRef}
          closeDialog={handleDialogClose}
          formView={"edit"}
        />
      </Dialog>
    </>
  );
};
