import { FC, useEffect, useState, useContext, useRef } from "react";
import { useQuery, useMutation } from "react-query";
import { ClearCacheContext, queryClient } from "cache";
import { InitialValuesType, SubmitFnType } from "packages/form";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import FormWrapper from "components/dyanmicForm";
import { useSnackbar } from "notistack";
import { cloneDeep } from "lodash-es";
import { useLocation } from "react-router-dom";
import { useDialogStyles } from "pages_audit/common/dialogStyles";
import { Transition } from "pages_audit/common/transition";
import { RemarksAPIWrapper } from "components/custom/Remarks";
import * as API from "../api";
import { UtilMasterMetadata } from "./metaData";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { LoaderPaperComponent } from "components/common/loaderPaper";

interface updateAUTHDetailDataType {
  formView: any;

  rows: any;
}

const UtilMasterForm: FC<{
  isDataChangedRef: any;
  closeDialog?: any;
  formView?: string;
}> = ({ isDataChangedRef, closeDialog, formView }) => {
  const { enqueueSnackbar } = useSnackbar();
  const isErrorFuncRef = useRef<any>(null);
  const [isOpenSave, setIsOpenSave] = useState(false);
  const { state: rows }: any = useLocation();
  //const moveToViewMode = useCallback(() => setFormMode("view"), [setFormMode]);
  // const moveToEditMode = useCallback(() => setFormMode("edit"), [setFormMode]);

  // const result = useQuery(
  //   ["getUtilMasterFormData", formView, UtilCode],
  //   () => API.getUtilMasterFormData({ formView, UtilCode })
  // );

  const mutation = useMutation(
    API.updateOtherEntData(),

    {
      onError: (error: any) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        //endSubmit(false, errorMsg, error?.error_detail ?? "");
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
        isDataChangedRef.current = true;
        closeDialog();
      },
    }
  );
  const onActionCancel = () => {
    setIsOpenSave(false);
  };
  const onPopupYes = (rows) => {
    console.log("onPopup>>");
    mutation.mutate({
      formView: formView,
      rows: rows,
      entityType: "P",
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
    setIsOpenSave(true);
  };

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getUtilMasterFormData", formView]);
    };
  }, [formView]);
  // const dataUniqueKey = `${result.dataUpdatedAt}`;
  // const loading = result.isLoading || result.isFetching;
  // let isError = result.isError;
  // //@ts-ignore
  // let errorMsg = `${result.error?.error_msg}`;
  // errorMsg = Boolean(errorMsg.trim()) ? errorMsg : "Unknown error occured";

  // let formEditData = [];
  // if (Array.isArray(result.data) && result.data.length > 0) {
  //   formEditData = Object.assign({}, result.data[0]);
  // }

  // if (result.isSuccess) {
  //   const formStateFromInitValues =
  //     typeof setEditFormStateFromInitValues === "function"
  //       ? setEditFormStateFromInitValues(result.data[0])
  //       : undefined;
  //   viewEditMetaData = cloneDeep(AUTHDetailMetadata) as MetaDataType;

  //   viewEditMetaData.form.formState = {
  //     formCode: viewEditMetaData.form.name,
  //     ...formStateFromInitValues,
  //   };
  //   viewEditMetaData.form.name = `${viewEditMetaData.form.name}-edit`;
  //   if (viewEditMetaData?.form?.render?.renderType === "stepper") {
  //     viewEditMetaData.form.render.renderType = "tabs";
  //   }
  // }
  return (
    <>
      <FormWrapper
        key={"UtilMasterForm"}
        metaData={UtilMasterMetadata}
        initialValues={rows?.[0]?.data as InitialValuesType}
        onSubmitHandler={onSubmitHandler}
        //@ts-ignore
        // displayMode={formMode}
        formStyle={{
          background: "white",
          height: "30vh",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {({ isSubmitting, handleSubmit }) => (
          <>
            <Button
              onClick={(event) => {
                handleSubmit(event, "Save");
              }}
              disabled={isSubmitting}
              //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              color={"primary"}
            >
              Save
            </Button>
            <Button
              onClick={closeDialog}
              color={"primary"}
              disabled={isSubmitting}
            >
              Close
            </Button>
            {/* <Button
            onClick={moveToViewMode}
            disabled={isSubmitting}
																		  
            color={"primary"}
          >
            Cancel
          </Button> */}
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

export const UtilMasterFormWrapper = ({
  handleDialogClose,
  isDataChangedRef,
  formView,
}) => {
  const classes = useDialogStyles();
  const { state: rows }: any = useLocation();
  const { getEntries } = useContext(ClearCacheContext);
  //console.log("1");
  return (
    <>
      <Dialog
        open={true}
        //@ts-ignore
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            width: "80%",
            // minHeight: "33vh",
            // height: "50vh",
          },
        }}
        maxWidth="lg"
        classes={{
          scrollPaper: classes.topScrollPaper,
          paperScrollBody: classes.topPaperScrollBody,
        }}
      >
        <UtilMasterForm
          isDataChangedRef={isDataChangedRef}
          closeDialog={handleDialogClose}
          formView={formView}
        />
      </Dialog>
    </>
  );
};
