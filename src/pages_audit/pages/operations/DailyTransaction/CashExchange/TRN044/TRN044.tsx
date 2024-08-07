import { Button, Card } from "@mui/material";
import React from "react";
import { cashEntryMetaData } from "./metadata";
import { InitialValuesType, SubmitFnType } from "@acuteinfo/common-base";
import {
  GradientButton,
  MetaDataType,
  FormWrapper,
} from "@acuteinfo/common-base";
import { ArrFieldMetaData044 } from "./arrMetaData044";

const TRN044 = () => {
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
      <h3>Exchange (Cashier) Entry (TRN/044)</h3>

      <FormWrapper
        key={`cashEntryMetaData`}
        metaData={cashEntryMetaData as MetaDataType}
        onSubmitHandler={onSubmitHandler}
        // hideHeader={true}
        initialValues={{}}
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
      <br />

      <FormWrapper
        key={"ArrFieldMetaData044"}
        metaData={ArrFieldMetaData044 as unknown as MetaDataType}
        onSubmitHandler={onSubmitHandler}
        formStyle={{
          background: "white",
        }}
        // displayMode={formMode}
        // initialValues={{
        //   ...(reqData?.[0]?.data ?? {}),
        //   ...updatedReqData,
        // }}
        // hideHeader={true}
      >
        {({ isSubmitting, handleSubmit }) => (
          <>
            <>
              <GradientButton
                onClick={(event) => {
                  handleSubmit(event, "Save");
                }}
                disabled={isSubmitting}
                //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                color={"primary"}
              >
                Save
              </GradientButton>

              <GradientButton
                // onClick={closeDialog}
                //disabled={isSubmitting}
                color={"primary"}
              >
                Close
              </GradientButton>
            </>
          </>
        )}
      </FormWrapper>
    </Card>
  );
};

export default TRN044;
