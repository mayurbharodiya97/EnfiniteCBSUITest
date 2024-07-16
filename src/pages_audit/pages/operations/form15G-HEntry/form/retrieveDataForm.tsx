import { AppBar, CircularProgress, Dialog } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { GradientButton } from "components/styledComponent/button";
import { SubmitFnType } from "packages/form";
import { AuthContext } from "pages_audit/auth";
import { useMutation, useQuery } from "react-query";
import * as API from "../api";
import { enqueueSnackbar } from "notistack";
import { RetrievalParameterFormMetaData } from "../form/metaData";
import { format } from "date-fns";
import { Form15GHEntryWrapper } from "../form";
import { isValidDate } from "components/utils/utilFunctions/function";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { usePopupContext } from "components/custom/popupContext";
import { Alert } from "components/common/alert";
import { queryClient } from "cache";
import { useTranslation } from "react-i18next";

export const RetrievalParameters = ({
  closeDialog,
  onDataRetrieved,
  zoneTranType,
  dataRefetch,
}) => {
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { authState } = useContext(AuthContext);
  const [formData, setFormData] = useState({});
  const [openForm15GH, setOpenForm15GH] = useState(false);
  const [fetchData, setFetchData] = useState(false);
  const customerIdRef: any = useRef([]);
  const isDataChangedRef = useRef(false);
  const okButtonRef = useRef<any>(null);
  const { t } = useTranslation();

  const {
    data: initialData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery(["getFinDate"], () => API.getFinDate());

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getFinDate"]);
    };
  }, []);

  const retrieveDataMutation = useMutation(
    () =>
      API.getEntry15GHRetrieveData({
        BRANCH_CD: authState?.user?.branchCode ?? "",
        COMP_CD: authState?.companyID ?? "",
        TRAN_TYPE: initialData?.[0]?.TRAN_TYPE,
        CUSTOMER_ID: customerIdRef?.current?.A_CUSTOM_USER_NM,
        FROM_DT: isValidDate(customerIdRef?.current?.FROM_DT)
          ? format(new Date(customerIdRef?.current?.FROM_DT), "dd-MMM-yyyy") ??
            ""
          : format(new Date(), "dd-MMM-yyyy"),
        TO_DT: isValidDate(customerIdRef?.current?.TO_DT)
          ? format(new Date(customerIdRef?.current?.TO_DT), "dd-MMM-yyyy") ?? ""
          : format(new Date(), "dd-MMM-yyyy"),
      }),
    {
      onError: (error: any) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
        closeDialog();
      },
      onSuccess: (retrieveData) => {
        if (retrieveData?.length === 1) {
          setOpenForm15GH(true);
          setFormData(retrieveData[0]);
        } else if (retrieveData?.length > 1) {
          closeDialog();
          onDataRetrieved(retrieveData);
        } else {
          MessageBox({
            messageTitle: "Alert",
            message: "NoRecordFound",
            buttonNames: ["Ok"],
          });
          closeDialog();
        }
      },
    }
  );

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData: any,
    endSubmit,
    setFieldError
  ) => {
    endSubmit(true);
    if (data?.A_CUSTOM_USER_NM && data?.FROM_DT && data?.TO_DT) {
      customerIdRef.current = data;
      setFetchData(true);
      await retrieveDataMutation.mutate();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (okButtonRef.current) {
        okButtonRef.current.click?.();
      }
    }
  };

  return (
    <>
      {isLoading || isFetching ? (
        <div style={{ width: "600px", height: "100px" }}>
          <LoaderPaperComponent />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            padding: "10px",
          }}
          onKeyDown={handleKeyDown}
        >
          {isError && (
            <div style={{ marginBottom: "10px" }}>
              <AppBar position="relative" color="primary">
                <Alert
                  severity="error"
                  // @ts-ignore
                  errorMsg={error.error_msg ?? "Something went wrong.."}
                  // @ts-ignore
                  errorDetail={error?.error_detail}
                  color="error"
                />
              </AppBar>
            </div>
          )}
          <FormWrapper
            key={"retrievalParameterForm" + initialData}
            metaData={RetrievalParameterFormMetaData as MetaDataType}
            initialValues={{
              FROM_DT: initialData?.[0]?.FROM_DT,
              TO_DT: initialData?.[0]?.TO_DT,
            }}
            onSubmitHandler={onSubmitHandler}
            isLoading={true}
            //@ts-ignore
            formStyle={{
              background: "white",
            }}
            controlsAtBottom={true}
            containerstyle={{ padding: "10px" }}
          >
            {({ isSubmitting, handleSubmit }) => (
              <>
                <GradientButton
                  onClick={(event) => {
                    handleSubmit(event, "Save");
                  }}
                  disabled={isSubmitting}
                  endIcon={
                    retrieveDataMutation?.isLoading ? (
                      <CircularProgress size={20} />
                    ) : null
                  }
                  color={"primary"}
                  ref={okButtonRef}
                >
                  {t("Ok")}
                </GradientButton>
                <GradientButton onClick={closeDialog} color={"primary"}>
                  {t("Close")}
                </GradientButton>
              </>
            )}
          </FormWrapper>
        </div>
      )}

      {openForm15GH && (
        <Form15GHEntryWrapper
          isDataChangedRef={isDataChangedRef}
          closeDialog={closeDialog}
          defaultView="view"
          zoneTranType={zoneTranType}
          formData={formData}
          dataRefetch={dataRefetch}
        />
      )}
    </>
  );
};

export const RetrievalParametersFormWrapper = ({
  closeDialog,
  onDataRetrieved,
  zoneTranType,
  dataRefetch,
}) => {
  return (
    <Dialog
      open={true}
      PaperProps={{
        style: {
          width: "100%",
          overflow: "auto",
        },
      }}
      maxWidth="sm"
    >
      <RetrievalParameters
        closeDialog={closeDialog}
        onDataRetrieved={onDataRetrieved}
        zoneTranType={zoneTranType}
        dataRefetch={dataRefetch}
      />
    </Dialog>
  );
};
