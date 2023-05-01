import { FC, useEffect, useState, useContext, useRef } from "react";
import { useQuery, useMutation } from "react-query";
import { ClearCacheContext, queryClient } from "cache";
import { InitialValuesType, SubmitFnType } from "packages/form";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import Dialog from "@mui/material/Dialog";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useSnackbar } from "notistack";
import { cloneDeep } from "lodash-es";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useDialogStyles } from "pages_audit/common/dialogStyles";
import { Transition } from "pages_audit/common/transition";
import { RemarksAPIWrapper } from "components/custom/Remarks";
import * as API from "./api";
import { cibDetailMetadata } from "./metaData";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { FileUploadControl } from "components/fileUpload";
import { LoaderPaperComponent } from "components/common/loaderPaper";

interface updateCibDetailDataType {
  address: string;
  cibStatus: string;
  cibRemarks: string;
  fileName: string;
  trancd: any;
  dataFile?: any;
  userName: string;
}

const updateCibDetailDataWrapperFn =
  (updateCibDetailData) =>
  async ({
    address,
    cibStatus,
    cibRemarks,
    fileName,
    trancd,
    dataFile,
    userName,
  }: updateCibDetailDataType) => {
    return updateCibDetailData({
      address,
      cibStatus,
      cibRemarks,
      fileName,
      trancd,
      dataFile,
      userName,
    });
  };

const CibDetailViewEdit: FC<{
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
  const isFileRef = useRef<any>(null);
  const lastClickRef = useRef<any>(null);
  const [isOpenAccept, setIsOpenAccept] = useState(false);
  const [isOpenReject, setIsOpenReject] = useState(false);
  //const moveToViewMode = useCallback(() => setFormMode("view"), [setFormMode]);
  // const moveToEditMode = useCallback(() => setFormMode("edit"), [setFormMode]);

  const result = useQuery(["getCibDetailFormData", moduleType, tran_cd], () =>
    API.getCibDetailFormData({ moduleType })(tran_cd)
  );

  const mutation = useMutation(
    updateCibDetailDataWrapperFn(API.updateCIBReqAcceptGridData),
    {
      onError: (error: any, { cibStatus }) => {
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
        //if (cibStatus == "C") {
        onActionCancel();
        //}
      },
      onSuccess: (data) => {
        //result.refetch();
        enqueueSnackbar(data, {
          variant: "success",
        });
        isDataChangedRef.current = true;
        //onActionCancel();
        closeDialog();
      },
    }
  );
  const mutationReject = useMutation(API.updateCIBReqRejectGridData, {
    onSuccess: (response: any) => {
      //result.refetch();
      enqueueSnackbar(response, {
        variant: "success",
      });
      isDataChangedRef.current = true;
      //onActionCancel();
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
      ...isErrorFuncRef.current,
    });
    onActionCancel();
    closeDialog();
  };
  const onActionCancel = () => {
    //navigate(".", { state: rowsdata });
    setIsOpenAccept(false);
    setIsOpenReject(false);
  };
  const onPopupYes = (rows) => {
    mutation.mutate({
      address: rows?.PERMANENT_ADD ?? "",
      cibStatus: rows?.CIB_STATUS ?? "",
      cibRemarks: rows?.CIB_REMARKS ?? "",
      fileName: rows?.FILE_NAME ?? "",
      trancd: rows?.TRAN_CD ?? "",
      dataFile: isFileRef.current?.base64Object,
      userName: rows?.USER_NAME ?? "",
      ...isErrorFuncRef.current,
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
    if (actionFlag === "Upload") {
      navigate("upload", { state: rowsdata });
    } else {
      if (
        Array.isArray(isFileRef.current?.base64Object) &&
        (isFileRef.current?.base64Object?.length ?? 0) > 0
      ) {
        setIsOpenAccept(true);
        lastClickRef.current = false;
      } else {
        enqueueSnackbar("File Upload Required.", {
          variant: "warning",
        });
        navigate("upload", { state: rowsdata });
        lastClickRef.current = true;
      }
    }
    //mutation.mutate({ data, displayData, endSubmit, setFieldError });
  };
  const CloseFileUpload = () => {
    navigate(".", { state: rowsdata });
  };
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getCibDetailFormData", moduleType, tran_cd]);
    };
  }, [moduleType, tran_cd]);

  const dataUniqueKey = `${result.dataUpdatedAt}`;
  const loading = result.isLoading || result.isFetching;
  let isError = result.isError;
  //@ts-ignore
  let errorMsg = `${result.error?.error_msg}`;
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
    viewEditMetaData = cloneDeep(cibDetailMetadata) as MetaDataType;

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
          height: "calc(94vh - 100px)",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {({ isSubmitting, handleSubmit }) => (
          <>
            <Button
              onClick={(event) => {
                handleSubmit(event, "Upload");
              }}
              disabled={isSubmitting}
              //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              color={"primary"}
            >
              Upload
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
                //handleSubmit(event, "Decline", false);
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
      {isOpenAccept ? (
        <PopupMessageAPIWrapper
          MessageTitle="Confirmation"
          Message="Do You want to accept Loan Request?"
          onActionYes={(rowVal) => onPopupYes(rowVal)}
          onActionNo={() => onActionCancel()}
          rows={isErrorFuncRef.current?.data}
          open={isOpenAccept}
          loading={mutation.isLoading}
        />
      ) : null}
      {isOpenReject ? (
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
      ) : null}
      <Routes>
        <Route
          path="upload"
          element={
            <Dialog fullWidth maxWidth="md" open={true}>
              <FileUploadControl
                key={
                  "FileUploadData" + (isFileRef.current?.result ?? []).length
                }
                onClose={() => {
                  lastClickRef.current = false;
                  CloseFileUpload();
                }}
                additionalColumns={[]}
                editableFileName={false}
                dataChangedRef={isDataChangedRef}
                defaultFileData={isFileRef.current?.result ?? []}
                onUpload={(
                  formDataObj,
                  proccessFunc,
                  ResultFunc,
                  base64Object,
                  result
                ) => {
                  isFileRef.current = { formDataObj, base64Object, result };
                  CloseFileUpload();
                  if (lastClickRef.current && Array.isArray(base64Object)) {
                    setIsOpenAccept(true);
                  }
                }}
                gridProps={{}}
                maxAllowedSize={1024 * 1204 * 10} //10Mb file
                allowedExtensions={["pdf", "jpg", "jpeg", "png"]}
                onUpdateFileData={(files) => {
                  if (Array.isArray(files) && files.length === 0) {
                    isFileRef.current = {
                      ...isFileRef.current,
                      formDataObj: [],
                      base64Object: [],
                      result: [],
                    };
                  }
                }}
              />
            </Dialog>
          }
        />
      </Routes>
    </>
  ) : null;
  return renderResult;
};

export const CibDetailEditViewWrapper = ({
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
            height: "100vh",
          },
        }}
        maxWidth="lg"
        classes={{
          scrollPaper: classes.topScrollPaper,
          paperScrollBody: classes.topPaperScrollBody,
        }}
      >
        <CibDetailViewEdit
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
