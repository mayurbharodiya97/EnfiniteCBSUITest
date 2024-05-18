import { CircularProgress, Dialog } from "@mui/material";
import { queryClient } from "cache";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { GradientButton } from "components/styledComponent/button";
import { extractMetaData, utilFunction } from "components/utils";
import { useSnackbar } from "notistack";
import { SubmitFnType } from "packages/form";
import { AuthContext } from "pages_audit/auth";
import { Transition } from "pages_audit/common";
import { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { InsuTypeMasterFormMetadata } from "./metaData";

export const InsuranceTypeMasterForm = ({
  isDataChangedRef,
  closeDialog,
  defaultView,
}) => {
  const { authState } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [isOpenSave, setIsOpenSave] = useState(false);
  const isErrorFuncRef = useRef<any>(null);
  const { state: rows }: any = useLocation();
  const [formMode, setFormMode] = useState(defaultView);

  const onSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    // @ts-ignore
    endSubmit(true);

    let newData = { ...data };
    let oldData = { ...rows?.[0]?.data };
    let upd = utilFunction.transformDetailsData(newData, oldData);

    isErrorFuncRef.current = {
      data: {
        ...newData,
        ...upd,
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
    setFormMode("view");
    setIsOpenSave(false);
  };
  const onActionCancel = () => {
    setIsOpenSave(false);
  };

  return (
    <>
      <FormWrapper
        key={"insuTypeMasterForm" + formMode}
        metaData={
          extractMetaData(InsuTypeMasterFormMetadata, formMode) as MetaDataType
        }
        displayMode={formMode}
        onSubmitHandler={onSubmitHandler}
        initialValues={{
          ...(rows?.[0]?.data ?? {}),
        }}
        formStyle={{
          background: "white",
          margin: "10px 0",
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
            ) : formMode === "new" ? (
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
      {isOpenSave ? (
        <PopupMessageAPIWrapper
          MessageTitle="Confirmation"
          Message="Do you want to save this Request?"
          onActionYes={(rowVal) => onPopupYes(rowVal)}
          onActionNo={() => onActionCancel()}
          rows={isErrorFuncRef.current?.data}
          open={isOpenSave}
        />
      ) : null}
    </>
  );
};

export const InsuTypeMasterWrapper = ({
  isDataChangedRef,
  closeDialog,
  defaultView,
}) => {
  return (
    <Dialog
      open={true}
      // @ts-ignore
      TransitionComponent={Transition}
      PaperProps={{
        style: {
          width: "auto",
          overflow: "auto",
        },
      }}
      maxWidth="lg"
    >
      <InsuranceTypeMasterForm
        isDataChangedRef={isDataChangedRef}
        closeDialog={closeDialog}
        defaultView={defaultView}
      />
    </Dialog>
  );
};
