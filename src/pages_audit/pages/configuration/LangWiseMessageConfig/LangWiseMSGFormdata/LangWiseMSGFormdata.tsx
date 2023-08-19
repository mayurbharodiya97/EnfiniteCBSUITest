import { MetaDataType } from "components/dyanmicForm";
import { FormWrapper } from "components/dyanmicForm/formWrapper";
import { MasterDetailsForm } from "components/formcomponent";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { langWiseMsgMetaData } from "./metadata";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
} from "@mui/material";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { useLocation } from "react-router-dom";
import { queryClient } from "cache";
import * as API from "../api";
import { useMutation, useQueries, useQuery } from "react-query";
import { AuthContext } from "pages_audit/auth";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { enqueueSnackbar } from "notistack";
interface editMasterDataType {
  data: object;
  displayData?: object;
  endSubmit?: any;
  setFieldError?: any;
  SetLoadingOWN?: any;
}

const editMasterFormDataFnWrapper =
  (editMasterData) =>
  async ({ data }: editMasterDataType) => {
    return editMasterData(data);
  };
const LangWiseMSGFormdataCustom = ({
  defaultView,
  transactionID,
  closeDialog,
  data: reqData,
}) => {
  const [openAccept, setopenAccept] = useState(false);
  const isErrorFuncRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const myRef = useRef<any>(null);
  console.log("<<<myRef", myRef);

  let newref: any = myRef.current;
  console.log("<<<newref", newref);

  const [formMode, setFormMode] = useState(defaultView);
  const moveToViewMode = useCallback(() => setFormMode("view"), [setFormMode]);
  const moveToEditMode = useCallback(() => setFormMode("edit"), [setFormMode]);
  const mutation = useMutation(
    editMasterFormDataFnWrapper(API.editLanguage()),
    {
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

        // isDataChangedRef.current = true;
        closeDialog();
      },
    }
  );
  const result = useQueries([
    {
      queryKey: ["getDetailsLeavesGridData", transactionID],
      queryFn: () => API.getLangMessageDTL(transactionID),
    },
  ]);
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getDetailsLeavesGridData", transactionID]);
    };
  }, [transactionID]);
  const loading = result[0].isLoading || result[0].isFetching;
  let isError = result[0].isError;
  //@ts-ignore
  let errorMsg = `${result[0].error?.error_msg}`;
  errorMsg = Boolean(errorMsg.trim()) ? errorMsg : "Unknown error occured";

  //@ts-ignore
  let error_detail = `${result[0]?.error?.error_detail}`;
  const AddNewRow = () => {
    myRef.current?.addNewRow(true);
  };
  const onPopupYesAccept = (rows) => {
    mutation.mutate({
      data: rows,
    });
  };
  const onActionCancel = () => {
    setopenAccept(false);
  };
  const onSubmitHandler = ({ data, displayData, endSubmit, setFieldError }) => {
    console.log("<<<subb", data, displayData, endSubmit, setFieldError);
    //@ts-ignore
    endSubmit(true);
    isErrorFuncRef.current = { data, displayData, endSubmit, setFieldError };
    setopenAccept(true);
    if (formMode === "new") {
      data["ACTIVE"] = "Y";
    } else {
      data["ACTIVE"] = Boolean(data["ACTIVE"]) ? "Y" : "N";
    }

    data["_OLDROWVALUE"] = {
      ...data["_OLDROWVALUE"],
      ACTIVE: Boolean(data["_OLDROWVALUE"]?.ACTIVE) ? "Y" : "N",
    };

    data["COMP_CD"] = authState.companyID;
  };

  const renderResult = loading ? (
    <div style={{ margin: "2rem" }}>
      <LoaderPaperComponent />
    </div>
  ) : isError === true ? (
    <>
      <div style={{ margin: "1.2rem" }}>
        <Alert
          severity="error"
          // errorMsg={errorMsg}
          // errorDetail={error_detail ?? ""}
        />
      </div>
    </>
  ) : formMode === "new" ? (
    <>
      <MasterDetailsForm
        key={"leavesMaster"}
        metaData={langWiseMsgMetaData}
        ref={myRef}
        initialData={{ _isNewRow: true, DETAILS_DATA: [] }}
        displayMode={"new"}
        onSubmitData={onSubmitHandler}
        isNewRow={true}
        formStyle={{
          background: "white",
          height: "15vh",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {({ isSubmitting, handleSubmit }) => {
          return (
            <>
              <Button
                onClick={AddNewRow}
                disabled={isSubmitting}
                color={"primary"}
              >
                Add Row
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                color={"primary"}
              >
                Save
              </Button>
              <Button
                onClick={closeDialog}
                disabled={isSubmitting}
                color={"primary"}
              >
                Cancel
              </Button>
            </>
          );
        }}
      </MasterDetailsForm>
      {openAccept ? (
        <PopupMessageAPIWrapper
          MessageTitle="Confirmation"
          Message="Do you want to save this Request?"
          onActionYes={(rowVal) => onPopupYesAccept(rowVal)}
          onActionNo={() => onActionCancel()}
          rows={isErrorFuncRef.current?.data}
          open={openAccept}
          loading={mutation.isLoading}
        />
      ) : null}
    </>
  ) : formMode === "view" ? (
    <MasterDetailsForm
      key={"leavesMaster" + formMode}
      metaData={langWiseMsgMetaData}
      ref={myRef}
      initialData={{
        _isNewRow: false,
        ...reqData[0].data,
        DETAILS_DATA: result[0].data,
      }}
      displayMode={formMode}
      isLoading={true}
      onSubmitData={onSubmitHandler}
      isNewRow={false}
      formStyle={{
        background: "white",
        height: "15vh",
        overflowY: "auto",
        overflowX: "hidden",
      }}
      containerstyle={{ padding: "10px" }}
    >
      {({ isSubmitting, handleSubmit }) => {
        return (
          <>
            <Button onClick={moveToEditMode} color={"primary"}>
              Edit
            </Button>
            <Button onClick={closeDialog} color={"primary"}>
              Close
            </Button>
          </>
        );
      }}
    </MasterDetailsForm>
  ) : formMode === "edit" ? (
    <>
      <MasterDetailsForm
        key={"leavesMaster" + formMode}
        metaData={langWiseMsgMetaData}
        ref={myRef}
        initialData={{
          _isNewRow: false,
          ...reqData[0].data,
          DETAILS_DATA: result[0].data,
        }}
        displayMode={formMode}
        isLoading={false}
        onSubmitData={onSubmitHandler}
        isNewRow={false}
        formStyle={{
          background: "white",
          height: "15vh",
          overflowY: "auto",
          overflowX: "hidden",
        }}
        containerstyle={{ padding: "10px" }}
      >
        {({ isSubmitting, handleSubmit }) => {
          return (
            <>
              <Button
                onClick={AddNewRow}
                disabled={isSubmitting}
                color={"primary"}
              >
                Add Row
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                color={"primary"}
              >
                Save
              </Button>
              <Button
                onClick={moveToViewMode}
                disabled={isSubmitting}
                color={"primary"}
              >
                Cancel
              </Button>
            </>
          );
        }}
      </MasterDetailsForm>
      {openAccept ? (
        <PopupMessageAPIWrapper
          MessageTitle="Confirmation"
          Message="Do you want to save this Request?"
          onActionYes={(rowVal) => onPopupYesAccept(rowVal)}
          onActionNo={() => onActionCancel()}
          rows={isErrorFuncRef.current?.data}
          open={openAccept}
          loading={mutation.isLoading}
        />
      ) : null}
    </>
  ) : null;

  return renderResult;
};

export const LangWiseMSGFormdata = ({ defaultView, closeDialog }) => {
  const { state: data }: any = useLocation();
  return (
    <>
      <Dialog
        open={true}
        onClose={closeDialog}
        PaperProps={{
          style: {
            width: "65%",
            // minHeight: "60vh",
            //height: "100vh",
          },
        }}
        maxWidth="md"
      >
        <LangWiseMSGFormdataCustom
          transactionID={data?.[0]?.data?.TRAN_CD}
          defaultView={defaultView}
          closeDialog={closeDialog}
          data={data}
        />
      </Dialog>
    </>
  );
};

export default LangWiseMSGFormdata;
