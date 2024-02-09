import { FC, useEffect, useRef, useState, useContext } from "react";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import { queryClient, ClearCacheContext } from "cache";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import { Theme, Dialog, Button } from "@mui/material";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { SubmitFnType } from "packages/form";
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
  // setBankDetail?: any;
}> = ({ isOpen, onClose }) => {
  const isErrorFuncRef = useRef<any>(null);
  const [isOpenSave, setIsOpenSave] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { authState } = useContext(AuthContext);

  const mutation = useMutation(API.clearingBankMasterConfigDML, {
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
      // enqueueSnackbar(data, {
      //   variant: "success",
      // });
      // setBankDetail(data);
      console.log("data", data);
      enqueueSnackbar("Data insert successfully", { variant: "success" });
      onClose();
    },
  });

  // const mutation = useMutation(API.clearingBankMasterConfigDML, {
  //   onError: (error: any) => {
  //     let errorMsg = "Unknown Error occured";
  //     if (typeof error === "object") {
  //       errorMsg = error?.error_msg ?? errorMsg;
  //     }
  //     // endSubmit(false, errorMsg, error?.error_detail ?? "");
  //     if (isErrorFuncRef.current == null) {
  //       enqueueSnackbar(errorMsg, {
  //         variant: "error",
  //       });
  //     } else {
  //       isErrorFuncRef.current?.endSubmit(
  //         false,
  //         errorMsg,
  //         error?.error_detail ?? ""
  //       );
  //     }
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
      queryClient.removeQueries(["clearingBankMasterConfigDML"]);
    };
  }, []);

  const onActionCancel = () => {
    setIsOpenSave(false);
  };
  const onPopupYes = (rows) => {
    mutation.mutate(rows);
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
        key="ClearingBankMasterDialog"
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
