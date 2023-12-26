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
  const mutation = useMutation(API.clearingBankMasterConfigDML, {
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
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

      onClose();
    },
  });

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["clearingBankMasterConfigDML"]);
    };
  }, []);

  const onActionCancel = () => {
    setIsOpenSave(false);
  };
  const onPopupYes = (rows) => {
    mutation.mutate({ data: rows });
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
    data["EXCLUDE"] = Boolean(data["EXCLUDE"]) ? "Y" : "N";
    data["CTS"] = Boolean(data["CTS"]) ? "Y" : "N";

    isErrorFuncRef.current = {
      data: {
        ...data,
        _isNewRow: true,
        COMP_CD: authState.companyID,
        BRANCH_CD: authState.user.branchCode,
      },
      displayData,
      endSubmit,
      setFieldError,
    };
    setIsOpenSave(true);
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
          key={"ClearingBankMasterFormMetadata"}
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
            loading={mutation.isLoading}
          />
        ) : null}
      </Dialog>
      {/* )} */}
    </>
  );
};
