import { Button, CircularProgress, Dialog } from "@mui/material";
import { FormWrapper } from "components/dyanmicForm/formWrapper";
import React from "react";
import { PassbookStatement } from "./metaData";
import { MetaDataType } from "components/dyanmicForm";
import { GradientButton } from "components/styledComponent/button";
import { InitialValuesType } from "packages/form";

export const ViewStatement = ({ open, onClose, rowsData }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={true}
      PaperProps={{
        style: {
          maxWidth: "700px",
        },
      }}
    >
      <FormWrapper
        key={`ViewStatement`}
        metaData={PassbookStatement as MetaDataType}
        initialValues={rowsData?.[0]?.data as InitialValuesType}
        //   onSubmitHandler={onSubmitHandler}
        //   displayMode={formMode}
        formStyle={{
          background: "white",
        }}
        controlsAtBottom={true}
      >
        {({ isSubmitting, handleSubmit }) => (
          <>
            <GradientButton
              style={{ marginRight: "5px" }}
              onClick={(event) => {
                handleSubmit(event, "Save");
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
