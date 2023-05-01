import {
  AppBar,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
} from "@material-ui/core";
import { Fragment, useEffect, useRef, useState } from "react";
import { Transition } from "pages_audit/common";
import { useDialogStyles } from "pages_audit/common/dialogStyles";
import { MasterDetailsForm } from "components/formcomponent";
import { FromSourceConfigDetailsMetaData } from "./metadata";
import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";
import { useLocation } from "react-router-dom";
import { useMutation } from "react-query";
import * as API from "../api";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import { Alert } from "components/common/alert";
import { useSnackbar } from "notistack";

interface updateFromSourceTemplateDataType {
  data: object;
  displayData?: object;
  endSubmit?: any;
  setFieldError?: any;
  setLoading?: any;
}
const updateFromSourceTemplateDataWrapperFn =
  (updateMasterData) =>
  async ({ data }: updateFromSourceTemplateDataType) => {
    return updateMasterData(data);
  };
export const FromSourceTemplateDetails = ({
  ClosedEventCall,
  isDataChangedRef,
  defaultmode = "view",
}) => {
  const classes = useDialogStyles();
  const myRef = useRef<any>(null);
  const [isLoading, setLoading] = useState(false);
  const [formMode, setFormMode] = useState(defaultmode);
  const { state: rows }: any = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  const mutationRet: any = useMutation(API.getFromSourceTemplateDetailGridData);
  const mutation = useMutation(
    updateFromSourceTemplateDataWrapperFn(API.updateFromSourceTemplateData),
    {
      onError: (error: any, { endSubmit, setLoading }) => {
        setLoading(false);
        endSubmit(true, error?.error_msg, error?.error_detail);
      },
      onSuccess: (data, { endSubmit, setLoading }) => {
        setLoading(false);
        endSubmit(true);
        enqueueSnackbar("Record Updated successfully.", {
          variant: "success",
        });
        isDataChangedRef.current = true;
        ClosedEventCall();
      },
    }
  );
  const AddNewRow = () => {
    myRef.current?.addNewRow(true);
  };

  const onSubmitHandler = ({
    data,
    resultValueObj,
    resultDisplayValueObj,
    endSubmit,
    setFieldErrors,
    actionFlag,
  }) => {
    setLoading(true);
    mutation.mutate({ data, endSubmit, setLoading });
  };

  useEffect(() => {
    if (defaultmode !== "new") {
      mutationRet.mutate({ TRAN_CD: rows[0]?.data?.TRAN_CD });
    }
  }, []);

  return (
    <Fragment>
      <Dialog
        open={true}
        //@ts-ignore
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            width: "50%",
          },
        }}
        maxWidth="md"
        classes={{
          scrollPaper: classes.topScrollPaper,
          paperScrollBody: classes.topPaperScrollBody,
        }}
      >
        {mutationRet.isLoading ? (
          <div style={{ height: 100, paddingTop: 10 }}>
            <div style={{ padding: 10 }}>
              <LoaderPaperComponent />
            </div>
            {typeof ClosedEventCall === "function" ? (
              <div style={{ position: "absolute", right: 0, top: 0 }}>
                <IconButton onClick={ClosedEventCall}>
                  <HighlightOffOutlinedIcon />
                </IconButton>
              </div>
            ) : null}
          </div>
        ) : mutationRet.isError ? (
          <>
            <div
              style={{
                paddingRight: "10px",
                paddingLeft: "10px",
                height: 100,
                paddingTop: 10,
              }}
            >
              <AppBar position="relative" color="primary">
                <Alert
                  severity="error"
                  errorMsg={mutationRet.error?.error_msg ?? "Unknow Error"}
                  errorDetail={mutationRet.error?.error_detail ?? ""}
                  color="error"
                />
                {typeof ClosedEventCall === "function" ? (
                  <div style={{ position: "absolute", right: 0, top: 0 }}>
                    <IconButton onClick={ClosedEventCall}>
                      <HighlightOffOutlinedIcon />
                    </IconButton>
                  </div>
                ) : null}
              </AppBar>
            </div>
          </>
        ) : formMode === "new" ? (
          <MasterDetailsForm
            key={"fromSourceTemplate-" + formMode}
            metaData={FromSourceConfigDetailsMetaData as MasterDetailsMetaData}
            ref={myRef}
            initialData={{ _isNewRow: true, DETAILS_DATA: [] }}
            displayMode={"New"}
            isLoading={isLoading}
            onSubmitData={onSubmitHandler}
            isNewRow={true}
            containerstyle={{
              padding: "10px",
            }}
            formStyle={{
              background: "white",
              // height: "25vh",
              // overflowY: "auto",
              // overflowX: "hidden",
            }}
            formName={"fromSourceTemplateDetail"}
            formNameMaster={"fromSourceTemplateMaster"}
          >
            {({ isSubmitting, handleSubmit }) => {
              return (
                <>
                  <Button
                    onClick={AddNewRow}
                    disabled={isSubmitting}
                    //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                    color={"primary"}
                  >
                    Add Row
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    endIcon={
                      isSubmitting ? <CircularProgress size={20} /> : null
                    }
                    color={"primary"}
                  >
                    Save
                  </Button>
                  <Button
                    onClick={ClosedEventCall}
                    disabled={isSubmitting}
                    color={"primary"}
                  >
                    Close
                  </Button>
                </>
              );
            }}
          </MasterDetailsForm>
        ) : formMode === "view" ? (
          <MasterDetailsForm
            key={"fromSourceTemplate-" + formMode}
            metaData={FromSourceConfigDetailsMetaData as MasterDetailsMetaData}
            ref={myRef}
            initialData={{
              _isNewRow: false,
              ...(rows?.[0]?.data ?? {}),
              DETAILS_DATA: mutationRet.data || [],
            }}
            displayMode={"view"}
            isLoading={true}
            onSubmitData={onSubmitHandler}
            isNewRow={true}
            containerstyle={{
              padding: "10px",
            }}
            formStyle={{
              background: "white",
              // height: "25vh",
              // overflowY: "auto",
              // overflowX: "hidden",
            }}
            formName={"fromSourceTemplateDetail"}
            formNameMaster={"fromSourceTemplateMaster"}
          >
            {({ isSubmitting, handleSubmit }) => {
              return (
                <>
                  <Button
                    onClick={() => {
                      setFormMode("edit");
                    }}
                    // disabled={isSubmitting}
                    // endIcon={
                    //   isSubmitting ? <CircularProgress size={20} /> : null
                    // }
                    color={"primary"}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={ClosedEventCall}
                    // disabled={isSubmitting}
                    color={"primary"}
                  >
                    Close
                  </Button>
                </>
              );
            }}
          </MasterDetailsForm>
        ) : formMode === "edit" ? (
          <MasterDetailsForm
            key={"fromSourceTemplate-" + formMode}
            metaData={FromSourceConfigDetailsMetaData as MasterDetailsMetaData}
            ref={myRef}
            initialData={{
              _isNewRow: false,
              ...(rows?.[0]?.data ?? {}),
              DETAILS_DATA: mutationRet.data || [],
            }}
            displayMode={"edit"}
            isLoading={isLoading}
            onSubmitData={onSubmitHandler}
            isNewRow={false}
            containerstyle={{
              padding: "10px",
            }}
            formStyle={{
              background: "white",
              // height: "25vh",
              // overflowY: "auto",
              // overflowX: "hidden",
            }}
            formName={"fromSourceTemplateDetailEdit"}
            formNameMaster={"fromSourceTemplateMasterEdit"}
          >
            {({ isSubmitting, handleSubmit }) => {
              return (
                <>
                  <Button
                    onClick={AddNewRow}
                    disabled={isSubmitting}
                    //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                    color={"primary"}
                  >
                    Add Row
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    endIcon={
                      isSubmitting ? <CircularProgress size={20} /> : null
                    }
                    color={"primary"}
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setFormMode("view");
                    }}
                    disabled={isSubmitting}
                    color={"primary"}
                  >
                    Cancel
                  </Button>
                </>
              );
            }}
          </MasterDetailsForm>
        ) : null}
      </Dialog>
    </Fragment>
  );
};
