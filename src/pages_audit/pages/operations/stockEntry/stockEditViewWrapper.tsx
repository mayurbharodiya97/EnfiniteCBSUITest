import { Button, Dialog } from "@mui/material";
import React from "react";

import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { stockViewEditFormMetaData } from "./stockEditViewMetadata";
import { useLocation } from "react-router-dom";

export const StockEditViewWrapper = ({ ClosedEventCall }) => {
  const { state: rows }: any = useLocation();

  console.log("<<<rows", rows);
  return (
    <Dialog
      open={true}
      fullWidth={true}
      PaperProps={{
        style: {
          maxWidth: "1150px",
        },
      }}
    >
      <>
        <FormWrapper
          key={"stockEntry"}
          metaData={stockViewEditFormMetaData ?? []}
          initialValues={rows?.[0]?.data ?? []}
          displayMode={"view"}

          // onSubmitHandler={onSubmitHandler}
          // loading={mutation.isLoading}
        >
          {({ isSubmitting, handleSubmit }) => (
            <>
              <Button
                onClick={(event) => {
                  ClosedEventCall();
                }}
                // disabled={isSubmitting}
                //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                color={"primary"}
              >
                Close
              </Button>
            </>
          )}
        </FormWrapper>
      </>
    </Dialog>
  );
};
