import { useRef, useContext, useEffect } from "react";
import { useMutation } from "react-query";
import * as API from "../api";
import { ClearCacheProvider } from "cache";
import { AppBar, Dialog, LinearProgress } from "@mui/material";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { SubmitFnType } from "packages/form";
import { AuthContext } from "pages_audit/auth";
import { ActionTypes } from "components/dataTable";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { retrieveFormMetaData } from "./retrieveFormMetadata";
import { usePopupContext } from "components/custom/popupContext";
import { LinearProgressBarSpacer } from "components/dataTable/linerProgressBarSpacer";
const actions: ActionTypes[] = [
  {
    actionName: "view-details",
    actionLabel: "ViewDetails",
    multiple: false,
    rowDoubleClick: true,
  },
];

const RetrieveDataCustom = ({
  navigate,
  parameter,
  setFormMode,
  setRetrieveData,
}) => {
  const { authState } = useContext(AuthContext);
  const formRef = useRef<any>(null);
  const { t } = useTranslation();
  const { MessageBox, CloseMessageBox } = usePopupContext();

  const updateFnWrapper =
    (update) =>
    async ({ data }) => {
      return update({
        ...data,
      });
    };
  const mutation: any = useMutation(
    "getRtgsRetrieveData",
    updateFnWrapper(API.retrieveData),
    {
      onSuccess: (data, { endSubmit }: any) => {
        if (data?.length <= 0) {
          endSubmit(false, t("NoDataFound") ?? "");
        } else if (Array.isArray(data) && data?.length > 0) {
          setFormMode("view");
          navigate(".");
          setRetrieveData(data);
        }
      },
      onError: (error: any, { endSubmit }) => {
        let errorMsg = t("UnknownErrorOccured");
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        endSubmit(false, errorMsg, error?.error_detail ?? "");
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
    let apiReq = {
      RET_FLAG: data?.A_RET_FLAG ?? "",
      CUSTOMER_ID: data?.CUSTOMER_ID ?? "",
      BRANCH_CD: data?.BRANCH_CD ?? "",
      ACCT_TYPE: data?.ACCT_TYPE ?? "",
      ACCT_CD: data?.ACCT_CD ?? "",
      PARA_602: parameter?.PARA_602 ?? "",
      PARA_610: parameter?.PARA_610 ?? "",
      FROM_DT: data?.A_RET_FLAG === "A" ? data?.FROM_DT ?? "" : "",
      TO_DT: data?.A_RET_FLAG === "A" ? data?.TO_DT ?? "" : "",
      SCREEN_REF: "MST/846",
    };

    mutation.mutate({
      data: apiReq,
      endSubmit,
    });
    endSubmit(true);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        formRef?.current?.handleSubmit({ preventDefault: () => {} }, "Save");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <>
      <>
        <Dialog
          open={true}
          fullWidth={true}
          PaperProps={{
            style: {
              maxWidth: "800px",
              padding: "5px",
            },
          }}
        >
          {mutation?.isLoading ? (
            <LinearProgress color="inherit" />
          ) : (
            <LinearProgressBarSpacer />
          )}
          <FormWrapper
            key={`retrieve-Form`}
            metaData={retrieveFormMetaData as MetaDataType}
            initialValues={{
              PARA_602: parameter?.PARA_602,
              PARA_946: parameter?.PARA_946,
            }}
            onSubmitHandler={onSubmitHandler}
            formStyle={{
              background: "white",
            }}
            formState={{ MessageBox: MessageBox }}
            onFormButtonClickHandel={(id) => {
              let event: any = { preventDefault: () => {} };
              if (id === "RETRIEVE") {
                formRef?.current?.handleSubmit(event, "RETRIEVE");
              } else if (id === "CANCEL") {
                navigate(".");
              }
            }}
            ref={formRef}
          >
            {({ isSubmitting, handleSubmit }) => <></>}
          </FormWrapper>
        </Dialog>
      </>
    </>
  );
};

export const RetrieveData = ({
  navigate,
  parameter,
  setFormMode,
  setRetrieveData,
}) => {
  return (
    <ClearCacheProvider>
      <RetrieveDataCustom
        parameter={parameter}
        navigate={navigate}
        setFormMode={setFormMode}
        setRetrieveData={setRetrieveData}
      />
    </ClearCacheProvider>
  );
};
