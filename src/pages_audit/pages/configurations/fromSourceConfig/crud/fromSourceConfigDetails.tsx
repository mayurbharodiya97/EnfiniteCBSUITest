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
import { FromSourceConfigSubDetailGrid } from "./fromSourceSubDetails";

interface updateFromSourceConfigDataType {
  data: object;
  displayData?: object;
  endSubmit?: any;
  setFieldError?: any;
  setLoading?: any;
}
const updateFromSourceConfigDetailsDataWrapperFn =
  (updateMasterData) =>
  async ({ data }: updateFromSourceConfigDataType) => {
    return updateMasterData(data);
  };
export const FromSourceConfigDetails = ({
  ClosedEventCall,
  isDataChangedRef,
  defaultmode = "view",
}) => {
  const classes = useDialogStyles();
  const myRef = useRef<any>(null);
  const mysubdtlRef = useRef<any>({});
  const [isLoading, setLoading] = useState(false);
  const [isFromSourceSubDtl, setFromSourceSubDtl] = useState(false);
  const [formMode, setFormMode] = useState(defaultmode);
  const { state: rows }: any = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  const mutationRet: any = useMutation(
    updateFromSourceConfigDetailsDataWrapperFn(
      API.getFromSourceConfigDetailGridData
    )
  );
  const mutation = useMutation(
    updateFromSourceConfigDetailsDataWrapperFn(
      API.updateFromSourceConfigMasterDetailData
    ),
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
    mutationRet.mutate({
      data: { TRAN_CD: rows[0]?.data?.TRAN_CD },
    });
    mysubdtlRef.current = {
      ...mysubdtlRef.current,
      TRAN_CD: rows[0]?.data?.TRAN_CD,
    };
  }, []);
  // const onFormButtonClickHandel = (id) => {
  //   setOpenImgViewer(true);
  // };

  return (
    <Fragment>
      <Dialog
        open={true}
        //@ts-ignore
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            width: "100%",
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
        ) : formMode === "view" ? (
          <MasterDetailsForm
            key={"fromSourceDetails-" + formMode}
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
            formName={"fromSourceDetail"}
            formNameMaster={"fromSourceMaster"}
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
            key={"fromSourceDetails-" + formMode}
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
            formName={"fromSourceDetailEdit"}
            formNameMaster={"fromSourceMasterEdit"}
            onClickActionEvent={(index, id, data) => {
              mysubdtlRef.current = {
                ...mysubdtlRef.current,
                DB_COLUMN: data?.DB_COLUMN,
                DESCRIPTION: data?.DESCRIPTION,
                SR_CD: data?.SR_CD,
              };
              setFromSourceSubDtl(true);
            }}
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
        {isFromSourceSubDtl ? (
          <FromSourceConfigSubDetailGrid
            isOpen={isFromSourceSubDtl}
            formMode={formMode}
            onClose={() => {
              setFromSourceSubDtl(false);
            }}
            reqDataRef={mysubdtlRef}
          />
        ) : null}
      </Dialog>
    </Fragment>
  );
};
