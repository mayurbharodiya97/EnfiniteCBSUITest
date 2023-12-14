import { Transition } from "pages_audit/common";
import { Alert } from "components/common/alert";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { FC, useEffect, useRef, useState, useContext } from "react";
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import { queryClient, ClearCacheContext } from "cache";
import { useSnackbar } from "notistack";
import {
  CreateDetailsRequestData,
  ProcessDetailsData,
  utilFunction,
} from "components/utils";

import { makeStyles } from "@mui/styles";
import {
  AppBar,
  Grid,
  Toolbar,
  Typography,
  Theme,
  Dialog,
  Button,
  CircularProgress,
} from "@mui/material";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { InitialValuesType, SubmitFnType } from "packages/form";
import { AuthContext } from "pages_audit/auth";
import { ClearingBankMasterFormMetadata } from "./metaData";

export const useDialogStyles = makeStyles((theme: Theme) => ({
  topScrollPaper: {
    alignItems: "center",
  },
  topPaperScrollBody: {
    verticalAlign: "top",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--white)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
}));

export const ClearingBankMaster: FC<{
  isOpen?: any;
  onClose?: any;
}> = ({ isOpen, onClose }) => {
  const isErrorFuncRef = useRef<any>(null);
  const [isOpenSave, setIsOpenSave] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { authState } = useContext(AuthContext);
  const { getEntries } = useContext(ClearCacheContext);
  // const {
  //   data: PropsData,
  //   isLoading,
  //   isFetching,
  //   isError,
  //   error,
  //   refetch,
  // } = useQuery<any, any>(
  //   ["getFormFieldPropsData", { ...reqDataRef.current }],
  //   () => API.getFormFieldPropsData({ ...reqDataRef.current })
  // );

  // const mutation = useMutation(API.dynamiPropsConfigDML, {
  //   onError: (error: any, { endSubmit }) => {
  //     let errorMsg = "Unknown Error occured";
  //     if (typeof error === "object") {
  //       errorMsg = error?.error_msg ?? errorMsg;
  //     }
  //     endSubmit(false, errorMsg, error?.error_detail ?? "");
  //     enqueueSnackbar(errorMsg, { variant: "error" });
  //     onActionCancel();
  //   },
  //   onSuccess: (data) => {
  //     enqueueSnackbar(data, {
  //       variant: "success",
  //     });

  //     onClose();
  //   },
  // });

  useEffect(() => {
    return () => {
      let entries = getEntries() || [];
      entries.forEach((one) => {
        queryClient.removeQueries(one);
      });
      queryClient.removeQueries(["getFormFieldPropsData"]);
    };
  }, [getEntries]);
  // useEffect(() => {
  //   return () => {
  //     queryClient.removeQueries(["getGridFieldComponentData"]);
  //   };
  // }, []);

  const onActionCancel = () => {
    setIsOpenSave(false);
  };
  const onPopupYes = (rows) => {
    // mutation.mutate(rows);
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

    const updatedData: any = {
      COMP_CD: authState.companyID,
      BRANCH_CD: authState.user.branchCode,
      DETAILS_DATA: [],
    };

    setIsOpenSave(true);
    isErrorFuncRef.current = {
      data: updatedData,
      displayData,
      endSubmit,
      setFieldError,
    };
    console.log("isErrorFuncRef.current", isErrorFuncRef.current);
  };

  return (
    <>
      {/* {isLoading || isFetching ? (
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
          key={"PropsComponentFormMetaData"}
          metaData={ClearingBankMasterFormMetadata as MetaDataType}
          // displayMode={formMode}
          onSubmitHandler={onSubmitHandler}
          initialValues={[]}
          // hideHeader={true}
          formStyle={{
            background: "white",
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
                onClick={onClose}
                //disabled={isSubmitting}
                color={"primary"}
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
            onActionYes={(rowVal) => onPopupYes(rowVal)}
            onActionNo={() => onActionCancel()}
            rows={isErrorFuncRef.current?.data}
            open={isOpenSave}
            // loading={mutation.isLoading}
          />
        ) : null}
      </Dialog>
      {/* )} */}
    </>
  );
};
