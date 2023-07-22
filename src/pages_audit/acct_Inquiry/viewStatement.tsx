import { Button, CircularProgress, Dialog } from "@mui/material";
import { FormWrapper } from "components/dyanmicForm/formWrapper";
import React, { useEffect, useState } from "react";
import { PassbookStatement, PassbookStatementInq } from "./metaData";
import { MetaDataType } from "components/dyanmicForm";
import { GradientButton } from "components/styledComponent/button";
import { InitialValuesType, SubmitFnType } from "packages/form";
import { id } from "date-fns/locale";
// import { CreateForm } from "pages_audit/pages/STATEMENT/formComponent";
export const ViewStatement = ({ open, onClose, rowsData, screenFlag }) => {
  const [count, setCount] = useState<any>(1);
  // const [update, setUpdate] = useState(count);

  const onSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    endSubmit(true);
    // Assuming you have rowsData available somewhere in your code

    // Additional data you want to store
    if (screenFlag === "ACCT_INQ") {
      const combinedData = { ...rowsData, ...data };
      const dataString = JSON.stringify(combinedData);
      sessionStorage.setItem("myData", dataString);
      const newWindow = window.open("./view-statement", "_blank");
      if (newWindow) {
        newWindow.focus();
      }
    } else {
      if (Boolean(data?.ACCT_TYPE)) {
      }
    }
  };

  let finalMetadata: any = null;
  if (screenFlag === "STATEMENT") {
    finalMetadata = PassbookStatement as MetaDataType;
  } else if (screenFlag === "ACCT_INQ") {
    finalMetadata = PassbookStatementInq as MetaDataType;
  }
  // useEffect(() => {
  //   return setCount({ count: 4 });
  // }, [count]);
  return (
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
        initialValues={rowsData?.[0]?.data as InitialValuesType}
        onSubmitHandler={onSubmitHandler}
        // displayMode={formMode}

        formStyle={{
          background: "white",
        }}
        controlsAtBottom={true}
        onFormButtonClickHandel={(id) => {
          PassbookStatementInq.fields[6].isReadOnly = false;
          setCount({ count: 3 });
        }}
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
              onClick={() => onClose()}
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
};
