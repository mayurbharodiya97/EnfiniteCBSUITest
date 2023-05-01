import { FC, useEffect, useState, useContext, useRef } from "react";
import { useQuery, useMutation } from "react-query";
import { ClearCacheContext, queryClient } from "cache";
import { InitialValuesType, SubmitFnType } from "packages/form";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import Dialog from "@material-ui/core/Dialog";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useSnackbar } from "notistack";
import { cloneDeep } from "lodash-es";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useDialogStyles } from "pages_audit/common/dialogStyles";
import { Transition } from "pages_audit/common/transition";
import { RemarksAPIWrapper } from "components/custom/Remarks";
import * as API from "./api";
import { DBRDetailMetadata } from "./metaData";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { FileViewerGrid } from "components/fileUpload";
import { LoaderPaperComponent } from "components/common/loaderPaper";

interface updateDBRDetailDataType {
  rowData: any;
}

const updateDBRDetailDataWrapperFn =
  (updateDBRDetailData) =>
  async ({ rowData }: updateDBRDetailDataType) => {
    return updateDBRDetailData({ rowData });
  };

const DBRDetailViewEdit: FC<{
  moduleType: any;
  isDataChangedRef: any;
  closeDialog?: any;
  defaultView?: "edit";
  setEditFormStateFromInitValues?: any;
  readOnly?: boolean;
  tran_cd: string;
  rowsdata?: any;
}> = ({
  moduleType,
  isDataChangedRef,
  closeDialog,
  defaultView = "edit",
  readOnly = false,
  tran_cd,
  setEditFormStateFromInitValues,
  rowsdata,
}) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [formMode, setFormMode] = useState(defaultView);
  const isErrorFuncRef = useRef<any>(null);
  const [isOpenAccept, setIsOpenAccept] = useState(false);
  const [isOpenReject, setIsOpenReject] = useState(false);
  //const moveToViewMode = useCallback(() => setFormMode("view"), [setFormMode]);
  // const moveToEditMode = useCallback(() => setFormMode("edit"), [setFormMode]);

  const result: any = useQuery(["getDBRDetailFormData", tran_cd], () =>
    API.getDBRDetailFormData(tran_cd)
  );

  const fileData: any = useQuery(["getFileViewerData", tran_cd], () =>
    API.getFileViewerData(tran_cd)
  );

  const mutation = useMutation(
    updateDBRDetailDataWrapperFn(API.updateDBRReqAcceptGridData),

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
        result.refetch();

        enqueueSnackbar(data, {
          variant: "success",
        });
        isDataChangedRef.current = true;
        closeDialog();
      },
    }
  );
  const mutationReject = useMutation(API.updateDBRReqRejectGridData, {
    onSuccess: (response: any) => {
      result.refetch();
      enqueueSnackbar(response, {
        variant: "success",
      });
      isDataChangedRef.current = true;
      closeDialog();
    },
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
  });
  const onReject = (val, rows) => {
    mutationReject.mutate({
      remarks: val,
      trancd: rows?.TRAN_CD ?? "",
      remarksReq: true,
      ...isErrorFuncRef.current,
    });
    onActionCancel();
    closeDialog();
  };
  const onActionCancel = () => {
    // navigate(".", { state: rowsdata });
    setIsOpenAccept(false);
    setIsOpenReject(false);
  };
  const onPopupYes = (rows) => {
    mutation.mutate({
      rowData: rows,
    });
    //onActionCancel();
    //closeDialog();
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

    if (actionFlag === "View") {
      navigate("view-files", { state: rowsdata });
    } else {
      setIsOpenAccept(true);
    }
  };

  const CloseFileViewer = () => {
    navigate(".", { state: rowsdata });
  };
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getDBRDetailFormData", tran_cd]);
      queryClient.removeQueries(["getFileViewerData", tran_cd]);
    };
  }, [tran_cd]);

  const dataUniqueKey = `${result.dataUpdatedAt}`;
  const loading =
    result.isLoading ||
    result.isFetching ||
    fileData.isLoading ||
    fileData.isFetching;
  let isError = result.isError || fileData.isError;
  //@ts-ignore
  let errorMsg = result.isError
    ? `${result.error?.error_msg}`
    : fileData.isError
    ? `${fileData.error?.error_msg}`
    : "";
  errorMsg = Boolean(errorMsg.trim()) ? errorMsg : "Unknown error occured";

  let formEditData = [];
  if (Array.isArray(result.data) && result.data.length > 0) {
    formEditData = Object.assign({}, result.data[0]);
  }

  let viewEditMetaData: MetaDataType = {} as MetaDataType;

  if (result.isSuccess) {
    const formStateFromInitValues =
      typeof setEditFormStateFromInitValues === "function"
        ? setEditFormStateFromInitValues(result.data[0])
        : undefined;
    viewEditMetaData = cloneDeep(DBRDetailMetadata) as MetaDataType;

    viewEditMetaData.form.formState = {
      formCode: viewEditMetaData.form.name,
      ...formStateFromInitValues,
    };
    viewEditMetaData.form.name = `${viewEditMetaData.form.name}-edit`;
    if (viewEditMetaData?.form?.render?.renderType === "stepper") {
      viewEditMetaData.form.render.renderType = "tabs";
    }
  }

  const renderResult = loading ? (
    <>
      <LoaderPaperComponent />
      {typeof closeDialog === "function" ? (
        <div style={{ position: "absolute", right: 0, top: 0 }}>
          <IconButton onClick={closeDialog}>
            <HighlightOffOutlinedIcon />
          </IconButton>
        </div>
      ) : null}
    </>
  ) : isError === true ? (
    <>
      <span>{errorMsg}</span>
      {typeof closeDialog === "function" ? (
        <div style={{ position: "absolute", right: 0, top: 0 }}>
          <IconButton onClick={closeDialog}>
            <HighlightOffOutlinedIcon />
          </IconButton>
        </div>
      ) : null}
    </>
  ) : formMode === "edit" ? (
    <>
      <FormWrapper
        key={`${dataUniqueKey}-${formMode}`}
        metaData={viewEditMetaData as MetaDataType}
        initialValues={formEditData as InitialValuesType}
        onSubmitHandler={onSubmitHandler}
        //@ts-ignore
        displayMode={formMode}
        formStyle={{
          background: "white",
          height: "calc(101vh - 140px)",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {({ isSubmitting, handleSubmit }) => (
          <>
            <Button
              onClick={(event) => {
                // handleSubmit(event, "View");
                navigate("view-files", { state: rowsdata });
              }}
              disabled={isSubmitting}
              //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              color={"primary"}
            >
              View Documents
            </Button>
            <Button
              onClick={(event) => {
                handleSubmit(event, "Accept");
              }}
              disabled={isSubmitting}
              //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              color={"primary"}
            >
              Accept
            </Button>
            <Button
              onClick={() => {
                setIsOpenReject(true);
              }}
              disabled={isSubmitting}
              //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              color={"primary"}
            >
              Decline
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
      <PopupMessageAPIWrapper
        MessageTitle="Confirmation"
        Message="Do You want to accept Loan Request?"
        onActionYes={(rowVal) => onPopupYes(rowVal)}
        onActionNo={() => onActionCancel()}
        rows={isErrorFuncRef.current?.data}
        open={isOpenAccept}
        loading={mutation.isLoading}
      />
      <RemarksAPIWrapper
        TitleText={"Rejection Remarks"}
        onActionNo={() => onActionCancel()}
        onActionYes={onReject}
        isLoading={mutationReject.isLoading}
        isEntertoSubmit={true}
        AcceptbuttonLabelText="Ok"
        CanceltbuttonLabelText="Cancel"
        open={isOpenReject}
        rows={formEditData}
      />
      <Routes>
        <Route
          path="view-files"
          element={
            <Dialog fullWidth maxWidth="md" open={true}>
              <FileViewerGrid
                onClose={CloseFileViewer}
                additionalColumns={[]}
                editableFileName={false}
                fileData={fileData.data || []}
              />
            </Dialog>
          }
        />
      </Routes>
    </>
  ) : null;
  return renderResult;
};

export const DBRDetailEditViewWrapper = ({
  handleDialogClose,
  isDataChangedRef,
  moduleType,
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
            width: "100%",
            minHeight: "80vh",
            height: "90vh",
          },
        }}
        maxWidth="lg"
        classes={{
          scrollPaper: classes.topScrollPaper,
          paperScrollBody: classes.topPaperScrollBody,
        }}
      >
        <DBRDetailViewEdit
          tran_cd={rows[0]?.data.TRAN_CD + ""}
          moduleType={moduleType}
          isDataChangedRef={isDataChangedRef}
          closeDialog={handleDialogClose}
          readOnly={false}
          rowsdata={rows}
        />
      </Dialog>
    </>
  );
};
