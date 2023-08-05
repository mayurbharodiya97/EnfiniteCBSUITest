import { Button, Dialog } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import * as API from "../api";
import { ClearCacheContext, queryClient } from "cache";
import { useSnackbar } from "notistack";
import { ActionsMetaData } from "./actionMetadata";
import { makeStyles } from "@mui/styles";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { SubmitFnType } from "packages/form";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { AuthContext } from "pages_audit/auth";
import { LoaderPaperComponent } from "components/common/loaderPaper";
export const useDialogStyles = makeStyles({
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
});
export const ActionFormWrapper = ({ isOpen, formMode, onClose }) => {
  const { authState } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [isOpenSave, setIsOpenSave] = useState(false);
  const isErrorFuncRef = useRef<any>(null);

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["actionsFormData"], () =>
    API.actionsFormData({
      COMP_CD: authState?.companyID ?? "",
      BRANCH_CD: authState?.user?.branchCode ?? "",
    })
  );
  console.log("data", data);
  // const mutation = useMutation(API.actionsGridData(), {
  //   onError: (error: any) => {},
  //   onSuccess: (data) => {
  //     enqueueSnackbar(data, {
  //       variant: "success",
  //     });
  //     onClose();
  //   },
  // });
  // useEffect(() => {
  //   return () => {
  //     queryClient.removeQueries(["actionsGridData"]);
  //   };
  // }, []);

  const onSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    // @ts-ignore
    endSubmit(true);

    // let newData = {
    //   IS_VIEW_NEXT: Boolean(data?.IS_VIEW_NEXT) ? "Y" : "N" ?? "",
    // };

    // let oldData = {
    //   IS_VIEW_NEXT: mainData?.IS_VIEW_NEXT ? "Y" : "N" ?? "",
    // };

    // let upd: any = utilFunction.transformDetailsData(newData, oldData ?? {});

    // if (upd?._UPDATEDCOLUMNS?.length > 0) {
    //   isErrorFuncRef.current = {
    //     data: {
    //       ...newData,
    //       ...upd,
    //       TRAN_CD: mainData?.TRAN_CD ?? "",
    //       COMP_CD: authState?.companyID ?? "",
    //       BRANCH_CD: authState?.user?.branchCode ?? "",
    //       SR_CD: "1",
    //       _isNewRow: formView === "view" ? true : false,
    //     },
    //     displayData,
    //     endSubmit,
    //     setFieldError,
    //   };
    //   setIsOpenSave(true);
    // }
  };
  // const onSaveRecord = async () => {
  //   let { hasError, data: dataold } = await myGridRef.current?.validate();
  //   if (hasError === true) {
  //     if (dataold) {
  //       setGridData(dataold);
  //     }
  //   } else {
  //     let result = myGridRef?.current?.cleanData?.();
  //     if (!Array.isArray(result)) {
  //       result = [result];
  //     }
  //     let finalResult = result.filter(
  //       (one) => !(Boolean(one?._hidden) && Boolean(one?._isNewRow))
  //     );
  //     if (finalResult.length === 0) {
  //       onClose();
  //     } else {
  //       finalResult = CreateDetailsRequestData(finalResult);
  //       if (
  //         finalResult?.isDeleteRow?.length === 0 &&
  //         finalResult?.isNewRow?.length === 0 &&
  //         finalResult?.isUpdatedRow?.length === 0
  //       ) {
  //         onClose();
  //       } else {
  //         // let reqData = {
  //         //   ...reqDataRef.current,
  //         //   DETAILS_DATA: finalResult,
  //         // };
  //         // mutation.mutate({ data: reqData });
  //       }
  //     }
  //   }
  // };
  const onPopupYes = (rows) => {
    // mutation.mutate(rows);
  };
  const onActionCancel = () => {
    setIsOpenSave(false);
  };
  return (
    <>
      {isLoading || isFetching ? (
        <LoaderPaperComponent />
      ) : (
        <Dialog
          fullWidth
          maxWidth="lg"
          open={true}
          PaperProps={{
            style: {
              width: "100%",
              height: "50%",
            },
          }}
          key="filepreviewDialog"
        >
          <FormWrapper
            key={"actionsForm"}
            metaData={ActionsMetaData as MetaDataType}
            onSubmitHandler={onSubmitHandler}
            initialValues={undefined}
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
              onActionYes={(rowVal) => onPopupYes(rowVal)}
              onActionNo={() => onActionCancel()}
              rows={isErrorFuncRef.current?.data}
              open={isOpenSave}
              // loading={mutation.isLoading}
            />
          ) : null}
        </Dialog>
      )}
    </>
  );
};
