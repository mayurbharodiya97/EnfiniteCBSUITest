import React, { useContext, useEffect, useRef, useState } from "react";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { extractMetaData, utilFunction } from "components/utils";
import { InitialValuesType, SubmitFnType } from "packages/form";
import { useLocation } from "react-router-dom";
import { TradeMasterMetaData } from "./metaData";
import { CircularProgress, Dialog } from "@mui/material";
import { GradientButton } from "components/styledComponent/button";
import { useMutation } from "react-query";
import { AuthContext } from "pages_audit/auth";
import * as API from "../api";
import { enqueueSnackbar } from "notistack";
import { usePopupContext } from "components/custom/popupContext";
import { LoadingTextAnimation } from "components/common/loader";
import { LoaderPaperComponent } from "components/common/loaderPaper";


const TradeMasterForm = ({
  isDataChangedRef,
  closeDialog,
  defaultView,
  gridData,
}) => {
  const [formMode, setFormMode] = useState(defaultView);
  const isErrorFuncRef = useRef<any>(null);
  const { state: rows }: any = useLocation();
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();

  const mutation = useMutation(API.updateTradeMasterData,
    {
      onError: (error: any) => {
        let errorMsg = "Unknownerroroccured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
        CloseMessageBox();
      },
      onSuccess: (data) => {
        enqueueSnackbar("insertSuccessfully", {
          variant: "success",
        });
        isDataChangedRef.current = true;
        CloseMessageBox();
        closeDialog();
      },
    }
  );
  const codeArr = gridData?.map((ele: any) => ele?.TRADE_CD);
  const filterNumbers = codeArr?.filter((ele) => !isNaN(ele));
  const codeIncrement =
    filterNumbers?.length > 0 ? Math.max(...filterNumbers) + 1 : "";
  const codeIncreByOne =
    String(codeIncrement)?.length < 5 ? String(codeIncrement) : "";

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData: any,
    endSubmit,
    setFieldError
  ) => {
    endSubmit(true);

    let newData = {
      ...data,
    };
    let oldData = {
      ...rows?.[0]?.data,
    };
    let upd = utilFunction.transformDetailsData(newData, oldData);

    isErrorFuncRef.current = {
      data: {
        ...newData,
        ...upd,
        COMP_CD: authState?.companyID,
        BRANCH_CD: authState?.user?.branchCode,
        _isNewRow: defaultView === "add" ? true : false,
      },
      displayData,
      endSubmit,
      setFieldError,
    };

    if (isErrorFuncRef.current?.data?._UPDATEDCOLUMNS.length === 0) {
      setFormMode("view");
    } else {
      const btnName = await MessageBox({
        message: "SaveData",
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
  return (
    <>
      {gridData ? (
        <FormWrapper
          key={"TradeMasterForm" + formMode}
          metaData={
            extractMetaData(
              TradeMasterMetaData,
              formMode
            ) as MetaDataType
          }
          displayMode={formMode}
          onSubmitHandler={onSubmitHandler}
          initialValues={
            formMode === "add"
              ? {
                ...rows?.[0]?.data,
                TRADE_CD: codeIncreByOne,
              }
              : { ...(rows?.[0]?.data as InitialValuesType) }
          }
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
                    endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
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
                    endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
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
      ) : (
        <LoaderPaperComponent />
      )}

    </>
  );
};

export const TradeMasterFormWrapper = ({
  isDataChangedRef,
  closeDialog,
  defaultView,
  gridData
}) => {
  return (
    <Dialog
      open={true}
      PaperProps={{
        style: {
          width: "100%",
          overflow: "auto",
        },
      }}
      maxWidth="md"
    >
      <TradeMasterForm
        closeDialog={closeDialog}
        defaultView={defaultView}
        gridData={gridData}
        isDataChangedRef={isDataChangedRef}
      />
    </Dialog>
  );
};