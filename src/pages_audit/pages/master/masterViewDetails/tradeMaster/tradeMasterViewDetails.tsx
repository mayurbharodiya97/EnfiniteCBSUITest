import { Button, Dialog } from "@mui/material";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { useDialogStyles } from "components/detailPopupGridData";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useSnackbar } from "notistack";
import { FC, useContext, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { InitialValuesType, SubmitFnType } from "packages/form";
import { TradeMasterMetaData } from "./metaData";
import { Transition } from "pages_audit/common";
import { extractMetaData, utilFunction } from "components/utils";
import { useMutation } from "react-query";
import * as API from "../api";
import { AuthContext } from "pages_audit/auth";
import { format } from "date-fns";
import { StringtoUnicode } from "components/utils";

export const TradeMasterViewDetails: FC<{
  isDataChangedRef: any;
  closeDialog?: any;
  formView?: string;
}> = ({ isDataChangedRef, closeDialog, formView }) => {
  const classes = useDialogStyles();
  const { state: rows }: any = useLocation();

  return (
    <>
      <Dialog
        open={true}
        //@ts-ignore
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            width: "50%",
            height: "50%",
          },
        }}
        maxWidth="lg"
        classes={{
          scrollPaper: classes.topScrollPaper,
          paperScrollBody: classes.topPaperScrollBody,
        }}
      >
        <FormWrapper
          key={`TradeMasterMetaData`}
          // metaData={TradeMasterMetaData as MetaDataType}
          metaData={
            extractMetaData(
              TradeMasterMetaData,
              formView === "add" ? "new" : "edit"
            ) as MetaDataType
          }
          initialValues={rows?.[0]?.data as InitialValuesType}
          //   onSubmitHandler={onSubmitHandler}
          displayMode={formView}
          formStyle={{
            background: "white",
          }}
          // controlsAtBottom={true}
        >
          {({ isSubmitting, handleSubmit }) => (
            <>
              <Button
                onClick={(event) => {
                  handleSubmit(event, "Save");
                }}
                // disabled={isSubmitting}
                //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                color={"primary"}
              >
                Save
              </Button>
              <Button
                onClick={closeDialog}
                color={"primary"}
                // disabled={isSubmitting}
              >
                Close
              </Button>
            </>
          )}
        </FormWrapper>
        {/* {isOpenSave ? (
          <PopupMessageAPIWrapper
            MessageTitle="Confirmation"
            Message="Do you want to save this Record?"
            onActionYes={(rowVal) => rowVal}
            onActionNo={() => {}}
            rows={isErrorFuncRef.current?.data}
            open={isOpenSave}
            loading={undefined}
          />
        ) : null} */}
      </Dialog>
    </>
  );
};
