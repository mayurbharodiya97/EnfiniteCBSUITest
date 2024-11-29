import { FC } from "react";
import { useQuery } from "react-query";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Dialog from "@mui/material/Dialog";
import * as API from "../api";
import { chequesignFormMetaData } from "./metaData";
import { format } from "date-fns";
import { ChequeSignImage } from "./chequeSignImage";
import { LoaderPaperComponent, GradientButton } from "@acuteinfo/common-base";
import { Alert, FormWrapper, MetaDataType } from "@acuteinfo/common-base";
import { useTranslation } from "react-i18next";

export const ChequeSignForm: FC<{
  onClose?: any;
  reqDataRef?: any;
}> = ({ onClose, reqDataRef }) => {
  const { t } = useTranslation();
  const reqData = {
    COMP_CD: reqDataRef.current?.COMP_CD ?? "",
    ENTERED_COMP_CD: reqDataRef.current?.ENTERED_COMP_CD ?? "",
    ENTERED_BRANCH_CD: reqDataRef.current?.ENTERED_BRANCH_CD ?? "",
    BRANCH_CD: reqDataRef.current?.BRANCH_CD ?? "",
    ACCT_TYPE: reqDataRef.current?.ACCT_TYPE ?? "",
    ACCT_CD: reqDataRef.current?.ACCT_CD ?? "",
    DAILY_TRN_CD: reqDataRef.current?.DAILY_TRN_CD ?? "",
    TRAN_CD: reqDataRef.current?.TRAN_CD ?? "",
    TRAN_DT: format(new Date(reqDataRef.current?.TRAN_DT), "dd/MMM/yyyy") ?? "",
    TRAN_FLAG: "E",
    WITH_SIGN: reqDataRef?.current?.WITH_SIGN ?? "",
    ENTERED_BY: reqDataRef.current?.ENTERED_BY ?? "",
  };
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getInwardChequeSignFormData", { reqData }], () =>
    API.getInwardChequeSignFormData(reqData)
  );

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="lg"
        open={true} // Assuming this is controlled by a state
        onKeyUp={(event) => {
          if (event.key === "Escape") {
            onClose();
          }
        }}
        key="chequeSignDialog"
        PaperProps={{
          style: {
            width: "100%",
          },
        }}
      >
        <FormWrapper
          key={`chequeSignForm`}
          metaData={chequesignFormMetaData as unknown as MetaDataType}
          initialValues={reqDataRef.current}
          onSubmitHandler={() => {}}
          formStyle={{
            background: "white",
          }}
          displayMode={"view"}
        >
          {({ isSubmitting, handleSubmit }) => (
            <>
              <GradientButton onClick={onClose}>{t("Close")}</GradientButton>
            </>
          )}
        </FormWrapper>
        {isLoading || isFetching ? (
          <LoaderPaperComponent />
        ) : isError ? (
          <Alert
            severity={error?.severity ?? "error"}
            errorMsg={error?.error_msg ?? "Error"}
            errorDetail={error?.error_detail ?? ""}
          />
        ) : (
          <>
            <ChequeSignImage imgData={data} formData={reqDataRef.current} />
          </>
        )}
      </Dialog>
    </>
  );
};
