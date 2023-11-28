import { FC, useEffect, useState, useContext, useRef, Fragment } from "react";
import { useMutation, useQuery } from "react-query";
import { ClearCacheContext, queryClient } from "cache";
import { InitialValuesType, SubmitFnType } from "packages/form";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useSnackbar } from "notistack";
import { useLocation } from "react-router-dom";
import { useDialogStyles } from "pages_audit/common/dialogStyles";
import { Transition } from "pages_audit/common/transition";
import * as API from "./api";
import { format } from "date-fns";
import { Alert } from "components/common/alert";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { extractMetaData, utilFunction } from "components/utils";
import { AuthContext } from "pages_audit/auth";
import { Button, Dialog } from "@mui/material";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { GradientButton } from "components/styledComponent/button";

interface updateAUTHDetailDataType {
  data: any;
  endSubmit?: any;
}

const updateAUTHDetailDataWrapperFn =
  (updateAUTHDetailData) =>
  async ({ data }: updateAUTHDetailDataType) => {
    return updateAUTHDetailData(data);
  };

const DynamicForm: FC<{
  isDataChangedRef: any;
  closeDialog?: any;
  item: any;
  docID: any;
  gridData: any;
  alertMessage: any;
  defaultView?: "view" | "edit" | "add";
}> = ({
  isDataChangedRef,
  closeDialog,
  item,
  docID,
  gridData,
  defaultView,
  alertMessage,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const isErrorFuncRef = useRef<any>(null);
  const [isOpenSave, setIsOpenSave] = useState(false);
  const { authState } = useContext(AuthContext);
  const [formMode, setFormMode] = useState(defaultView);

  const {
    data: metaData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery<any, any>(["getDynamicFormMetaData"], () =>
    API.getDynamicFormMetaData({
      DOC_CD: item?.DOC_CD ?? "",
      COMP_CD: authState?.companyID ?? "",
      BRANCH_CD: authState?.user?.branchCode ?? "",
      SR_CD: item?.FORM_METADATA_SR_CD,
    })
  );

  const mutation = useMutation(
    updateAUTHDetailDataWrapperFn(API.getDynamicFormData(docID)),
    {
      onError: (error: any, { endSubmit }) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.errorMessage ?? errorMsg;
        }
        endSubmit(false, errorMsg, error?.errorDetail ?? "");
      },
      onSuccess: (data) => {
        // SetLoadingOWN(true, "");
        enqueueSnackbar(data, {
          variant: "success",
        });
        isDataChangedRef.current = true;
        closeDialog();
      },
    }
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getDynamicFormMetaData"]);
      queryClient.removeQueries(["getDynamicFormData"]);
    };
  }, []);
  const onActionCancel = () => {
    setIsOpenSave(false);
  };
  const onPopupYes = (rows) => {
    mutation.mutate({ data: rows });
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

    if (data) {
      const booleanValue = data;

      for (const key in booleanValue) {
        if (booleanValue.hasOwnProperty(key)) {
          // Convert boolean values to "Y" or "N"
          if (typeof booleanValue[key] === "boolean") {
            booleanValue[key] = booleanValue[key] ? "Y" : "N";
          }
        }
      }
    }

    let upd = utilFunction.transformDetailsData(
      data,
      gridData?.[0]?.data ?? {}
    );

    isErrorFuncRef.current = {
      data: {
        ...data,
        ...upd,
        _isNewRow: formMode === "add" ? true : false,
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: authState?.user?.branchCode ?? "",
      },
      displayData,
      endSubmit,
      setFieldError,
    };

    setIsOpenSave(true);
  };

  return (
    <>
      {isLoading || isFetching ? (
        <LoaderPaperComponent />
      ) : isError ? (
        <Fragment>
          <div style={{ width: "100%", paddingTop: "10px" }}>
            <Alert
              severity={error?.severity ?? "error"}
              errorMsg={error?.error_msg ?? "Error"}
              errorDetail={error?.error_detail ?? ""}
            />
          </div>
        </Fragment>
      ) : (
        <>
          <FormWrapper
            key={`DynamicForm` + formMode}
            metaData={metaData}
            onSubmitHandler={onSubmitHandler}
            // initialValues={
            //   defaultView === "Add" ? {} : (gridData?.data as InitialValuesType)
            // }
            initialValues={gridData?.[0]?.data as InitialValuesType}
            // hideHeader={true}
            displayMode={formMode}
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
                      //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
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
                ) : formMode === "add" ? (
                  <>
                    <GradientButton
                      onClick={(event) => {
                        handleSubmit(event, "Save");
                      }}
                      disabled={isSubmitting}
                      //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                      color={"primary"}
                    >
                      Save
                    </GradientButton>

                    <GradientButton
                      onClick={closeDialog}
                      //disabled={isSubmitting}
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
                      //disabled={isSubmitting}
                      color={"primary"}
                    >
                      Edit
                    </GradientButton>
                    <GradientButton
                      onClick={closeDialog}
                      //disabled={isSubmitting}
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
              Message={alertMessage || "Do you want to save this Request?"}
              onActionYes={(rowVal) => onPopupYes(rowVal)}
              onActionNo={() => onActionCancel()}
              rows={isErrorFuncRef.current?.data}
              open={isOpenSave}
              loading={mutation.isLoading}
            />
          ) : null}
        </>
      )}
    </>
  );
};

export const DynamicFormWrapper = ({
  handleDialogClose,
  isDataChangedRef,
  item,
  docID,
  defaultView,
  alertMessage,
}) => {
  const classes = useDialogStyles();
  const { state: data }: any = useLocation();

  return (
    <>
      <Dialog
        open={true}
        //@ts-ignore
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            width: "70%",
          },
        }}
        maxWidth="md"
        classes={{
          scrollPaper: classes.topScrollPaper,
          paperScrollBody: classes.topPaperScrollBody,
        }}
      >
        <DynamicForm
          // data={rows?.[0]?.data ?? ""}
          isDataChangedRef={isDataChangedRef}
          closeDialog={handleDialogClose}
          item={item}
          docID={docID}
          gridData={data}
          defaultView={defaultView}
          alertMessage={alertMessage}
        />
      </Dialog>
    </>
  );
};
