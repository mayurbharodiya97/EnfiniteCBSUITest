import { Dialog } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import FormWrapper from "components/dyanmicForm";
import { SubmitFnType } from "packages/form";
import { useLocation } from "react-router-dom";
import { prioritymastersubformmetadata } from "./metaData";
import { GradientButton } from "components/styledComponent/button";
import { enqueueSnackbar } from "notistack";
import { extractMetaData, utilFunction } from "components/utils";
import { useMutation } from "react-query";
import * as API from "../api";
import { AuthContext } from "pages_audit/auth";
import { usePopupContext } from "components/custom/popupContext";
import { LoadingTextAnimation } from "components/common/loader";

export const Proritysubform = ({
  isDataChangedRef,
  closeDialog,
  defaultView,
  gridData = [],
}) => {
  const { authState } = useContext(AuthContext);
  const isErrorFuncRef = useRef<any>(null);
  const [formMode, setFormMode] = useState(defaultView);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const {state : rows} = useLocation()
  const [isLoading, setIsLoading] = useState(true);

  const mutation = useMutation((API.updatePriorityMasterSubData),
    {
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
        enqueueSnackbar("Records successfully Saved", {
          variant: "success",
        });
        isDataChangedRef.current = true;
        CloseMessageBox();
        closeDialog();
      },
    }
  );
  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
  ) => {
    
    endSubmit(true);

    let oldData = {
      ...rows?.[0]?.data,
    };
    let newData = {
      ...data,
    };
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
      const btnName = await MessageBox({
        message: "Do you want to save this Request?",
        messageTitle: "Confirmation",
        buttonNames: ["Yes", "No"],
        loadingBtnName: ["Yes"],
      });
      if (btnName === "Yes") {
        mutation.mutate({
          data: { ...isErrorFuncRef.current?.data },
        });
      }
    }
  };
  useEffect(() => {
    if (gridData.length > 0) {
      setIsLoading(false);
    }
  }, [gridData]);
  return (
    <>
    {isLoading ? ( <LoadingTextAnimation/>
      ) : (
      <FormWrapper
        key={"prioritymastersubformmetadata" + formMode}
        metaData={extractMetaData(prioritymastersubformmetadata, formMode)} as MetaDataType
        displayMode={formMode}
        onSubmitHandler={onSubmitHandler}
        initialValues={{...rows?.[0]?.data}}
        formStyle={{
          background: "white",
        }}
        formState={{
          gridData: gridData,
          rows: rows?.[0]?.data,
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
                  onClick={closeDialog}
                  color={"primary"}
                  disabled={isSubmitting}
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
      )}
    </>
      
  );
};

export const ProritymastersubformWrapper = ({ isDataChangedRef, closeDialog, defaultView, gridData = []}) => {
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
      <Proritysubform
        isDataChangedRef={isDataChangedRef}
        closeDialog={closeDialog}
        defaultView={defaultView}
        gridData={gridData} />
    </Dialog>
  );
};