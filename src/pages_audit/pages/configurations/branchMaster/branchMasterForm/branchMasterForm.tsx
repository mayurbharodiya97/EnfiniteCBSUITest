import { FC, useEffect, useState, useContext, useRef } from "react";
import { useMutation } from "react-query";
import { ClearCacheContext, queryClient } from "cache";
import { InitialValuesType, SubmitFnType } from "packages/form";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useSnackbar } from "notistack";
import { useLocation } from "react-router-dom";
import { useDialogStyles } from "pages_audit/common/dialogStyles";
import { Transition } from "pages_audit/common/transition";
import * as API from "./api";
import {
  BranchMasterAddFormMetadata,
  BranchMasterFormMetadata,
} from "./metaData";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { format } from "date-fns";

interface updateAUTHDetailDataType {
  data: any;
  displayData?: any;
  endSubmit?: any;
  setFieldError?: any;
}

const updateAUTHDetailDataWrapperFn =
  (updateAUTHDetailData) =>
  async ({ data }: updateAUTHDetailDataType) => {
    return updateAUTHDetailData({ data });
  };

const BranchMasterForm: FC<{
  isDataChangedRef: any;
  closeDialog?: any;
  formView?: string;
  branchCode: string;
}> = ({ isDataChangedRef, closeDialog, formView, branchCode }) => {
  const { enqueueSnackbar } = useSnackbar();
  const isErrorFuncRef = useRef<any>(null);
  const [isOpenSave, setIsOpenSave] = useState(false);
  const { state: rows }: any = useLocation();
  const mutation = useMutation(
    updateAUTHDetailDataWrapperFn(API.updateBranchMasterData),

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
  const onPopupYes = () => {
    mutation.mutate({
      ...isErrorFuncRef.current,
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
    data["ACTIVE"] = Boolean(data["ACTIVE"]) ? "Y" : "N";
    data["CHQ_BOOK_ENABLED"] = Boolean(data["CHQ_BOOK_ENABLED"]) ? "Y" : "N";
    data["DPS_ENABLED"] = Boolean(data["DPS_ENABLED"]) ? "Y" : "N";
    data["FD_ENABLED"] = Boolean(data["FD_ENABLED"]) ? "Y" : "N";
    data["PAY_ORDER_ENABLED"] = Boolean(data["PAY_ORDER_ENABLED"]) ? "Y" : "N";
    data["BR_OPEN_DT"] = Boolean(data["BR_OPEN_DT"])
      ? format(new Date(data["BR_OPEN_DT"]), "dd/MMM/yyyy")
      : "";
    isErrorFuncRef.current = { data, displayData, endSubmit, setFieldError };
    setIsOpenSave(true);
  };
  console.log(rows?.[0]?.data);
  useEffect(() => {
    return () => {
      queryClient.removeQueries([
        "getBranchMasterFormData",
        formView,
        branchCode,
      ]);
    };
  }, [formView, branchCode]);
  return (
    <>
      <FormWrapper
        key={"BranchMasterForm"}
        metaData={
          formView === "add"
            ? BranchMasterAddFormMetadata
            : (BranchMasterFormMetadata as MetaDataType)
        }
        initialValues={(rows?.[0]?.data ?? {}) as InitialValuesType}
        onSubmitHandler={onSubmitHandler}
        //@ts-ignore
        displayMode={formView === "add" ? "New" : formView}
        formStyle={{
          background: "white",
          height: "50vh",
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
          </>
        )}
      </FormWrapper>
      {isOpenSave ? (
        <PopupMessageAPIWrapper
          MessageTitle="Confirmation"
          Message="Do you want to save this Request?"
          onActionYes={() => onPopupYes()}
          onActionNo={() => onActionCancel()}
          rows={isErrorFuncRef.current?.data}
          open={isOpenSave}
          loading={mutation.isLoading}
        />
      ) : null}
    </>
  );
};

export const BranchMasterFormWrapper = ({
  handleDialogClose,
  isDataChangedRef,
  formView,
}) => {
  const classes = useDialogStyles();
  const { state: rows }: any = useLocation();
  const { getEntries } = useContext(ClearCacheContext);
  useEffect(() => {
    return () => {
      let entries = getEntries() as any[];
      entries.forEach((one) => {
        queryClient.removeQueries(one);
      });
    };
  }, [getEntries]);
  return (
    <>
      <Dialog
        open={true}
        //@ts-ignore
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            width: "90%",
          },
        }}
        maxWidth="lg"
        classes={{
          scrollPaper: classes.topScrollPaper,
          paperScrollBody: classes.topPaperScrollBody,
        }}
      >
        <BranchMasterForm
          branchCode={rows?.[0]?.data?.BRANCH_CD ?? ""}
          isDataChangedRef={isDataChangedRef}
          closeDialog={handleDialogClose}
          formView={formView}
        />
      </Dialog>
    </>
  );
};
