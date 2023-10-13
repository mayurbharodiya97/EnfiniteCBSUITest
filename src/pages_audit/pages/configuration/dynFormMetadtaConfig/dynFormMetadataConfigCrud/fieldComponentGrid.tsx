import { Transition } from "pages_audit/common";
import { Alert } from "components/common/alert";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { FC, useEffect, useRef, useState, useContext } from "react";
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { useMutation, useQuery } from "react-query";
import * as API from "../api";
import { queryClient, ClearCacheContext } from "cache";
import { useSnackbar } from "notistack";
import {
  CreateDetailsRequestData,
  ProcessDetailsData,
  utilFunction,
} from "components/utils";
import { FieldComponentGridMetaData } from "./metaData";
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

export const FieldComponentGrid: FC<{
  isOpen?: any;
  onClose?: any;
  reqDataRef?: any;
  formView: any;
}> = ({ isOpen, onClose, reqDataRef, formView }) => {
  const classes = useDialogStyles();
  const [gridData, setGridData] = useState<any>([]);
  const myGridRef = useRef<any>(null);
  const isErrorFuncRef = useRef<any>(null);
  const [isOpenSave, setIsOpenSave] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { authState } = useContext(AuthContext);
  const { getEntries } = useContext(ClearCacheContext);
  const {
    data: actionData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery<any, any>(
    ["getGridFieldComponentData", { ...reqDataRef.current }],
    () => API.getGridFieldComponentData({ ...reqDataRef.current })
  );
  console.log("reqDataRef", reqDataRef);
  console.log("actionData", actionData);
  const mutation = useMutation(API.dynamiPropsConfigDML, {
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

      onClose();
    },
  });

  // useEffect(() => {
  //   if (Array.isArray(data)) {
  //     setGridData(data);
  //   } else {
  //     setGridData([]);
  //   }
  // }, [data]);
  useEffect(() => {
    return () => {
      let entries = getEntries() || [];
      entries.forEach((one) => {
        queryClient.removeQueries(one);
      });
      queryClient.removeQueries([
        "getGridFieldComponentData",
        { ...reqDataRef.current },
      ]);
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
    mutation.mutate(rows);
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
  //     let finalResult = CreateDetailsRequestData(result);
  //     if (
  //       finalResult?.isDeleteRow?.length === 0 &&
  //       finalResult?.isNewRow?.length === 0 &&
  //       finalResult?.isUpdatedRow?.length === 0
  //     ) {
  //       onClose();
  //     } else {
  //       isErrorFuncRef.current = {
  //         data: {
  //           _isNewRow: false,
  //           DETAILS_DATA: finalResult,
  //         },
  //       };
  //       setIsOpenSave(true);
  //     }
  //   }
  // };
  const onSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    // @ts-ignore
    endSubmit(true);

    let upd: any = ProcessDetailsData(
      data.actionsDetails ?? [],
      actionData ?? []
    );
    // console.log("updation", updation);
    // let upd = utilFunction.transformDetailsData(
    //   data.actionsDetails ?? [],
    //   actionData ?? []
    // );
    // console.log("upd", upd);
    // if (upd["_OLDROWVALUE"]) {
    //   const oldRowValue = upd["_OLDROWVALUE"];

    //   for (const key in oldRowValue) {
    //     if (oldRowValue.hasOwnProperty(key)) {
    //       // Convert boolean values to "Y" or "N"
    //       if (typeof oldRowValue[key] === "boolean") {
    //         oldRowValue[key] = oldRowValue[key] ? "Y" : "N";
    //       }
    //     }
    //   }
    // }
    // if (upd?.isDeleteRow) {
    //   upd.isDeleteRow = upd.isDeleteRow.map((item) => {
    //     const srCdFromIsDeleteRow = actionData?.[0]?.SR_CD ?? "";
    //     return {
    //       ...item,
    //       SR_CD: srCdFromIsDeleteRow,
    //     };
    //   });
    // }
    const updatedData: any = {
      ...reqDataRef.current,
      // _isNewRow: formView === "edit" ? true : false,
      COMP_CD: authState.companyID,
      BRANCH_CD: authState.user.branchCode,
      DETAILS_DATA: upd,
    };
    setIsOpenSave(true);
    isErrorFuncRef.current = {
      data: updatedData,
      displayData,
      endSubmit,
      setFieldError,
    };
    console.log("  isErrorFuncRef.current", isErrorFuncRef.current);
  };
  return (
    // <Dialog
    //   open={isOpen}
    //   //@ts-ignore
    //   TransitionComponent={Transition}
    //   PaperProps={{
    //     style: {
    //       width: "100%",
    //     },
    //   }}
    //   maxWidth="md"
    //   classes={{
    //     scrollPaper: classes.topScrollPaper,
    //     paperScrollBody: classes.topPaperScrollBody,
    //   }}
    // >
    //   <div style={{ padding: "10px" }}>
    //     <AppBar
    //       position="relative"
    //       color="secondary"
    //       style={{ marginBottom: "10px" }}
    //     >
    //       <Toolbar variant="dense">
    //         <Typography
    //           className={classes.title}
    //           color="inherit"
    //           variant={"h6"}
    //           component="div"
    //         >
    //           {"Props Configuration" +
    //             " For " +
    //             reqDataRef.current?.FIELD_NAME ?? ""}
    //         </Typography>
    //         <>
    //           <Button
    //             onClick={onSaveRecord}
    //             color="primary"
    //             // disabled={mutation.isLoading}
    //             // endIcon={
    //             //   mutation.isLoading ? <CircularProgress size={20} /> : null
    //             // }
    //           >
    //             Save
    //           </Button>
    //         </>
    //         <Button
    //           onClick={onClose}
    //           color="primary"
    //           // disabled={mutation.isLoading}
    //         >
    //           Close
    //         </Button>
    //       </Toolbar>
    //     </AppBar>

    //     {isLoading || isFetching ? (
    //       <LoaderPaperComponent />
    //     ) : isError ? (
    //       <Alert
    //         severity="error"
    //         errorMsg={error?.error_msg ?? "Error"}
    //         errorDetail={""}
    //         color="error"
    //       />
    //     ) : mutation.isError ? (
    //       <Alert
    //         severity="error"
    //         errorMsg={mutation.error?.error_msg ?? "Error"}
    //         errorDetail={mutation.error?.error_detail ?? ""}
    //         color="error"
    //       />
    //     ) : (
    //       <>
    //         <GridWrapper
    //           key={"FieldComponentGridMetaData"}
    //           finalMetaData={FieldComponentGridMetaData as GridMetaDataType}
    //           data={gridData}
    //           setData={setGridData}
    //           // loading={isLoading || isFetching || isError}
    //           actions={[]}
    //           setAction={() => {}}
    //           // refetchData={refetch}
    //           ref={myGridRef}
    //         />
    //       </>
    //     )}

    //     {isOpenSave ? (
    //       <PopupMessageAPIWrapper
    //         MessageTitle="Confirmation"
    //         Message="Do you want to save this Request?"
    //         onActionYes={(rowVal) => onPopupYes(rowVal)}
    //         onActionNo={() => onActionCancel()}
    //         rows={isErrorFuncRef.current?.data}
    //         open={isOpenSave}
    //         loading={mutation.isLoading}
    //       />
    //     ) : null}
    //   </div>
    // </Dialog>
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
              height: "100%",
            },
          }}
          key="actionsFormDialog"
        >
          <FormWrapper
            key={"FieldComponentGridMetaData"}
            metaData={FieldComponentGridMetaData as MetaDataType}
            // displayMode={formMode}
            onSubmitHandler={onSubmitHandler}
            initialValues={{ actionsDetails: actionData } as InitialValuesType}
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
      )}
    </>
  );
};
