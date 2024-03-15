import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Dialog from "@mui/material/Dialog";
import { GradientButton } from "components/styledComponent/button";
import * as API from "../api";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { chequesignFormMetaData, positivePayFormMetaData } from "./metaData";
import { format } from "date-fns";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { Alert } from "components/common/alert";
import { ChequeSignImage } from "./chequeSignImage";

export const PositivePayFormWrapper: FC<{
  onClose?: any;
  positiveData?: any;
}> = ({ onClose, positiveData }) => {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getPositivePayData", { ...positiveData }], () =>
    API.getPositivePayData({
      COMP_CD: positiveData?.COMP_CD,
      BRANCH_CD: positiveData?.BRANCH_CD,
      ACCT_TYPE: positiveData?.ACCT_TYPE,
      ACCT_CD: positiveData?.ACCT_CD,
      CHEQUE_NO: positiveData?.CHEQUE_NO,
    })
  );
  // console.log("???positiveData", positiveData);
  // console.log("???data", data);
  return (
    <>
      <Dialog
        fullWidth
        maxWidth="md"
        open={true} // Assuming this is controlled by a state
        key="positivePayDialog"
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
            key={`positivePayForm`}
            metaData={positivePayFormMetaData as unknown as MetaDataType}
            initialValues={data?.[0]}
            onSubmitHandler={{}}
            formStyle={{
              background: "white",
            }}
            displayMode={"view"}
          >
            {({ isSubmitting, handleSubmit }) => (
              <>
                <GradientButton onClick={onClose}>Close</GradientButton>
              </>
            )}
          </FormWrapper>
        </>
        {/* )} */}
      </Dialog>
    </>
  );
};
