import { Dialog } from "@mui/material";
import {  useContext, useRef, useState } from "react";
import FormWrapper from "components/dyanmicForm";
import { SubmitFnType } from "packages/form";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { useLocation } from "react-router-dom";
import { TradeMasterMetaData } from "./metaData";
import { GradientButton } from "components/styledComponent/button";
import { extractMetaData, utilFunction } from "components/utils";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "react-query";
import * as API from "../api";
import { AuthContext } from "pages_audit/auth";

export const Trademasterform = ({
  isDataChangedRef,
  closeDialog,
  defaultView,
  data: reqData,
}) => {
  const { authState } = useContext(AuthContext);
  const [isOpenSave, setIsOpenSave] = useState(false);
  const isErrorFuncRef = useRef<any>(null);
  const [formMode, setFormMode] = useState(defaultView);


  const mutation = useMutation((API.updateTradeMasterData),
    {
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
        enqueueSnackbar("Records successfully Saved", {
          variant: "success",
        });
        isDataChangedRef.current = true;
        closeDialog();
      },
    }
  );
  const onSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
  ) => {
    // @ts-ignore
    endSubmit(true);

    let oldData = reqData?.[0]?.data;
    let newData = data;

    let updatedValue: any = utilFunction.transformDetailsData(
      newData,
      oldData ?? {}
    );

    isErrorFuncRef.current = {
      data: {
        ...newData,
        ...updatedValue,
        COMP_CD: authState.companyID,
        BRANCH_CD: authState.user.branchCode,
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

  const onPopupYes = (rows) => {
   mutation.mutate({data:rows});
  };

  const onActionCancel = () => {
    setIsOpenSave(false);
  };
  
  return (
    <>
      <FormWrapper
        key={"Trademasterformetadata" + formMode}
        metaData={extractMetaData(TradeMasterMetaData,formMode)} as GridMetaDataType 
        displayMode={formMode}
        onSubmitHandler={onSubmitHandler}
        initialValues={reqData?.[0]?.data ??{}}
        formStyle={{
          background: "white",
        }}
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
            ) : formMode === "add" ? (
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

                <GradientButton onClick={closeDialog} color={"primary"}>
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
                <GradientButton onClick={closeDialog} color={"primary"}>
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

export const TrademasterformWrapper = ({   isDataChangedRef,closeDialog, defaultView }) => {
  const { state: data }: any = useLocation();
  return (
    <Dialog
      open={true}
      PaperProps={{
        style: {
          width: "auto",
          overflow: "auto",
        },
      }}
      maxWidth="lg"
    >
      <Trademasterform 
      isDataChangedRef={isDataChangedRef}
      closeDialog={closeDialog} 
      defaultView={defaultView} 
      data={data} />
    </Dialog>
  );
};
