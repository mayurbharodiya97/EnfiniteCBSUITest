import { Button, CircularProgress, Dialog } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import * as API from "../api";
import { queryClient } from "cache";
import { useSnackbar } from "notistack";
// import { ActionsMetaData } from "./actionMetadata";
import { makeStyles } from "@mui/styles";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { InitialValuesType, SubmitFnType } from "packages/form";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { AuthContext } from "pages_audit/auth";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { ProcessDetailsData, utilFunction } from "components/utils";
import { useLocation } from "react-router-dom";
import { DynamicDropdownConfigMetaData } from "./metaData";

export const DynamicDropdownConfig = ({
  isDataChangedRef,
  closeDialog,
  defaultView,
  data: reqData,
}) => {
  const { authState } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [isOpenSave, setIsOpenSave] = useState(false);
  const isErrorFuncRef = useRef<any>(null);
  const [formMode, setFormMode] = useState(defaultView);
  const mutation = useMutation(API.dynamiDropdownConfigDML, {
    onError: (error: any, { endSubmit }) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      endSubmit(false, errorMsg, error?.error_detail ?? "");
      enqueueSnackbar(errorMsg, { variant: "error" });
      onActionCancel();
    },
    onSuccess: (data) => {
      enqueueSnackbar(data, {
        variant: "success",
      });

      closeDialog();
    },
  });

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["dynamiDropdownConfigDML"]);
    };
  }, []);

  const convertJsonToParse = reqData?.[0]?.data.DDW_OPTION;
  const parsedDDWOption =
    convertJsonToParse && convertJsonToParse.trim() !== ""
      ? JSON.parse(convertJsonToParse)
      : [];

  const updatedReqData = {
    ...(reqData?.[0]?.data ?? {}),
    DDW_OPTION: parsedDDWOption,
  };

  const onSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    // @ts-ignore
    endSubmit(true);

    let oldData = reqData?.[0]?.data;
    let newData = data;

    if (newData?.DDW_OPTION) {
      let newDataString = JSON.stringify(newData?.DDW_OPTION);
      newData.DDW_OPTION = newDataString;
    }
    let updatedValue: any = utilFunction.transformDetailsData(
      newData,
      oldData ?? {}
    );

    setIsOpenSave(true);
    isErrorFuncRef.current = {
      data: {
        ...newData,
        ...updatedValue,
        COMP_CD: authState.companyID,
        BRANCH_CD: authState.user.branchCode,
        TRAN_CD: reqData?.[0]?.data?.TRAN_CD ?? "",
        _isNewRow: formMode === "add" ? true : false,
      },
      displayData,
      endSubmit,
      setFieldError,
    };
    setFormMode("view");
  };

  const onPopupYes = (rows) => {
    mutation.mutate(rows);
  };
  const onActionCancel = () => {
    setIsOpenSave(false);
  };

  return (
    <>
      {/* {mutation.isLoading ? (
        <LoaderPaperComponent />
      ) : ( */}
      <Dialog
        fullWidth
        maxWidth="lg"
        open={true}
        PaperProps={{
          style: {
            width: "100%",
            height: "100%",
          },
        }}
        key="actionsFormDialog"
      >
        <FormWrapper
          key={"DynamicDropdownConfigMetaData" + formMode}
          metaData={DynamicDropdownConfigMetaData as unknown as MetaDataType}
          displayMode={formMode}
          onSubmitHandler={onSubmitHandler}
          initialValues={{
            ...(reqData?.[0]?.data ?? {}),
            ...updatedReqData,
          }}
          // hideHeader={true}
          formStyle={{
            background: "white",
          }}
        >
          {({ isSubmitting, handleSubmit }) => (
            <>
              {formMode === "edit" ? (
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
                    onClick={() => {
                      setFormMode("view");
                    }}
                    color={"primary"}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </>
              ) : formMode === "add" ? (
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
                    //disabled={isSubmitting}
                    color={"primary"}
                  >
                    Close
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      setFormMode("edit");
                    }}
                    //disabled={isSubmitting}
                    color={"primary"}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={closeDialog}
                    //disabled={isSubmitting}
                    color={"primary"}
                  >
                    Close
                  </Button>
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
            // loading={mutation.isLoading}`
          />
        ) : null}
      </Dialog>
      {/* )} */}
    </>
  );
};

export const DynamicDropdownConfigWrapper = ({
  isDataChangedRef,
  closeDialog,
  defaultView,
}) => {
  const { state: data }: any = useLocation();
  return (
    <Dialog
      open={true}
      // fullScreen={true}
      PaperProps={{
        style: {
          width: "100%",
          // height: "110vh",
          overflow: "auto",
        },
      }}
      maxWidth="lg"
    >
      <DynamicDropdownConfig
        isDataChangedRef={isDataChangedRef}
        closeDialog={closeDialog}
        defaultView={defaultView}
        data={data}
      />
    </Dialog>
  );
};
