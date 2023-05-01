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
import { useLocation } from "react-router-dom";
import { useDialogStyles } from "pages_audit/common/dialogStyles";
import { Transition } from "pages_audit/common/transition";
import { RemarksAPIWrapper } from "components/custom/Remarks";
import * as API from "./api";
import { loanClosureDetailMetadata } from "./metaData";
import { LoaderPaperComponent } from "components/common/loaderPaper";

interface updateLoanClsDetailDataType {
  confirmed: string;
  authRemarks: string;
  trancd: any;
}

const updateLoanClsDetailDataWrapperFn =
  (updateLoanClsDetailData) =>
  async ({ confirmed, authRemarks, trancd }: updateLoanClsDetailDataType) => {
    return updateLoanClsDetailData({ confirmed, authRemarks, trancd });
  };

const LoanClosureDetailViewEdit: FC<{
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
  const { enqueueSnackbar } = useSnackbar();
  const [formMode, setFormMode] = useState(defaultView);
  const isErrorFuncRef = useRef<any>(null);
  const [isOpenAccept, setIsOpenAccept] = useState(false);
  const [isOpenReject, setIsOpenReject] = useState(false);

  const result = useQuery(
    ["getLoanClosureDetailFormData", moduleType, tran_cd],
    () => API.getLoanClosureDetailFormData({ moduleType })(tran_cd)
  );

  const mutation = useMutation(
    updateLoanClsDetailDataWrapperFn(API.updateLoanClosureAcceptRejectData),
    {
      onError: (error: any, { confirmed }) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
        if (confirmed === "R") {
          onActionCancel();
        } else if (confirmed === "Y") {
          onActionCancel();
        }
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
  const updateAcceptData = (val, rows) => {
    mutation.mutate({
      confirmed: "Y",
      authRemarks: val,
      trancd: rows?.TRAN_CD ?? "",
      ...isErrorFuncRef.current,
    });
    //onActionCancel();
    //closeDialog();
  };
  const updateRejectData = (val, rows) => {
    mutation.mutate({
      confirmed: "R",
      authRemarks: val,
      trancd: rows?.TRAN_CD ?? "",
      ...isErrorFuncRef.current,
    });
    //onActionCancel();
    //closeDialog();
  };
  const onActionCancel = () => {
    setIsOpenAccept(false);
    setIsOpenReject(false);
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
    if (actionFlag === "Decline") {
      setIsOpenReject(true);
    } else {
      setIsOpenAccept(true);
    }
    //mutation.mutate({ data, displayData, endSubmit, setFieldError });
  };
  useEffect(() => {
    return () => {
      queryClient.removeQueries([
        "getLoanClosureDetailFormData",
        moduleType,
        tran_cd,
      ]);
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
    viewEditMetaData = cloneDeep(loanClosureDetailMetadata) as MetaDataType;

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
        key={`${dataUniqueKey}-${formMode}-${Date.now()}`}
        metaData={viewEditMetaData as MetaDataType}
        initialValues={formEditData as InitialValuesType}
        onSubmitHandler={onSubmitHandler}
        //@ts-ignore
        displayMode={formMode}
        formStyle={{
          background: "white",
          height: "calc(60vh - 140px)",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {({ isSubmitting, handleSubmit }) => (
          <>
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
              onClick={(event) => {
                handleSubmit(event, "Decline");
              }}
              disabled={isSubmitting}
              //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              color={"primary"}
            >
              Reject
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
      <RemarksAPIWrapper
        TitleText={"Accept Remarks"}
        onActionNo={() => onActionCancel()}
        onActionYes={updateAcceptData}
        isLoading={mutation.isLoading}
        isEntertoSubmit={true}
        AcceptbuttonLabelText="Ok"
        CanceltbuttonLabelText="Cancel"
        open={isOpenAccept}
        rows={formEditData}
      />
      <RemarksAPIWrapper
        TitleText={"Rejection Remarks"}
        onActionNo={() => onActionCancel()}
        onActionYes={updateRejectData}
        isLoading={mutation.isLoading}
        isEntertoSubmit={true}
        AcceptbuttonLabelText="Ok"
        CanceltbuttonLabelText="Cancel"
        open={isOpenReject}
        rows={formEditData}
      />
    </>
  ) : null;
  return renderResult;
};

export const LoanClsDetailEditViewWrapperTs = ({
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
            minHeight: "40vh",
            height: "50vh",
          },
        }}
        maxWidth="md"
        classes={{
          scrollPaper: classes.topScrollPaper,
          paperScrollBody: classes.topPaperScrollBody,
        }}
      >
        <LoanClosureDetailViewEdit
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
