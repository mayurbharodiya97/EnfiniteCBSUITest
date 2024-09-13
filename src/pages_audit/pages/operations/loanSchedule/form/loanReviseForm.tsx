import { AppBar, Dialog } from "@mui/material";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { GradientButton } from "components/styledComponent/button";
import { SubmitFnType } from "packages/form";
import { useLocation } from "react-router-dom";
import { LoanRescheduleFormMetaData, LoanReviseMetaData } from "./metadata";
import { t } from "i18next";
import { MasterDetailsForm } from "components/formcomponent";
import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";
import { useMutation } from "react-query";
import { enqueueSnackbar } from "notistack";
import { updateInterestRate } from "../api";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { Alert } from "components/common/alert";
import { queryClient } from "cache";

export const LoanReviseForm = ({
  isDataChangedRef,
  closeDialog,
  reviseData,
}) => {
  const onSubmitHandler = async ({
    data,
    displayData,
    resultValueObj,
    resultDisplayValueObj,
    endSubmit,
    setFieldError,
    actionFlag,
  }) => {
    //@ts-ignore
    endSubmit(true);
  };

  return (
    <>
      <MasterDetailsForm
        key={"loanReviseForm"}
        metaData={LoanReviseMetaData as MasterDetailsMetaData}
        initialData={{
          ...reviseData,
          DETAILS_DATA: [],
        }}
        // isLoading={updateInterestRateMutation?.isLoading}
        onSubmitData={onSubmitHandler}
        formStyle={{
          background: "white",
          overflowY: "auto",
          overflowX: "hidden",
        }}
        containerstyle={{ padding: "10px" }}
        formState={{}}
        setDataOnFieldChange={(action, payload) => {
          console.log("payload", action, payload);

          if (action === "GRID_DATA") {
            // const updatedData = payload.map((item) => ({
            //   ...item,
            //   FIN_INT_AMT: Number(item?.FIN_INT_AMT ?? 0).toFixed(2),
            // }));
          }
        }}
      >
        {({ isSubmitting, handleSubmit }) => (
          <>
            <GradientButton
              onClick={(event) => {
                handleSubmit(event, "Save");
              }}
              color={"primary"}
            >
              {t("Save")}
            </GradientButton>
            <GradientButton onClick={closeDialog} color={"primary"}>
              {t("Cancel")}
            </GradientButton>
          </>
        )}
      </MasterDetailsForm>
    </>
  );
};

export const LoanReviseFormWrapper = ({
  isDataChangedRef,
  closeDialog,
  reviseData,
}) => {
  return (
    <Dialog
      open={true}
      PaperProps={{
        style: {
          width: "100%",
          overflow: "auto",
          height: "auto",
        },
      }}
      maxWidth="xl"
    >
      <LoanReviseForm
        isDataChangedRef={isDataChangedRef}
        closeDialog={closeDialog}
        reviseData={reviseData}
      />
    </Dialog>
  );
};
