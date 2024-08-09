import { useRef, useContext } from "react";
import { useMutation } from "react-query";
import * as API from "../api";
import { ClearCacheProvider } from "cache";
import { CircularProgress, Dialog } from "@mui/material";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { SubmitFnType } from "packages/form";
import { AuthContext } from "pages_audit/auth";
import { useTranslation } from "react-i18next";
import { retrieveFormMetaData } from "./retrieveFormMetadata";
import { GradientButton } from "components/styledComponent/button";

const RetrieveDataCustom = ({ navigate, setFormMode, setRetrieveData }) => {
  const { authState } = useContext(AuthContext);
  const formRef = useRef<any>(null);
  const { t } = useTranslation();

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
    endSubmit(true);
    mutation.mutate({
      data: {
        CUSTOMER_ID: data?.CUSTOMER_ID ?? "",
        COMP_CD: authState?.companyID,
        endSubmit,
      },
    });
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
          <FormWrapper
            key={`retrieve-Form`}
            metaData={retrieveFormMetaData as MetaDataType}
            initialValues={{}}
            onSubmitHandler={onSubmitHandler}
            formStyle={{
              background: "white",
            }}
            controlsAtBottom={true}
            ref={formRef}
          >
            {({ isSubmitting, handleSubmit }) => (
              <>
                <GradientButton
                  color={"primary"}
                  onClick={(event) => handleSubmit(event, "BUTTON_CLICK")}
                  endIcon={
                    mutation?.isLoading ? <CircularProgress size={20} /> : null
                  }
                >
                  {t("Retrieve")}
                </GradientButton>

                <GradientButton onClick={() => navigate(".")} color={"primary"}>
                  {t("Cancel")}
                </GradientButton>
              </>
            )}
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
