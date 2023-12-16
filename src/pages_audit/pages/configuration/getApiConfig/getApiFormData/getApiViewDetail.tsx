import React from "react";

import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { getApiViewDetailMetadata } from "./getApiiFormMetadata";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Dialog } from "@mui/material";
import { SubmitFnType } from "packages/form";
export const GetApiViewDetail = () => {
  const { state: data }: any = useLocation();
  const navigate = useNavigate();
  console.log("<<<stst", data);
  const onSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    value
  ) => {
    console.log("<<<sun", data);
    navigate("/cbsenfinity/configuration/get-api-config");
    //@ts-ignore
    endSubmit(true);
  };
  return (
    <>
      <Dialog
        open={true}
        fullWidth={true}
        PaperProps={{
          style: {
            maxWidth: "1150px",
          },
        }}
        // maxWidth="lg"
      >
        <FormWrapper
          key={`MerchantOnboardConfig`}
          metaData={getApiViewDetailMetadata as MetaDataType}
          initialValues={data ?? []}
          onSubmitHandler={onSubmitHandler}
          formStyle={{
            background: "white",
            height: "calc(100vh - 170px)",
            overflowY: "auto",
            overflowX: "hidden",
          }}
          // loading={mutation.isLoading}
          hideHeader={false}
          // onFormButtonCicular={mutation.isLoading}
          // ref={formRef}
        >
          {({ isSubmitting, handleSubmit }) => (
            <>
              <Button
                onClick={(event) => {
                  handleSubmit(event, "Close");
                }}
                disabled={isSubmitting}
                //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                color={"primary"}
              >
                Close
              </Button>
            </>
          )}
        </FormWrapper>
      </Dialog>
    </>
  );
};
