import { Button, CircularProgress, Dialog } from "@mui/material";
import { FormWrapper } from "components/dyanmicForm/formWrapper";
import React, { useEffect, useState } from "react";
import { PassbookStatement } from "./metaData";
import { MetaDataType } from "components/dyanmicForm";
import { GradientButton } from "components/styledComponent/button";
import { InitialValuesType } from "packages/form";

export const ViewStatement = ({ open, onClose, rowsData }) => {
  const [count, setCount] = useState<any>(1);
  // const [update, setUpdate] = useState(count);
  const handleStatementClick = () => {
    const newWindow = window.open("./view-statement", "_blank");
    if (newWindow) {
      newWindow.focus();
    }
  };
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
        key={`ViewStatement` + count}
        metaData={PassbookStatement as MetaDataType}
        initialValues={rowsData?.[0]?.data as InitialValuesType}
        //   onSubmitHandler={onSubmitHandler}
        //   displayMode={formMode}
        formStyle={{
          background: "white",
        }}
        controlsAtBottom={true}
        onFormButtonClickHandel={(id) => {
          PassbookStatement.fields[6].isReadOnly = false;
          setCount({ count: 3 });
        }}
      >
        {({ isSubmitting, handleSubmit }) => (
          <>
            <GradientButton
              style={{ marginRight: "5px" }}
              onClick={(event) => {
                handleSubmit(event, "Save");
                handleStatementClick();
              }}
              disabled={isSubmitting}
              endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
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
