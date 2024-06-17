import { Dialog } from "@mui/material";
import { useRef, useState } from "react";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { GradientButton } from "components/styledComponent/button";
import { extractMetaData, utilFunction } from "components/utils";
import { InitialValuesType, SubmitFnType } from "packages/form";
import { useLocation } from "react-router-dom";
import { AdvocateMstFormMetaData } from "./metaData";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";

export const AdvocateMstForm = ({
  isDataChangedRef,
  closeDialog,
  defaultView,
  gridData = [],
}) => {
  const [isOpenSave, setIsOpenSave] = useState(false);
  const isErrorFuncRef = useRef<any>(null);
  const [formMode, setFormMode] = useState(defaultView);
  const { state: rows }: any = useLocation();

  const onSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    //@ts-ignore
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
      },
      displayData,
      endSubmit,
      setFieldError,
    };
    if (isErrorFuncRef.current?.data?._UPDATEDCOLUMNS.length === 0) {
      setIsOpenSave(false);
      setFormMode("view");
    } else {
      setIsOpenSave(true);
    }
  };

  const onPopupYes = (rows) => {};
  const onActionCancel = () => {
    setIsOpenSave(false);
  };

  const gridValue = gridData?.map((val: any) => val.CODE);
  const gridCode = gridValue?.filter((val) => !isNaN(val));
  const incrementCode = gridCode?.length > 0 ? Math.max(...gridCode) + 1 : "";

  return (
    <>
      <FormWrapper
        key={"advocateMstForm" + formMode}
        metaData={
          extractMetaData(AdvocateMstFormMetaData, formMode) as MetaDataType
        }
        displayMode={formMode}
        onSubmitHandler={onSubmitHandler}
        initialValues={
          formMode === "new"
            ? { ...rows?.[0]?.data, CODE: String(incrementCode) }
            : { ...(rows?.[0]?.data as InitialValuesType) }
        }
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
                  disabled={isSubmitting}
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

export const AdvocateMstFormWrapper = ({
  isDataChangedRef,
  closeDialog,
  defaultView,
  gridData = [],
}) => {
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
      <AdvocateMstForm
        isDataChangedRef={isDataChangedRef}
        closeDialog={closeDialog}
        defaultView={defaultView}
        gridData={gridData}
      />
    </Dialog>
  );
};
