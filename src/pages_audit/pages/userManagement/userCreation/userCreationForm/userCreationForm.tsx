import { FC, useEffect, useState, useContext, useRef } from "react";
import { useMutation } from "react-query";
import { ClearCacheContext, queryClient } from "cache";
import { InitialValuesType, SubmitFnType } from "packages/form";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useSnackbar } from "notistack";
import { useLocation } from "react-router-dom";
import { useDialogStyles } from "pages_audit/common/dialogStyles";
import { Transition } from "pages_audit/common/transition";
import * as API from "./api";
import { UserCreationFormMetadata } from "./metaData";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { extractMetaData, utilFunction } from "components/utils";
import { AuthContext } from "pages_audit/auth";

interface updateAUTHDetailDataType {
  data: any;
  endSubmit?: any;
}

const updateAUTHDetailDataWrapperFn =
  (updateAUTHDetailData) =>
  async ({ data }: updateAUTHDetailDataType) => {
    return updateAUTHDetailData(data);
  };

const UserCreationForm: FC<{
  isDataChangedRef: any;
  closeDialog?: any;
  formView?: string;
  data: any;
}> = ({ isDataChangedRef, closeDialog, formView, data: reqData }) => {
  const { enqueueSnackbar } = useSnackbar();
  const isErrorFuncRef = useRef<any>(null);
  const [isOpenSave, setIsOpenSave] = useState(false);
  const { authState } = useContext(AuthContext);
  const mutation = useMutation(
    updateAUTHDetailDataWrapperFn(API.updateUserMasterDetails),
    {
      onError: (error: any, { endSubmit }) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        endSubmit(true, errorMsg, error?.error_detail ?? "");
        setIsOpenSave(false);
      },
      onSuccess: (data, { endSubmit }) => {
        endSubmit(true, "");
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
    mutation.mutate({
      data: isErrorFuncRef.current?.data,
      endSubmit: isErrorFuncRef.current?.endSubmit,
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

    let newReqData = data;
    if (!(formView === "add")) {
      let updatedValue: any = utilFunction.transformDetailsData(data, reqData);
      newReqData["ALLOW_RELEASE"] = Boolean(newReqData["ALLOW_RELEASE"])
        ? "Y"
        : "N";
      newReqData["ACTIVE_FLAG"] = Boolean(newReqData["ACTIVE_FLAG"])
        ? "Y"
        : "N";
      updatedValue["_OLDROWVALUE"] = {
        ...updatedValue["_OLDROWVALUE"],
        ALLOW_RELEASE: Boolean(updatedValue["_OLDROWVALUE"]?.ALLOW_RELEASE)
          ? "Y"
          : "N",
        ACTIVE_FLAG: Boolean(updatedValue["_OLDROWVALUE"]?.ACTIVE_FLAG)
          ? "Y"
          : "N",
      };
      if (updatedValue["_UPDATEDCOLUMNS"]?.length === 0) {
        closeDialog();
        return;
      }
      newReqData = { ...newReqData, ...updatedValue };
    } else {
      newReqData["ALLOW_RELEASE"] = Boolean(newReqData["ALLOW_RELEASE"])
        ? "Y"
        : "N";
      newReqData["PRIORITY"] = "0";
      newReqData["FIRST_TIME_REG"] = "Y";
      newReqData["ACTIVE_FLAG"] = "Y";
      newReqData["SIGN_VIEW"] = "Y";
      newReqData["VIEW_MENU_BAR"] = "N";
      newReqData["FOREX_ALLOW"] = "N";
      newReqData["MENU_VISIBLE_PAYROLL"] = "";
      newReqData["MULTI_APP_ACCESS"] = "N";
      newReqData["USER_TYPE"] = "";
      newReqData["DEF_COMP_CD"] = authState.companyID;
      newReqData["DEF_BRANCH_CD"] = authState.user.branchCode;
    }
    newReqData["_isNewRow"] = formView === "add" ? true : false;
    isErrorFuncRef.current = {
      data: newReqData,
      displayData,
      endSubmit,
      setFieldError,
    };
    setIsOpenSave(true);
  };

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["GetSecurityGroupingList"]);
      queryClient.removeQueries(["GetSubTypeMiscValue"]);
      queryClient.removeQueries(["GetUsersNotificationTemplateList"]);
    };
  }, []);

  return (
    <>
      <FormWrapper
        key={"UserCreationForm"}
        metaData={
          extractMetaData(
            UserCreationFormMetadata,
            formView === "add" ? "new" : "edit"
          ) as MetaDataType
        }
        initialValues={reqData as InitialValuesType}
        onSubmitHandler={onSubmitHandler}
        //@ts-ignore
        // displayMode={formMode}
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
          </>
        )}
      </FormWrapper>
      {isOpenSave ? (
        <PopupMessageAPIWrapper
          MessageTitle="Confirmation"
          Message="Do you PopupMessageAPIWrapperwant to save this Request?"
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

export const UserCreationFormWrapper = ({
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
            width: "70%",
          },
        }}
        maxWidth="md"
        classes={{
          scrollPaper: classes.topScrollPaper,
          paperScrollBody: classes.topPaperScrollBody,
        }}
      >
        <UserCreationForm
          data={rows?.[0]?.data ?? ""}
          isDataChangedRef={isDataChangedRef}
          closeDialog={handleDialogClose}
          formView={formView}
        />
      </Dialog>
    </>
  );
};
