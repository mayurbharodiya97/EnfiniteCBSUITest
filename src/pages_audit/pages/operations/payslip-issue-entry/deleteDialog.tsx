import FormWrapper from "components/dyanmicForm";
import { SubmitFnType } from "packages/form";
import { Dialog } from "@mui/material";
import { DeleteDialogMetaData } from "./paySlipMetadata";
import { GradientButton } from "components/styledComponent/button";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "react-query";
import * as API from "./api";
import { usePopupContext } from "components/custom/popupContext";
import { useRef } from "react";


export const DeleteDialog = ({ closeDialog, open, rowData, slipdataRefetch }) => {
  const isDeleteDataRef = useRef<any>(null);
  const { MessageBox, CloseMessageBox } = usePopupContext();


  const deleteMutation = useMutation(API.savePayslipEntry, {
    onError: (error: any) => {
      let errorMsg = "Unknownerroroccured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
      CloseMessageBox();
      closeDialog();
    },
    onSuccess: (data) => {
      enqueueSnackbar("deleteSuccessfully", {
        variant: "success",
      });
      slipdataRefetch();
      CloseMessageBox();
      closeDialog();
    },
  });
  const onSubmitHandler: SubmitFnType = async (
    data: any,
  ) => {

    const btnName = await MessageBox({
      message: "DeleteData",
      messageTitle: "Confirmation",
      buttonNames: ["Yes", "No"],
      loadingBtnName: ["Yes"],
    });
    isDeleteDataRef.current = {
      data: {
        REQ_FLAG: "A",
        TRAN_TYPE: "Delete",
        COMP_CD: rowData.acctDtlData[0].ENTERED_COMP_CD,
        BRANCH_CD: rowData.acctDtlData[0].ENTERED_BRANCH_CD,
        ACCT_CD: rowData.ACCT_CD,
        ACCT_TYPE: rowData.ACCT_TYPE,
        AMOUNT: rowData.AMOUNT,
        REMARKS: rowData.acctDtlData[0].REMARKS,
        SCREEN_REF: "Rpt/14",
        CONFIRMED: rowData.CONFIRMED,
        USER_DEF_REMARKS: data.USER_DEF_REMARKS,
        TRAN_CD: rowData.TRAN_CD,
        ENTERED_BY: rowData.draftDtlData[0].ENTERED_BY,
        PAYSLIP_NO: rowData.PAYSLIP_NO,
        _isNewRow: false,
      }
    };
    if (btnName === "Yes") {
      deleteMutation.mutate({
        ...isDeleteDataRef.current.data
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
              <GradientButton onClick={() => closeDialog()}>
                Cancel
              </GradientButton>
            </>
          )}
        </FormWrapper>
      </Dialog>

    </>
  );
};

