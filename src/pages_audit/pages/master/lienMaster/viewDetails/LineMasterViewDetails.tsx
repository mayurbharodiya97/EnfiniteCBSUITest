import { Dialog } from "@mui/material";
import {useContext, useRef, useState } from "react";
import { useSnackbar } from "notistack";
import FormWrapper from "components/dyanmicForm";
import {  SubmitFnType } from "packages/form";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { useLocation } from "react-router-dom";
import { metaData } from "./metaData";
import { GradientButton } from "components/styledComponent/button";
import { extractMetaData, utilFunction } from "components/utils";
import * as API from "../api";
import { useMutation } from "react-query";
import { AuthContext } from "pages_audit/auth";


export const LienMasterForm = ({
  isDataChangedRef,
  closeDialog,
  defaultView,
  data: reqData,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [isOpenSave, setIsOpenSave] = useState(false);
  const isErrorFuncRef = useRef<any>(null);
  const [formMode, setFormMode] = useState(defaultView);
  const { authState } = useContext(AuthContext);
 
       
  const mutation = useMutation(API.updateLienData, {
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
    
      enqueueSnackbar("Record Saved Successfully", {
        variant: "success",
      });
      isDataChangedRef.current = true;
      closeDialog();
    },
  });

  const onSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
  ) => {
  
    endSubmit(true);
    let oldData = reqData?.[0]?.data;
    let newData = data;
    let upd: any = utilFunction.transformDetailsData(newData, oldData ?? {});
  
    isErrorFuncRef.current = {
      data: {
        ...newData,
        ...upd,
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: authState?.user?.branchCode ?? "",
        _isNewRow: formMode === "add" ? true : false,
      },
      displayData,
      endSubmit,
      setFieldError,
    };

    
    if (isErrorFuncRef.current?.data?._UPDATEDCOLUMNS.length === 0) {
      setFormMode("view");
    } else {
      setIsOpenSave(true);
    }
  };
  
  const onActionCancel = () => {
    setIsOpenSave(false);
  };
  const onPopupYes = (rows) => {
    mutation.mutate({ data: rows });
  };
  return (
    <>
        <FormWrapper
          key={"lienMasterForm" + formMode}
          metaData={extractMetaData(metaData,formMode)}as MetaDataType
          displayMode={formMode}
          formStyle = {{
            overflowX: "auto",
          }}
          onSubmitHandler={onSubmitHandler}
          initialValues={reqData?.[0]?.data ?? {}}
        >
          {({ isSubmitting, handleSubmit }) => (
            <>
              {formMode === "add" ? (
                <>
                  <GradientButton
                    onClick={(event) => {
                      handleSubmit(event, "Save");
                    }}
                  >
                    Save
                  </GradientButton>
                  <GradientButton
                    onClick={() => {
                      setFormMode("view");
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </GradientButton>
                </>
              ) : formMode === "edit" ? (
                <>
                  <GradientButton
                    onClick={(event) => {
                      
                      handleSubmit(event, "Save");
                    }}endI
                    disable={isSubmitting}
                  >
                    Save
                  </GradientButton>
                 
                  <GradientButton
                    onClick={closeDialog}
                    color={"primary"}
                  >
                    Close
                  </GradientButton>
                </>
              ) : (
                <>
                  <GradientButton
                    onClick={() => {
                      setFormMode("edit");
                    }}
                    color={"primary"}
                  >
                    Edit
                  </GradientButton>
                  <GradientButton
                    onClick={closeDialog}
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
            Message="Do you want to save this Request?"
            onActionYes={(rowVal) => onPopupYes(rowVal)}
            onActionNo={() => onActionCancel()}
            rows={isErrorFuncRef.current?.data}
            open={isOpenSave}
            loading={mutation.isLoading}
          />
        ) : null}

    </>
  );
};

export const LienMasterFormWrapper = ({
  isDataChangedRef,
  closeDialog,
  defaultView,
}) => {
  const { state: data }: any = useLocation();
  return (
    <Dialog
      open={true}
      maxWidth="lg"
    >
      <LienMasterForm
        closeDialog={closeDialog}
        defaultView={defaultView}
        data={data}
        isDataChangedRef={isDataChangedRef}
      />
    </Dialog>
  );
};
