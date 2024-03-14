import { Dialog } from "@mui/material";
import { MetaDataType } from "components/dyanmicForm";
import { FormWrapper } from "components/dyanmicForm/formWrapper";
import { ParaDetailMetadata } from "./metaData";
import { InitialValuesType, SubmitFnType } from "packages/form";
import { GradientButton } from "components/styledComponent/button";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { useRef, useState } from "react";
import * as API from "./api";
import { useMutation } from "react-query";
import { enqueueSnackbar } from "notistack";

const EditDetail = ({ open, onClose, rowsData, refetch }) => {
  const [isOpenSave, setIsOpenSave] = useState(false);
  const isErrorFuncRef = useRef<any>(null);

  const mutation = useMutation(API.updateParameterData, {
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      if (isErrorFuncRef.current == null) {
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
      } else {
        isErrorFuncRef.current?.endSubmit(
          false,
          errorMsg,
          error?.error_detail ?? ""
        );
      }
      onActionCancel();
    },
    onSuccess: (data) => {
      enqueueSnackbar(data, {
        variant: "success",
      });
      isErrorFuncRef.current = true;
      onClose();
      refetch();
    },
  });
  const onActionCancel = () => {
    setIsOpenSave(false);
  };
  const onPopupYes = (rowsData1) => {
    mutation.mutate({
      datatype_cd: rowsData1?.DATATYPE_CD ?? "",
      paraValue: rowsData1?.PARA_VALUE ?? "",
      old_datatype: rowsData[0].data?.DATATYPE_CD ?? "",
      old_paraValue: rowsData[0].data?.PARA_VALUE ?? "",
      remarks: rowsData[0].data?.REMARKS ?? "",
      compCode: rowsData1?.COMP_CD ?? "",
      branch_cd: rowsData[0].data?.BRANCH_CD ?? "",
      paraCode: rowsData1?.PARA_CD ?? "",
    });
  };
  const onSubmitHandler: SubmitFnType = (
    data,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    //@ts-ignore
    endSubmit(true);
    isErrorFuncRef.current = { data, displayData, endSubmit, setFieldError };
    if (isErrorFuncRef.current.displayData.PARA_VALUE === "") {
      setIsOpenSave(false);
    } else {
      setIsOpenSave(true);
    }
  };
  return (
    <>
      <Dialog
        open={open}
        fullWidth={true}
        PaperProps={{
          style: {
            maxWidth: "900px",
          },
        }}
      >
        <FormWrapper
          key={`paraEditDetail`}
          metaData={ParaDetailMetadata as MetaDataType}
          initialValues={rowsData?.[0]?.data as InitialValuesType}
          onSubmitHandler={onSubmitHandler}
          formStyle={{
            background: "white",
            height: "calc(42vh - 100px)",
            overflowY: "auto",
            overflowX: "hidden",
          }}
          containerstyle={{ padding: "10px" }}
        >
          {({ isSubmitting, handleSubmit }) => (
            <>
              <GradientButton
                onClick={(event) => {
                  handleSubmit(event, "Save");
                }}
                disabled={isSubmitting}
                color={"primary"}
              >
                Save
              </GradientButton>
              <GradientButton
                onClick={onClose}
                color={"primary"}
                disabled={isSubmitting}
              >
                Close
              </GradientButton>
            </>
          )}
        </FormWrapper>
        {isOpenSave ? (
          <PopupMessageAPIWrapper
            MessageTitle="Confirmation"
            Message="Do you want to save this record?"
            onActionYes={(rowVal) => onPopupYes(rowVal)}
            onActionNo={() => onActionCancel()}
            rows={isErrorFuncRef.current?.data}
            open={isOpenSave}
            loading={mutation.isLoading}
          />
        ) : null}
      </Dialog>
    </>
  );
};
export default EditDetail;
