import { FC, useState, useContext, useRef } from "react";
import { useMutation } from "react-query";
import { ClearCacheContext } from "cache";
import { InitialValuesType, SubmitFnType } from "packages/form";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useSnackbar } from "notistack";
import { useLocation } from "react-router-dom";
import { useDialogStyles } from "pages_audit/common/dialogStyles";
import { Transition } from "pages_audit/common/transition";
import * as API from "../api";
import { AppVersionMasterMetadata } from "./metaData";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { extractMetaData, utilFunction } from "components/utils";

interface updateAppVersionMasterDataType {
  data: object;
  displayData?: object;
  endSubmit?: any;
  setFieldError?: any;
  setLoading?: any;
}

const updateAppVersionMasterDataWrapperFn =
  (updateMasterData) =>
  async ({ data }: updateAppVersionMasterDataType) => {
    return updateMasterData(data);
  };

const AppVersionMasterForm: FC<{
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
  //   ["getinsuMasterFormData", formView, insuCode],
  //   () => API.getinsuMasterFormData({ formView, insuCode })
  // );

  const mutation = useMutation(
    updateAppVersionMasterDataWrapperFn(API.updateAppVersionMasterData),
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
    mutation.mutate(isErrorFuncRef.current);
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
    // if (!(formView === "add")) {
    let datanew = data;
    if (datanew.hasOwnProperty("IS_POPUP")) {
      datanew["IS_POPUP"] = !Boolean(datanew["IS_POPUP"]) ? false : true;
    }
    if (datanew.hasOwnProperty("IS_FORCE_UPDATE")) {
      datanew["IS_FORCE_UPDATE"] = !Boolean(datanew["IS_FORCE_UPDATE"])
        ? false
        : true;
    }
    let updatedValue: any = utilFunction.transformDetailsData(
      datanew,
      rows?.[0]?.data
    );
    if (formView !== "new" && updatedValue?._UPDATEDCOLUMNS?.length === 0) {
      closeDialog();
    } else {
      if (datanew.hasOwnProperty("IS_POPUP")) {
        datanew["IS_POPUP"] = Boolean(datanew["IS_POPUP"]) ? "Y" : "N";
      }
      if (updatedValue?._OLDROWVALUE?.hasOwnProperty("IS_POPUP")) {
        updatedValue._OLDROWVALUE["IS_POPUP"] = Boolean(
          updatedValue._OLDROWVALUE["IS_POPUP"]
        )
          ? "Y"
          : "N";
      }
      if (datanew.hasOwnProperty("IS_FORCE_UPDATE")) {
        datanew["IS_FORCE_UPDATE"] = Boolean(datanew["IS_FORCE_UPDATE"])
          ? "Y"
          : "N";
      }
      if (updatedValue?._OLDROWVALUE?.hasOwnProperty("IS_FORCE_UPDATE")) {
        updatedValue._OLDROWVALUE["IS_FORCE_UPDATE"] = Boolean(
          updatedValue._OLDROWVALUE["IS_FORCE_UPDATE"]
        )
          ? "Y"
          : "N";
      }
      isErrorFuncRef.current = {
        data: {
          ...datanew,
          ...updatedValue,
          _isNewRow: formView === "new" ? true : false,
        },
        displayData,
        endSubmit,
        setFieldError,
      };
    }
    setIsOpenSave(true);
  };
  return (
    <>
      <FormWrapper
        key={"InsuMasterForm"}
        metaData={
          extractMetaData(
            AppVersionMasterMetadata,
            rows?.[0]?.data?.IS_LATEST_VERSION === "Y" ? "new" : formView
          ) as MetaDataType
        }
        initialValues={rows?.[0]?.data as InitialValuesType}
        onSubmitHandler={onSubmitHandler}
        //@ts-ignore
        // displayMode={formMode}
        formStyle={{
          background: "white",
          // height: "30vh",
          // overflowY: "auto",
          // overflowX: "hidden",
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

export const AppVersionMasterFormWrapper = ({
  handleDialogClose,
  isDataChangedRef,
  formView,
}) => {
  const classes = useDialogStyles();
  const { state: rows }: any = useLocation();
  const { getEntries } = useContext(ClearCacheContext);
  return (
    <>
      <Dialog
        open={true}
        //@ts-ignore
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            width: "35%",
          },
        }}
        maxWidth="md"
        classes={{
          scrollPaper: classes.topScrollPaper,
          paperScrollBody: classes.topPaperScrollBody,
        }}
      >
        <div
          style={{
            paddingBottom: "20px",
            paddingRight: "5px",
            paddingLeft: "5px",
          }}
        >
          <AppVersionMasterForm
            isDataChangedRef={isDataChangedRef}
            closeDialog={handleDialogClose}
            formView={formView}
          />
        </div>
      </Dialog>
    </>
  );
};
