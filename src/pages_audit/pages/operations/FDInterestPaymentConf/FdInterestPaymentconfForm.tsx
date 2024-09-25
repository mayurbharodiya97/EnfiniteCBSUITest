import { Dialog } from "@mui/material";
import { AuthContext } from "pages_audit/auth";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { updateFDInterestPayment } from "../FDInterestPayment/api";
import * as API from "./api";
import { FdInterestPaymentconfFormMetaData } from "./FdInterestPaymentConfmMetaData";
import {
  LoaderPaperComponent,
  FormWrapper,
  MetaDataType,
  SubmitFnType,
  GradientButton,
  Transition,
  usePopupContext,
  queryClient,
} from "@acuteinfo/common-base";
const FdInterestPaymentconfForm = ({
  closeDialog,
  fdDetails,
  loader,
  rowsData,
}) => {
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { t } = useTranslation();

  const deleteFDInterestPaymentEntry: any = useMutation(
    "updateFDInterestPayment",
    updateFDInterestPayment,
    {
      onSuccess: async (data) => {
        const btnName = await MessageBox({
          messageTitle: "Success",
          message: "RecordReject",
          buttonNames: ["Ok"],
          icon: "SUCCESS",
        });
        queryClient.invalidateQueries(["getFDPaymentInstruConfAcctDtl"]);
        CloseMessageBox();
        closeDialog();
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
  const doFDPaymentInstruEntryConfm: any = useMutation(
    "doFDPaymentInstruEntryConfm",
    API.doFDPaymentInstruEntryConfm,
    {
      onSuccess: async (data) => {
        const btnName = await MessageBox({
          messageTitle: "Success",
          message: "RecordSave",
          buttonNames: ["Ok"],
          icon: "SUCCESS",
        });
        CloseMessageBox();
        closeDialog();
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
    setFieldError,
    actionFlag
  ) => {
    if (actionFlag === "Confirm") {
      if (authState?.user?.id === rowsData?.[0]?.data?.LAST_ENTERED_BY) {
        const btnName = await MessageBox({
          messageTitle: "InvalidConfirmation",
          message: "ConfirmRestrictMsg",
          icon: "ERROR",
        });
      } else {
        const btnName = await MessageBox({
          messageTitle: "Confirmation",
          message: "ConfirmMsg",
          buttonNames: ["Yes", "No"],
          loadingBtnName: ["Yes"],
        });
        if (btnName === "Yes") {
          doFDPaymentInstruEntryConfm.mutate({
            DETAILS_DATA: {
              isNewRow: [],
              isDeleteRow: [],
              isUpdateRow: fdDetails,
            },
          });
        }
      }
    } else if (actionFlag === "Reject") {
      const btnName = await MessageBox({
        messageTitle: "Confirmation",
        message: "ConfirmReject",
        buttonNames: ["Yes", "No"],
        loadingBtnName: ["Yes"],
      });
      if (btnName === "Yes") {
        deleteFDInterestPaymentEntry.mutate({
          DETAILS_DATA: {
            isDeleteRow: fdDetails,
            isUpdatedRow: [],
            isNewRow: [],
          },
        });
      }
    }
    endSubmit(true);
  };

  return (
    <>
      {loader ? (
        <LoaderPaperComponent />
      ) : Array.isArray(fdDetails) && fdDetails.length > 0 ? (
        <FormWrapper
          key={"FdInterestPaymentConfmMetaData"}
          metaData={FdInterestPaymentconfFormMetaData as MetaDataType}
          onSubmitHandler={onSubmitHandler}
          initialValues={{
            FDINTPAYDTL: fdDetails,
            TOTAL_DEPOSIT_AMOUNT: fdDetails.reduce(
              (acc, item) => acc + (Number(item.TOT_AMT) || 0),
              0
            ),
            TOTAL_MATURITY_AMOUNT: fdDetails.reduce(
              (acc, item) => acc + (Number(item.MATURITY_AMT) || 0),
              0
            ),
          }}
          displayMode={"view"}
          formStyle={{
            background: "white",
            margin: "10px 0",
          }}
        >
          {({ isSubmitting, handleSubmit }) => (
            <>
              <GradientButton
                onClick={(event) => {
                  handleSubmit(event, "Confirm");
                }}
                disabled={rowsData?.[0]?.data?.ALLOW_CONFIRM === "N"}
                color={"primary"}
              >
                {t("Confirm")}
              </GradientButton>
              <GradientButton
                onClick={(event) => {
                  handleSubmit(event, "Reject");
                }}
                color={"primary"}
              >
                {t("Reject")}
              </GradientButton>
              <GradientButton onClick={closeDialog} color={"primary"}>
                {t("Close")}
              </GradientButton>
            </>
          )}
        </FormWrapper>
      ) : null}
    </>
  );
};

export const FdInterestPaymentConfDetail = ({
  closeDialog,
  fdDetails,
  loader,
  rowsData,
}) => {
  return (
    <Dialog
      open={true}
      // @ts-ignore
      TransitionComponent={Transition}
      PaperProps={{
        style: {
          width: "100%",
          overflow: "auto",
        },
      }}
      maxWidth="lg"
    >
      {fdDetails ? (
        <FdInterestPaymentconfForm
          closeDialog={closeDialog}
          fdDetails={fdDetails}
          loader={loader}
          rowsData={rowsData}
        />
      ) : (
        <LoaderPaperComponent />
      )}
    </Dialog>
  );
};
