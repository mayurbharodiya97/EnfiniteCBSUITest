import React from "react";
import FormWrapper from "components/dyanmicForm";
import { cashEntryMetaData } from "./metadata";
import { InitialValuesType, SubmitFnType } from "packages/form";

import { Button, Card } from "@mui/material";
const TRN043 = () => {
  const onSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    console.log("save");
    endSubmit(true);
  };

  return (
    <Card
      sx={{
        boxShadow: "0px 1px 4px -1px #999999",
        borderRadius: "5px",
        padding: "8px",
        margin: "4px",
      }}
    >
      <h3>Exchange (Customer) (TRN/043)</h3>

      <FormWrapper
        key={`cashEntryMetaData`}
        metaData={cashEntryMetaData}
        onSubmitHandler={onSubmitHandler}
        // hideHeader={true}
        formStyle={{
          background: "white",
        }}
      >
        {({ isSubmitting, handleSubmit }) => (
          <>
            <Button
              onClick={(event) => {
                handleSubmit(event, "Save");
              }}
              disabled={isSubmitting}
              //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              color={"primary"}
            >
              Ok
            </Button>
            <Button
              // onClick={closeDialog}
              color={"primary"}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </>
        )}
      </FormWrapper>
    </Card>
  );
};

export default TRN043;
