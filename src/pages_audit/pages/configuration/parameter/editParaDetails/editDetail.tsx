import { CircularProgress, Dialog } from "@mui/material";
import { MetaDataType } from "components/dyanmicForm";
import { FormWrapper } from "components/dyanmicForm/formWrapper";
import { ParaDetailMetadata } from "./metaData";
import { InitialValuesType, SubmitFnType } from "packages/form";
import { GradientButton } from "components/styledComponent/button";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { useMemo, useRef, useState } from "react";
import * as API from "./api"
import { useMutation } from "react-query";
import { enqueueSnackbar } from "notistack";
import { extractMetaData, utilFunction } from "components/utils";
import { usePopupContext } from "components/custom/popupContext";

 const EditDetail = ({ open, onClose, rowsData ,refetch,formView}) => {
  const [isOpenSave, setIsOpenSave] = useState(false);
  const isErrorFuncRef = useRef<any>(null);
  const [formMode, setFormMode] = useState(formView);
  const { MessageBox } = usePopupContext();
  const result = useMutation(API.validateparavalue, {
    onSuccess: (data) => {
      if (data?.[0]?.STATUS === "0") {
        return setIsOpenSave(true);
      } else if (data?.[0]?.STATUS === "999" && data?.[0]?.MESSAGE) {
        MessageBox({
          messageTitle: "Validation Alert..",
          message: data?.[0]?.MESSAGE,
        });
      }
    },
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
    },
  });
  const mutation = useMutation((API.updateParameterData),{
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
      setIsOpenSave(false);
      setFormMode("view");
    },
  });
  const onActionCancel = () => {
    setIsOpenSave(false);
  };
   const onSubmitHandler: SubmitFnType = (
    data:any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    //@ts-ignore
    endSubmit(true);
    let newData = {
      ...data
    };
    let oldData = {
      ...rowsData?.[0]?.data
    };
    let upd = utilFunction.transformDetailsData(newData, oldData);
    isErrorFuncRef.current = {   
      data: {
        ...newData,
        ...upd,
      }, 
      displayData, 
      endSubmit, 
      setFieldError 
    };
    if (isErrorFuncRef.current?.data?._UPDATEDCOLUMNS.length === 0) {
      setIsOpenSave(false);
      setFormMode("view");
    } else {
      result.mutate({
        para_cd:data?.PARA_CD ?? "",
        para_value:data?.PARA_VALUE ?? "",
      });
    }
  };
  const onPopupYes = (rowsData1) => {
    mutation.mutate({
      datatype_cd: rowsData1?.DATATYPE_CD ?? "",
      paraValue: rowsData1?.PARA_VALUE ?? "",
      old_datatype: rowsData[0].data?.DATATYPE_CD ?? "",
      old_paraValue: rowsData[0].data?.PARA_VALUE ?? "",
      remark: rowsData1?.REMARKS ?? "",
      old_remark: rowsData[0].data?.REMARKS ?? "",
      comp_cd: rowsData[0].data?.COMP_CD ?? "",
      branch_cd: rowsData[0].data?.BRANCH_CD ?? "",
      paraCode: rowsData1?.PARA_CD ?? "",
    })
  }
  const masterMetadata: MetaDataType = useMemo(
    () => extractMetaData(ParaDetailMetadata, formMode),
    [ParaDetailMetadata, formMode, ""]
  ) as MetaDataType;
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
      key={`paraEditDetail` + formMode}
      metaData={masterMetadata as MetaDataType}
      initialValues={rowsData?.[0]?.data as InitialValuesType}
      onSubmitHandler={onSubmitHandler}
        //@ts-ignore
      displayMode={formMode}
      formStyle={{
        background: "white",
        height: "calc(53vh - 100px)",
        overflowY: "auto",
        overflowX: "hidden",
      }}
      containerstyle={{ padding: "10px" }}
    >   
       {({ isSubmitting, handleSubmit }) => (
            <>
              {formMode === "edit" ? (
                <>
                  <GradientButton
                    onClick={(event) => {
                      handleSubmit(event, "Save");
                    }}
                    disabled={isSubmitting}
                    endIcon={
                      result?.isLoading ? (
                        <CircularProgress size={20} />
                      ) : null
                    }
                    color={"primary"}
                  >
                    Save
                  </GradientButton>
                  <GradientButton
                    onClick={() => {
                      setFormMode("view");
                    }}
                    color={"primary"}
                  >
                    Cancel
                  </GradientButton>
                </>
              ) : (
                <>
                 {(rowsData?.[0]?.data?.CONFIRMED === "N" || rowsData?.[0]?.data?.ALLOW_VALUE_EDIT_FLAG === "N") ? null : (
            <GradientButton
              onClick={() => {
                setFormMode("edit");
              }}
              color={"primary"}
            >
              Edit
            </GradientButton>
          )}
                  <GradientButton
                    onClick={onClose}
                    color={"primary"}
                  >
                    Close
                  </GradientButton>
                </>
              )}
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
