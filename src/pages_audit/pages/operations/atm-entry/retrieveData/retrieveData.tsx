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
      return update({ ...data });
    };
  const mutation: any = useMutation(
    "getRtgsRetrieveData",
    updateFnWrapper(API.retrieveData),
    {
      onSuccess: (data, { endSubmit }: any) => {
        if (Array.isArray(data) && data?.length <= 0) {
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
    console.log("<<<reteteee", data, parameter);
    // delete data["RETRIEVE"];
    // delete data["VIEW_ALL"];
    // if (Boolean(data["FROM_DT"])) {
    //   data["FROM_DT"] = format(new Date(data["FROM_DT"]), "dd/MMM/yyyy");
    // }
    // if (Boolean(data["TO_DT"])) {
    //   data["TO_DT"] = format(new Date(data["TO_DT"]), "dd/MMM/yyyy");
    // }
    // data = {
    //   ...data,
    //   COMP_CD: authState.companyID,
    //   BRANCH_CD: authState.user.branchCode,
    //   FLAG: actionFlag === "RETRIEVE" ? "P" : "A",
    //   FLAG_RTGSC: "",
    // };

    mutation.mutate({
      data: data,
      endSubmit,
    });
    endSubmit(true);
  };
  // useEffect(() => {
  //   mutation.mutate({
  //     FROM_DT: format(new Date(authState?.workingDate), "dd/MMM/yyyy"),
  //     TO_DT: format(new Date(authState?.workingDate), "dd/MMM/yyyy"),
  //     COMP_CD: authState.companyID,
  //     BRANCH_CD: authState.user.branchCode,
  //     FLAG: "P",
  //     FLAG_RTGSC: "",
  //   });
  // }, []);

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
