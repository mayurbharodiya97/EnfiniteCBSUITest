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
import { ParaDetailMetadata } from "./metaData";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";

interface updateAUTHDetailDataType {
  compCode: string;
  paraCode: string;
  dataTypeCode: string;
  paraValue: string;
}

const updateAUTHDetailDataWrapperFn =
  (updateAUTHDetailData) =>
  async ({
    compCode,
    paraCode,
    dataTypeCode,
    paraValue,
  }: updateAUTHDetailDataType) => {
    return updateAUTHDetailData({
      compCode,
      paraCode,
      dataTypeCode,
      paraValue,
    });
  };

const ParameterDetailEdit: FC<{
  isDataChangedRef: any;
  closeDialog?: any;
  defaultView?: "edit";
  tran_cd: string;
}> = ({ isDataChangedRef, closeDialog, defaultView = "edit", tran_cd }) => {
  const { enqueueSnackbar } = useSnackbar();
  const isErrorFuncRef = useRef<any>(null);
  const [isOpenSave, setIsOpenSave] = useState(false);
  const { state: rows }: any = useLocation();

  const mutation = useMutation(
    updateAUTHDetailDataWrapperFn(API.updateParameterMasterData),

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
    mutation.mutate({
      compCode: rows?.COMP_CD ?? "",
      paraCode: rows?.PARA_CD ?? "",
      dataTypeCode: rows?.DATATYPE_CD ?? "",
      paraValue: rows?.PARA_VALUE ?? "",
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
    isErrorFuncRef.current = { data, displayData, endSubmit, setFieldError };
    setIsOpenSave(true);
  };

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getParaDetailFormData", tran_cd]);
    };
  }, [tran_cd]);

  return (
    <>
      <FormWrapper
        key={`paraEditDetail`}
        metaData={ParaDetailMetadata as MetaDataType}
        initialValues={rows?.[0]?.data as InitialValuesType}
        onSubmitHandler={onSubmitHandler}
        //@ts-ignore
        // displayMode={formMode}
        formStyle={{
          background: "white",
          height: "calc(42vh - 100px)",
          overflowY: "auto",
          overflowX: "hidden",
        }}
        containerstyle={{ padding: "10px" }}
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
          Message="Do you want to save this record?"
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

export const ParaDetailEditWrapper = ({
  handleDialogClose,
  isDataChangedRef,
}) => {
  const classes = useDialogStyles();
  const { state: rows }: any = useLocation();
  return (
    <>
      <Dialog
        open={true}
        //@ts-ignore
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            width: "100%",
            // minHeight: "36vh",
            // height: "36vh",
          },
        }}
        maxWidth="md"
        classes={{
          scrollPaper: classes.topScrollPaper,
          paperScrollBody: classes.topPaperScrollBody,
        }}
      >
        <ParameterDetailEdit
          tran_cd={rows[0]?.data.TRAN_CD + ""}
          isDataChangedRef={isDataChangedRef}
          closeDialog={handleDialogClose}
        />
      </Dialog>
    </>
  );
};
