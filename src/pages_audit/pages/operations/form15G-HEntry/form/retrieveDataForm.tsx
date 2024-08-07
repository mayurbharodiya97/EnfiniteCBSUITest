import { AppBar, CircularProgress, Dialog } from "@mui/material";
import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { AuthContext } from "pages_audit/auth";
import { useMutation, useQueries, useQuery } from "react-query";
import * as API from "../api";
import { enqueueSnackbar } from "notistack";
import { RetrievalParameterFormMetaData } from "../form/metaData";
import { format } from "date-fns";
import { Form15GHEntryWrapper } from "../form";
import { useTranslation } from "react-i18next";
import {
  queryClient,
  Alert,
  usePopupContext,
  LoaderPaperComponent,
  SubmitFnType,
  GradientButton,
  FormWrapper,
  MetaDataType,
  utilFunction,
} from "@acuteinfo/common-base";
export const RetrievalParameters = ({ closeDialog, onDataRetrieved }) => {
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { authState } = useContext(AuthContext);
  const [retrieveData, setRetrieveData] = useState({});
  const [openForm15GH, setOpenForm15GH] = useState(false);
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
        TRAN_TYPE: initialData?.[0]?.TRAN_TYPE ?? "",
        CUSTOMER_ID: customerIdRef?.current?.A_CUSTOM_USER_NM ?? "",
        FROM_DT: utilFunction.isValidDate(customerIdRef?.current?.FROM_DT)
          ? format(new Date(customerIdRef?.current?.FROM_DT), "dd/MMM/yyyy")
          : format(new Date(), "dd/MMM/yyyy") ?? "",
        TO_DT: utilFunction.isValidDate(customerIdRef?.current?.TO_DT)
          ? format(new Date(customerIdRef?.current?.TO_DT), "dd/MMM/yyyy")
          : format(new Date(), "dd/MMM/yyyy") ?? "",
      }),
    {
      onError: (error: any) => {
        let errorMsg = "Unknown Error occurred";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
        closeDialog();
      },
      onSuccess: (data: any) => {
        if (data.length === 1) {
          setOpenForm15GH(true);
          setRetrieveData(data[0]);
        } else if (data.length > 1) {
          closeDialog();
          onDataRetrieved(data);
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
      retrieveDataMutation.mutate();
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
            // isLoading={true}
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
          retrieveData={retrieveData}
        />
      )}
    </>
  );
};

export const RetrievalParametersFormWrapper = ({
  closeDialog,
  onDataRetrieved,
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
      />
    </Dialog>
  );
};
