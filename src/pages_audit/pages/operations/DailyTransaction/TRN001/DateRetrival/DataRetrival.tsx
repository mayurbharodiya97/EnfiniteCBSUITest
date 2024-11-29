import {
  ClearCacheProvider,
  FormWrapper,
  GradientButton,
  MetaDataType,
  usePopupContext,
} from "@acuteinfo/common-base";
import { CircularProgress, Dialog } from "@mui/material";
import { AuthContext } from "pages_audit/auth";
import { useContext, useRef } from "react";
import { useMutation } from "react-query";
import { DateRetrievalFormMetaData } from "./DateRetrivalMetadata";
import { enqueueSnackbar } from "notistack";
import * as API from "./api";
import { format } from "date-fns";

const DateRetrivalCustom = ({
  closeDialog,
  open,
  reqData,
  reportDTL,
  openReport,
}) => {
  const formRef = useRef(null);
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const getInterestCalculateReport = useMutation(
    API.getInterestCalculateReportDTL,
    {
      onSuccess: async (data: any, variables: any) => {
        for (let i = 0; i < data?.[0]?.MSG?.length; i++) {
          if (data?.[0]?.MSG[i]?.O_STATUS === "999") {
            const btnName = await MessageBox({
              messageTitle:
                data?.[0]?.MSG[i]?.O_MSG_TITLE ?? "ValidationFailed",
              message: data?.[0]?.MSG[i]?.O_MESSAGE,
              icon: "ERROR",
            });
          } else if (data?.[0]?.MSG[i]?.O_STATUS === "99") {
            const btnName = await MessageBox({
              messageTitle: data?.[0]?.MSG[i]?.O_MSG_TITLE ?? "Confirmation",
              message: data?.[0]?.MSG[i]?.O_MESSAGE,
              buttonNames: ["Yes", "No"],
              icon: "CONFIRM",
            });
          } else if (data?.[0]?.MSG[i]?.O_STATUS === "9") {
            const btnName = await MessageBox({
              messageTitle: data?.[0]?.MSG[i]?.O_MSG_TITLE ?? "Alert",
              message: data?.[0]?.MSG[i]?.O_MESSAGE,
              icon: "WARNING",
            });
          } else if (data?.[0]?.MSG[i]?.O_STATUS === "0") {
          }
        }
        reportDTL((prevData) => [...prevData, data?.[0]]);
        getHeaderDTL.mutate({ SCREEN_REF: "TRN/001" });
        CloseMessageBox();
      },
      onError: (error: any, variables: any) => {
        enqueueSnackbar(error?.error_msg, {
          variant: "error",
        });
        CloseMessageBox();
      },
    }
  );
  const getHeaderDTL = useMutation(API.getHeaderDTL, {
    onSuccess: async (data: any, variables: any) => {
      reportDTL((prevData) => [...prevData, data?.[0], reqData?.[0]]);
      openReport();
      CloseMessageBox();
    },
    onError: (error: any, variables: any) => {
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
      CloseMessageBox();
    },
  });

  const onSubmitHandler = (data, displayData, endSubmit, setFieldError) => {
    reportDTL((prevData) => [
      ...prevData,

      {
        FROM_DT: data?.FROM_DT
          ? format(new Date(data?.FROM_DT), "dd/MMM/yyyy")
          : "",
        TO_DT: data?.TO_DT ? format(new Date(data?.TO_DT), "dd/MMM/yyyy") : "",
      },
    ]);

    endSubmit(true);

    getInterestCalculateReport.mutate({
      COMP_CD: reqData?.[0]?.branch?.info?.COMP_CD ?? "",
      BRANCH_CD: reqData?.[0]?.branch?.value ?? "",
      ACCT_TYPE: reqData?.[0]?.accType?.value ?? "",
      ACCT_CD: reqData?.[0]?.accNo ?? "",
      WORKING_DATE: authState?.workingDate ?? "",
      USERNAME: authState?.user?.id ?? "",
      USERROLE: authState?.role ?? "",
      FROM_DT: data?.FROM_DT
        ? format(new Date(data?.FROM_DT), "dd/MMM/yyyy")
        : "",
      TO_DT: data?.TO_DT ? format(new Date(data?.TO_DT), "dd/MMM/yyyy") : "",
      PARENT_CODE: reqData?.[0]?.PARENT_CODE ?? "",
      PARENT_TYPE: reqData?.[0]?.PARENT_TYPE ?? "",
      GD_DATE: authState?.workingDate ?? "",
      SCREEN_REF: "TRN/001",
    });
  };

  return (
    <>
      <Dialog
        open={open}
        PaperProps={{
          style: {
            width: "auto",
            overflow: "auto",
          },
        }}
        maxWidth="lg"
      >
        <FormWrapper
          key={"dateretrievalForm"}
          metaData={DateRetrievalFormMetaData as MetaDataType}
          onSubmitHandler={onSubmitHandler}
          formStyle={{
            background: "white",
          }}
          initialValues={reqData?.[0]}
          controlsAtBottom
          containerstyle={{ padding: "10px" }}
          formState={{
            reqData: reqData?.[0],
          }}
        >
          {({ isSubmitting, handleSubmit }) => (
            <>
              <GradientButton
                onClick={handleSubmit}
                endIcon={
                  getInterestCalculateReport?.isLoading ||
                  getHeaderDTL?.isLoading ? (
                    <CircularProgress size={20} />
                  ) : null
                }
                disabled={
                  getInterestCalculateReport?.isLoading ||
                  getHeaderDTL?.isLoading ||
                  isSubmitting
                }
              >
                Ok
              </GradientButton>
              <GradientButton onClick={() => closeDialog()}>
                Cancel
              </GradientButton>
            </>
          )}
        </FormWrapper>
      </Dialog>
    </>
  );
};

type DateRetrivalCustomProps = {
  closeDialog?: any;
  open?: any;
  reqData?: any;
  reportDTL?: any;
  openReport?: any;
};
export const DateRetrival: React.FC<DateRetrivalCustomProps> = ({
  closeDialog,
  open,
  reqData,
  reportDTL,
  openReport,
}) => {
  return (
    <ClearCacheProvider>
      <DateRetrivalCustom
        closeDialog={closeDialog}
        open={open}
        reqData={reqData}
        reportDTL={reportDTL}
        openReport={openReport}
      />
    </ClearCacheProvider>
  );
};
