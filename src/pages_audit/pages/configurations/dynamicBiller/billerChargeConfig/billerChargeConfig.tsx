import { FC, useEffect, useState, useContext, useRef } from "react";
import { useMutation, useQuery } from "react-query";
import { ClearCacheContext, queryClient } from "cache";
import { InitialValuesType, SubmitFnType } from "packages/form";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useSnackbar } from "notistack";
import { useLocation } from "react-router-dom";
import { useDialogStyles } from "pages_audit/common/dialogStyles";
import { Transition } from "pages_audit/common/transition";
import * as API from "../api";
import { DynBillerChargeMetadata } from "./metaData";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { Alert } from "components/common/alert";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { UserLimitConfirmGridMetaData } from "pages_audit/pages/confirmations/metaData/userLimitMetaData";

interface updateMasterDataType {
  formData: object;
  displayData?: object;
  endSubmit?: any;
  setFieldError?: any;
}

const updateMasterDataWrapperFn =
  (updateMasterData) =>
  async ({ formData }: updateMasterDataType) => {
    return updateMasterData({ formData });
  };

const BillerChargeConfig: FC<{
  isDataChangedRef: any;
  closeDialog?: any;
}> = ({ isDataChangedRef, closeDialog }) => {
  const { enqueueSnackbar } = useSnackbar();
  const isErrorFuncRef = useRef<any>(null);
  const [isOpenSave, setIsOpenSave] = useState(false);
  const { state: rows }: any = useLocation();
  //const moveToViewMode = useCallback(() => setFormMode("view"), [setFormMode]);
  // const moveToEditMode = useCallback(() => setFormMode("edit"), [setFormMode]);

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(
    [
      "getBillerChargeData",
      {
        categoryID: rows?.[0]?.data?.CATEGORY_ID,
        subCategoryID: rows?.[0]?.data?.SUB_CATEGORY_ID,
        billerID: rows?.[0]?.data?.BILLER_ID,
      },
    ],
    () =>
      API.getBillerChargeData({
        categoryID: rows?.[0]?.data?.CATEGORY_ID,
        subCategoryID: rows?.[0]?.data?.SUB_CATEGORY_ID,
        billerID: rows?.[0]?.data?.BILLER_ID,
      })
  );

  const mutation = useMutation(
    updateMasterDataWrapperFn(API.updateBillerChargeConfig),
    {
      onError: (error: any, { endSubmit }) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        endSubmit(false, errorMsg, error?.error_detail ?? "");
      },
      onSuccess: (data, { endSubmit }) => {
        // queryClient.refetchQueries(["getFormData", transactionID]);
        endSubmit(true, "");
        enqueueSnackbar(data, {
          variant: "success",
        });
        isDataChangedRef.current = true;
        if (typeof closeDialog === "function") {
          closeDialog();
        }
      },
    }
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries([
        "getBillerChargeData",
        {
          categoryID: rows?.[0]?.data?.CATEGORY_ID,
          subCategoryID: rows?.[0]?.data?.SUB_CATEGORY_ID,
          billerID: rows?.[0]?.data?.BILLER_ID,
        },
      ]);
    };
  }, [
    rows?.[0]?.data?.CATEGORY_ID,
    rows?.[0]?.data?.SUB_CATEGORY_ID,
    rows?.[0]?.data?.BILLER_ID,
  ]);

  const onSubmitHandler: SubmitFnType = (
    data,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    //@ts-ignore
    endSubmit(true);
    isErrorFuncRef.current = {
      formData: data,
      displayData,
      endSubmit,
      setFieldError,
    };
    setIsOpenSave(true);
  };

  const onPopupYes = (rows) => {
    mutation.mutate({ ...isErrorFuncRef.current });
  };

  const onActionCancel = () => {
    setIsOpenSave(false);
  };

  return (
    <>
      {isLoading ? (
        <LoaderPaperComponent />
      ) : isError ? (
        <Alert
          severity="error"
          errorMsg={error?.error_msg ?? "Something went to wrong.."}
          errorDetail={error?.error_detail}
          color="error"
        />
      ) : (
        <FormWrapper
          key={"BranchMasterForm"}
          metaData={DynBillerChargeMetadata as MetaDataType}
          initialValues={data?.[0] as InitialValuesType}
          onSubmitHandler={onSubmitHandler}
          //@ts-ignore
          // displayMode={formMode}
          formStyle={{
            background: "white",
            height: "calc(52vh - 100px)",
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
      )}
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

export const BillerChargeConfigWrapper = ({
  handleDialogClose,
  isDataChangedRef,
}) => {
  const classes = useDialogStyles();
  const { state: rows }: any = useLocation();
  const { getEntries } = useContext(ClearCacheContext);
  // useEffect(() => {
  //   return () => {
  //     // let entries = getEntries() as any[];
  //     // entries.forEach((one) => {
  //     //   queryClient.removeQueries(one);
  //     // });
  //   };
  // }, [getEntries]);
  return (
    <>
      <Dialog
        open={true}
        //@ts-ignore
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            width: "40%",
            minHeight: "48vh",
            height: "48vh",
          },
        }}
        maxWidth="sm"
        classes={{
          scrollPaper: classes.topScrollPaper,
          paperScrollBody: classes.topPaperScrollBody,
        }}
      >
        <BillerChargeConfig
          isDataChangedRef={isDataChangedRef}
          closeDialog={handleDialogClose}
        />
      </Dialog>
    </>
  );
};
