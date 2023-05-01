import { Fragment, useMemo, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import { Transition } from "pages_audit/common";
import { GridMetaDataType } from "components/dataTable/types";
import { FilterFormMetaType } from "components/formcomponent/filterform";
import { ActionTypes } from "components/dataTable";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/styles";
import * as API from "./api";
import {
  CustomerDetailsGridMetaData,
  CustomerDetailsForm,
} from "./gridMetadata";
import { CustomerLimitDetailsUpdate } from "./detailUpdateGrid";
import {
  CreateDetailsRequestData,
  extractGridMetaData,
  ObjectMappingKeys,
} from "components/utils";
import { useMutation } from "react-query";
import { useSnackbar } from "notistack";
import { CircularProgress } from "@material-ui/core";
const actions: ActionTypes[] = [
  {
    actionName: "Add",
    actionLabel: "Add",
    multiple: false,
    rowDoubleClick: false,
    isNodataThenShow: true,
  },
  {
    actionName: "Add",
    actionLabel: "Add",
    multiple: false,
    rowDoubleClick: false,
  },
];

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
export const CustomerLimitUpdate = ({
  ClosedEventCall,
  headerData,
  initConfigData,
  MaxSrCd = 0,
  isLoding = false,
  isError = false,
  ErrorMessage = "",
  RefreshData = () => {},
  refID,
}) => {
  const [mode, setMode] = useState<any>("view");
  const classes = useDialogStyles();
  const { enqueueSnackbar } = useSnackbar();

  const mutation = useMutation(API.updateUserLimitData, {
    onError: (error: any, { setServerError, setLocalLoding }) => {
      if (typeof setLocalLoding === "function") {
        setLocalLoding(false);
      }
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      setServerError(errorMsg, error?.error_detail ?? "");
    },
    onSuccess: (data, { setServerError, setLocalLoding, isNewRow }) => {
      // queryClient.refetchQueries(["getFormData", transactionID]);
      if (typeof setLocalLoding === "function") {
        setLocalLoding(false);
      }
      setServerError("");
      enqueueSnackbar(data, {
        variant: "success",
      });
      setMode("view");
      if (typeof ClosedEventCall === "function") {
        if (isNewRow) {
          ClosedEventCall("Y");
        } else {
          ClosedEventCall("N");
        }
      }
    },
  });
  const onSubmitForm = ({ data, mode, setServerError, setLocalLoding }) => {
    let { reqData, DETAILS_DATA, ...other } = data;
    let DetailData = CreateDetailsRequestData(reqData);
    let reqmstdata = ObjectMappingKeys(
      other,
      "CUSTOMER_ID",
      "USER_NAME",
      "CUSTOM_USER_NM",
      "CUST_NAME",
      "LIMIT_CONFIGURED"
    );
    let MainReqData = { ...reqmstdata, DETAILS_DATA: DetailData };
    if (
      Boolean(reqmstdata?.LIMIT_CONFIGURED) &&
      reqmstdata?.LIMIT_CONFIGURED === "N"
    ) {
      MainReqData["_isNewRow"] = true;
    } else {
      MainReqData["_isNewRow"] = false;
    }
    if (
      (DetailData?.isNewRow?.length ?? 0) === 0 &&
      (DetailData?.isDeleteRow?.length ?? 0) === 0 &&
      (DetailData?.isUpdatedRow?.length ?? 0) === 0
    ) {
      setMode("view");
    } else {
      if (typeof setLocalLoding === "function") {
        setLocalLoding(true);
      }
      mutation.mutate({
        data: MainReqData,
        setServerError,
        setLocalLoding,
        isNewRow: MainReqData["_isNewRow"],
      });
    }
  };
  return (
    <Fragment>
      <Dialog
        open={true}
        //@ts-ignore
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            width: "100%",
            minHeight: "20vh",
          },
        }}
        maxWidth="lg"
        classes={{
          scrollPaper: classes.topScrollPaper,
          paperScrollBody: classes.topPaperScrollBody,
        }}
      >
        {isLoding ? (
          <CustomerLimitDetailsUpdate
            key={"Loading-CustomerLimitDetailsUpdate"}
            metadata={CustomerDetailsGridMetaData as GridMetaDataType}
            ClosedEventCall={ClosedEventCall}
            data={[]}
            HeaderMetaData={CustomerDetailsForm as FilterFormMetaType}
            HeaderData={headerData}
            ClickEventManage={() => {}}
            actions={actions}
            isEditableForm={true}
            mode={mode}
            isLoading={isLoding}
            onSubmit={onSubmitForm}
            refID={refID}
          >
            {({ handelCloseEvent, handleSubmit, classes }) => (
              <>
                <AppBar
                  position="relative"
                  color="secondary"
                  style={{ marginBottom: "10px" }}
                >
                  <Toolbar variant="dense">
                    <Typography
                      className={classes.title}
                      color="inherit"
                      variant={"h6"}
                      component="div"
                    >
                      {CustomerDetailsForm?.gridConfig?.title ?? ""}
                    </Typography>
                    <Button onClick={handelCloseEvent} color="primary">
                      Close
                    </Button>
                  </Toolbar>
                </AppBar>
              </>
            )}
          </CustomerLimitDetailsUpdate>
        ) : isError ? (
          <CustomerLimitDetailsUpdate
            key={"Error-CustomerLimitDetailsUpdate"}
            metadata={CustomerDetailsGridMetaData as GridMetaDataType}
            ClosedEventCall={ClosedEventCall}
            data={[]}
            HeaderMetaData={CustomerDetailsForm as FilterFormMetaType}
            HeaderData={headerData}
            ClickEventManage={() => {}}
            actions={actions}
            isEditableForm={true}
            mode={mode}
            isError={isError}
            ErrorMessage={ErrorMessage}
            onSubmit={onSubmitForm}
            refID={refID}
          >
            {({ handelCloseEvent, handleSubmit, classes, isLoading }) => (
              <AppBar
                position="relative"
                color="secondary"
                style={{ marginBottom: "10px" }}
              >
                <Toolbar variant="dense">
                  <Typography
                    className={classes.title}
                    color="inherit"
                    variant={"h6"}
                    component="div"
                  >
                    {CustomerDetailsForm?.gridConfig?.title ?? ""}
                  </Typography>
                  <Button onClick={RefreshData} color="primary">
                    Retry
                  </Button>
                  <Button onClick={handelCloseEvent} color="primary">
                    Close
                  </Button>
                </Toolbar>
              </AppBar>
            )}
          </CustomerLimitDetailsUpdate>
        ) : mode === "edit" ? (
          <CustomerLimitDetailsUpdate
            key={mode}
            metadata={CustomerDetailsGridMetaData as GridMetaDataType}
            ClosedEventCall={ClosedEventCall}
            data={initConfigData}
            HeaderMetaData={CustomerDetailsForm as FilterFormMetaType}
            HeaderData={headerData}
            ClickEventManage={() => {}}
            actions={actions}
            isEditableForm={true}
            onSubmit={onSubmitForm}
            mode={mode}
            refID={refID}
          >
            {({
              handelCloseEvent,
              handleSubmit,
              classes,
              handelActionEvent,
              isLoading,
            }) => (
              <AppBar
                position="relative"
                color="secondary"
                style={{ marginBottom: "10px" }}
              >
                <Toolbar variant="dense">
                  <Typography
                    className={classes.title}
                    color="inherit"
                    variant={"h6"}
                    component="div"
                  >
                    {CustomerDetailsForm?.gridConfig?.title ?? ""}
                  </Typography>
                  <Button
                    onClick={() => {
                      handelActionEvent({ name: "Add" });
                    }}
                    color="primary"
                    disabled={Boolean(isLoading)}
                  >
                    Add
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    color="primary"
                    disabled={Boolean(isLoading)}
                    endIcon={
                      Boolean(isLoading) ? <CircularProgress size={20} /> : null
                    }
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => setMode("view")}
                    color="primary"
                    disabled={Boolean(isLoading)}
                  >
                    Cancle
                  </Button>
                </Toolbar>
              </AppBar>
            )}
          </CustomerLimitDetailsUpdate>
        ) : (
          <CustomerLimitDetailsUpdate
            key={mode}
            metadata={CustomerDetailsGridMetaData as GridMetaDataType}
            ClosedEventCall={ClosedEventCall}
            data={initConfigData}
            HeaderMetaData={CustomerDetailsForm as FilterFormMetaType}
            HeaderData={headerData}
            ClickEventManage={() => {}}
            actions={actions}
            isEditableForm={true}
            onSubmit={onSubmitForm}
            mode={mode}
            refID={refID}
          >
            {({
              handelCloseEvent,
              handleSubmit,
              classes,
              handelActionEvent,
            }) => (
              <AppBar
                position="relative"
                color="secondary"
                style={{ marginBottom: "10px" }}
              >
                <Toolbar variant="dense">
                  <Typography
                    className={classes.title}
                    color="inherit"
                    variant={"h6"}
                    component="div"
                  >
                    {CustomerDetailsForm?.gridConfig?.title ?? ""}
                  </Typography>
                  <Button onClick={() => setMode("edit")} color="primary">
                    Edit
                  </Button>
                  <Button onClick={handelCloseEvent} color="primary">
                    Close
                  </Button>
                </Toolbar>
              </AppBar>
            )}
          </CustomerLimitDetailsUpdate>
        )}
      </Dialog>
    </Fragment>
  );
};
