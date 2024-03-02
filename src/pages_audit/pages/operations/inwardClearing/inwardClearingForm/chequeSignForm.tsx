import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Dialog from "@mui/material/Dialog";
import { GradientButton } from "components/styledComponent/button";
import * as API from "../api";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { chequesignFormMetaData } from "./metaData";
import { format } from "date-fns";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { Alert } from "components/common/alert";
import { ChequeSignImage } from "./chequeSignImage";

export const ChequeSignForm: FC<{
  onClose?: any;
  reqDataRef?: any;
}> = ({ onClose, reqDataRef }) => {
  const [rotate, setRotate] = useState<number>(0);

  const handleRotateChange = () => {
    // Calculate the new rotation angle by adding or subtracting 90 degrees
    const newRotateValue = (rotate + 90) % 360;
    setRotate(newRotateValue);
  };

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
    WITH_SIGN: "Y",
    ENTERED_BY: reqDataRef.current?.ENTERED_BY ?? "",
  };
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getInwardChequeSignFormData", { reqData }], () =>
    API.getInwardChequeSignFormData(reqData)
  );

  if (chequesignFormMetaData.form.label) {
    chequesignFormMetaData.form.label =
      "A/C No:-" +
      " " +
      reqDataRef.current?.BRANCH_CD +
      "-" +
      reqDataRef.current?.ACCT_TYPE +
      "-" +
      reqDataRef.current?.ACCT_CD +
      "--" +
      " " +
      "Press ESC Key to Close" +
      " - " +
      "Customer Level Photo/Signature" +
      " ";
  }

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
            // height: "78%",
            // height: "70%",
          },
        }}
      >
        {/* {isLoading || isFetching ? (
          <LoaderPaperComponent />
        ) : isError ? (
          <Alert
            severity={error?.severity ?? "error"}
            errorMsg={error?.error_msg ?? "Error"}
            errorDetail={error?.error_detail ?? ""}
          />
        ) : ( */}
        <>
          <FormWrapper
            key={`chequeSignForm`}
            metaData={chequesignFormMetaData as unknown as MetaDataType}
            initialValues={reqDataRef.current}
            onSubmitHandler={{}}
            formStyle={{
              background: "white",
            }}
            displayMode={"view"}
          >
            {({ isSubmitting, handleSubmit }) => (
              <>
                <GradientButton onClick={handleRotateChange}>
                  {rotate === 0 ? "Rotate" : "Reset"}
                </GradientButton>
                <GradientButton onClick={onClose}>Close</GradientButton>
              </>
            )}
          </FormWrapper>
          <ChequeSignImage imgData={data} rotate={rotate} />
        </>
        {/* )} */}
      </Dialog>
    </>
  );
};
