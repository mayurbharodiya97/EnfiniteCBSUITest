import { useRef, useContext } from "react";
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

const RetrieveDataCustom = ({ navigate, setFormMode, setRetrieveData }) => {
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
    "getRtgsData",
    updateFnWrapper(API.retrieveData),
    {
      onSuccess: (data, { endSubmit }: any) => {
        console.log("<<<reteet", data);
        if (data?.length <= 0) {
          endSubmit(false, t("NoDataFound") ?? "");
        } else if (Array.isArray(data) && data?.length > 0) {
          setFormMode("view");
          navigate(".");
          data[0].RETRIEVE_DATA = "Y";
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
    endSubmit
  ) => {
    mutation.mutate({
      data: {
        CUSTOMER_ID: data?.CUSTOMER_ID ?? "",
        COMP_CD: authState?.companyID,
      },
      endSubmit,
    });
    endSubmit(true);
  };

  return (
    <>
      <>
        <Dialog
          open={true}
          fullWidth={true}
          PaperProps={{
            style: {
              maxWidth: "450px",
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
            initialValues={{}}
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

export const RetrieveData = ({ navigate, setFormMode, setRetrieveData }) => {
  return (
    <ClearCacheProvider>
      <RetrieveDataCustom
        navigate={navigate}
        setFormMode={setFormMode}
        setRetrieveData={setRetrieveData}
      />
    </ClearCacheProvider>
  );
};
