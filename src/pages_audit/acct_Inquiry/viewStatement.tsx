import { Button, CircularProgress, Dialog } from "@mui/material";
import { FormWrapper } from "components/dyanmicForm/formWrapper";
import React, { useContext, useEffect, useRef, useState } from "react";
import { PassbookStatement, PassbookStatementInq } from "./metaData";
import { MetaDataType } from "components/dyanmicForm";
import { GradientButton } from "components/styledComponent/button";
import { InitialValuesType, SubmitFnType } from "packages/form";
import { id } from "date-fns/locale";
import { useQuery } from "react-query";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import { queryClient } from "cache";
import { LoaderPaperComponent } from "components/common/loaderPaper";
// import { CreateForm } from "pages_audit/pages/STATEMENT/formComponent";
export const ViewStatement = ({ open, onClose, rowsData, screenFlag }) => {
  const formRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const acctInqData: any = useQuery<any, any, any>(
    ["getAcctInqStatement", { rowsData, COMP_CD: authState.companyID }],
    () =>
      API.getAcctInqStatement({
        rowsData,
        COMP_CD: authState.companyID,
        workingDate: authState?.workingDate,
        screenFlag: screenFlag,
        FULL_ACCT_NO: "",
      })
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries([
        "getAcctInqStatement",
        {
          rowsData,
          COMP_CD: authState.companyID,
          workingDate: authState?.workingDate,
        },
      ]);
    };
  }, []);

  const handleClose = () => {
    onClose();
  };
  const onSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    // onClose();
    endSubmit(true);
    if (screenFlag === "ACCT_INQ") {
      const combinedData = { ...rowsData?.[0]?.data, ...data };
      const dataString = JSON.stringify(combinedData);
      sessionStorage.setItem("myData", dataString);
      const newWindow = window.open("./view-statement", "_blank");
      if (newWindow) {
        newWindow.focus();
      }
    } else {
      const dataString = JSON.stringify(data);
      sessionStorage.setItem("myData", dataString);
      window.location.reload();
    }
    handleClose();
  };

  let finalMetadata: any = null;
  if (screenFlag === "STATEMENT") {
    finalMetadata = PassbookStatement as MetaDataType;
  } else if (screenFlag === "ACCT_INQ") {
    finalMetadata = PassbookStatementInq as MetaDataType;
  }

  const renderResult =
    screenFlag === "ACCT_INQ" && acctInqData.isLoading ? (
      <LoaderPaperComponent />
    ) : (
      <Dialog
        open={open}
        onClose={onClose}
        // fullWidth={true}
        // PaperProps={{
        //   style: {
        //     maxWidth: "700px",
        //   },
        // }}
        maxWidth={"sm"}
      >
        <FormWrapper
          key={`ViewStatement`}
          metaData={finalMetadata}
          initialValues={acctInqData?.data?.[0] as InitialValuesType}
          onSubmitHandler={onSubmitHandler}
          // displayMode={formMode}
          loading={acctInqData.isLoading}
          formStyle={{
            background: "white",
          }}
          controlsAtBottom={true}
          onFormButtonClickHandel={(id) => {
            PassbookStatementInq.fields[6].isReadOnly = false;
          }}
          ref={formRef}
        >
          {({ isSubmitting, handleSubmit }) => (
            <>
              <GradientButton
                style={{ marginRight: "5px" }}
                onClick={(event) => {
                  handleSubmit(event, "Save");
                }}
                // disabled={isSubmitting}
                // endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                color={"primary"}
              >
                Ok
              </GradientButton>
              <GradientButton
                onClick={handleClose}
                color={"primary"}
                // disabled={isSubmitting}
              >
                Close
              </GradientButton>
            </>
          )}
        </FormWrapper>
      </Dialog>
    );
  return renderResult;
};
