import { useContext, useRef, useState } from "react";
import FormWrapper from "components/dyanmicForm";
import { SubmitFnType } from "packages/form";
import { useLocation } from "react-router-dom";
import { Dialog } from "@mui/material";
import { AuthContext } from "pages_audit/auth";
import { DeleteDialogMetaData } from "./metaData";
import { GradientButton } from "components/styledComponent/button";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "react-query";
import * as API from "./api";
import { usePopupContext } from "components/custom/popupContext";
import { utilFunction } from "components/utils";


export const DeleteDialog = ({ open, onClose, rowData, siRefetch, mainRefetch }) => {
  const isDeleteDataRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();

  const deleteMutation = useMutation(API.addStandingInstructionTemplate, {
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
      CloseMessageBox();
    },
    onSuccess: (data) => {
      enqueueSnackbar("Records successfully deleted", {
        variant: "success",
      });
      CloseMessageBox();
      onClose();
      siRefetch();
      mainRefetch();
    },
  });
  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData: any,
    endSubmit,
    setFieldError
  ) => {
    // endSubmit(true);

    const { COMP_CD, BRANCH_CD, ENT_COMP_CD, ENT_BRANCH_CD,
      TRAN_CD, SR_CD, LINE_ID, DR_ACCT_TYPE, DR_ACCT_CD, SI_AMOUNT,
      CONFIRMED, CR_ACCT_TYPE, CR_ACCT_CD, ENTERED_BY } = rowData;
    const newData = [];
    const oldData = [rowData]
    let updPara = utilFunction.transformDetailDataForDML(
      oldData ? oldData : [],
      newData ? newData : [],
      ["LINE_ID"]
    );

    isDeleteDataRef.current = {
      data: {
        _isDeleteRow: true,
        COMP_CD: COMP_CD,
        BRANCH_CD: BRANCH_CD,
        ENT_COMP_CD: ENT_COMP_CD,
        ENT_BRANCH_CD: ENT_BRANCH_CD,
        TRAN_CD: TRAN_CD,
        SR_CD: SR_CD,
        LINE_ID: LINE_ID,
        ACCT_TYPE: DR_ACCT_TYPE,
        ACCT_CD: DR_ACCT_CD,
        AMOUNT: SI_AMOUNT,
        CONFIRMED: CONFIRMED,
        CR_ACCT_TYPE: CR_ACCT_TYPE,
        CR_ACCT_CD: CR_ACCT_CD,
        TRAN_DT: authState.workingDate,
        ENTERED_BY: ENTERED_BY,
        USER_DEF_REMARKS: data.USER_DEF_REMARKS,
        ACTIVITY_TYPE: "SI_ENTRY",
        SI_SDT: { ...updPara },
      },
      displayData,
      endSubmit,
      setFieldError,
    }
    // isDeleteDataRef.current = data?.rows?.[0];
    const btnName = await MessageBox({
      message: "DeleteData",
      messageTitle: "Confirmation",
      buttonNames: ["Yes", "No"],
      loadingBtnName: ["Yes"],
    });
    if (btnName === "Yes") {
      //@ts-ignore
      deleteMutation.mutate({
        data: { ...isDeleteDataRef.current?.data }
      });

    }
  }

  return (
    <>
      <Dialog open={open} PaperProps={{ style: { width: "100%", overflow: "auto" } }} maxWidth="md">
        <FormWrapper
          key={"DeleteDialog"}
          metaData={DeleteDialogMetaData} as MetaDataType
          onSubmitHandler={onSubmitHandler}
          initialValues={{}}
          controlsAtBottom
          formStyle={{
            background: "white",
          }}
        >
          {({ isSubmitting, handleSubmit }) => (
            <>
              <GradientButton
                onClick={handleSubmit}
              >
                Ok
              </GradientButton>
              <GradientButton onClick={() => onClose()}>
                Cancel
              </GradientButton>
            </>
          )}
        </FormWrapper>
      </Dialog>

    </>
  );
};

