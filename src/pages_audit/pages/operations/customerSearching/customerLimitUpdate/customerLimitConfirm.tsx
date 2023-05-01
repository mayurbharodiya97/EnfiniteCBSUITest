import { Fragment, useContext, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import { GridMetaDataType } from "components/dataTable/types";
import { FilterFormMetaType } from "components/formcomponent/filterform";
import { ActionTypes } from "components/dataTable";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/styles";

import { CustomerConfirmMetaData, CustomerDetailsForm } from "./gridMetadata";
import { CustomerLimitDetailsUpdate } from "./detailUpdateGrid";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { useSnackbar } from "notistack";
import { SubmitFnType } from "packages/form";
import { AuthContext } from "pages_audit/auth";

const actions: ActionTypes[] = [
  {
    actionName: "Add",
    actionLabel: "Add",
    multiple: false,
    rowDoubleClick: false,
    isNodataThenShow: true,
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
export const CustomerLimitConfirmation = ({
  ClosedEventCall,
  isRefreshRef,
}) => {
  const [mode, setMode] = useState<any>("view");
  const classes = useDialogStyles();
  const { state: rows }: any = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [openAccept, setOpenAccept] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const { authState } = useContext(AuthContext);
  let headerData = rows?.[0]?.data ?? {};
  let refID = {};
  const onSubmitHandler: SubmitFnType = (actionFlag) => {
    //@ts-ignore
    //endSubmit(true);
    if (actionFlag === "Reject") {
      navigate("reject", { state: rows });
    } else {
      navigate("accept", { state: rows });
    }
    //mutation.mutate({ data, displayData, endSubmit, setFieldError });
  };
  const { data, isError, isLoading, error, refetch } = useQuery<any, any>(
    ["getCustomerLimitDetails", headerData?.CUSTOMER_ID],
    () => API.getCustomerLimitDetails(headerData?.CUSTOMER_ID)
  );
  let ErrorMessage = error?.error_msg ?? "Error";
  const result = useMutation(API.updateUserLimitAcceptReject, {
    onSuccess: (response: any) => {
      enqueueSnackbar(response, { variant: "success" });
      //refetch();
      isRefreshRef.current = true;
      ClosedEventCall();
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.error_msg ?? "error", { variant: "error" });
    },
    onSettled: () => {
      onActionCancel();
    },
  });
  const onPopupYesAccept = (rows) => {
    result.mutate({
      UserName: rows[0]?.data?.CUSTOMER_ID ?? "",
      Confirmed: "Y",
    });
  };
  const onPopupYesReject = (rows) => {
    result.mutate({
      UserName: rows[0]?.data?.CUSTOMER_ID ?? "",
      Confirmed: "R",
    });
  };
  const onActionCancel = () => {
    setOpenAccept(false);
    setOpenReject(false);
    //ClosedEventCall();
  };

  return (
    <Fragment>
      <Dialog
        open={true}
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
        {isLoading ? (
          <CustomerLimitDetailsUpdate
            key={"Loading-CustomerLimitDetailsUpdateConf"}
            metadata={CustomerConfirmMetaData as GridMetaDataType}
            ClosedEventCall={ClosedEventCall}
            data={[]}
            HeaderMetaData={CustomerDetailsForm as FilterFormMetaType}
            HeaderData={headerData}
            ClickEventManage={() => {}}
            actions={actions}
            isEditableForm={true}
            mode={mode}
            isLoading={isLoading}
            onSubmit={onSubmitHandler}
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
            metadata={CustomerConfirmMetaData as GridMetaDataType}
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
            onSubmit={onSubmitHandler}
            refID={refID}
          >
            {({ handelCloseEvent, handleSubmit, classes }) => (
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
                  <Button onClick={() => refetch()} color="primary">
                    Retry
                  </Button>
                  <Button onClick={handelCloseEvent} color="primary">
                    Close
                  </Button>
                </Toolbar>
              </AppBar>
            )}
          </CustomerLimitDetailsUpdate>
        ) : (
          <CustomerLimitDetailsUpdate
            key={mode}
            metadata={CustomerConfirmMetaData as GridMetaDataType}
            ClosedEventCall={ClosedEventCall}
            data={data}
            HeaderMetaData={CustomerDetailsForm as FilterFormMetaType}
            HeaderData={headerData}
            ClickEventManage={() => {}}
            actions={actions}
            isEditableForm={true}
            onSubmit={onSubmitHandler}
            mode={mode}
            refID={refID}
            isLoading={false}
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
                  <Button
                    onClick={(event) => {
                      if (
                        (headerData?.LAST_ENTERED_BY || "").toLowerCase() ===
                        (authState.user.id || "").toLowerCase()
                      ) {
                        enqueueSnackbar("You can not confirm your own entry.", {
                          variant: "warning",
                        });
                      } else {
                        setOpenAccept(true);
                      }
                    }}
                    color="primary"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={(event) => {
                      //handleSubmit(event, "Reject");
                      if (
                        (headerData?.LAST_ENTERED_BY || "").toLowerCase() ===
                        (authState.user.id || "").toLowerCase()
                      ) {
                        enqueueSnackbar("You can not reject your own entry.", {
                          variant: "warning",
                        });
                      } else {
                        setOpenReject(true);
                      }
                    }}
                    color="primary"
                  >
                    Revert
                  </Button>
                  <Button onClick={handelCloseEvent} color="primary">
                    Close
                  </Button>
                </Toolbar>
              </AppBar>
            )}
          </CustomerLimitDetailsUpdate>
        )}

        <PopupMessageAPIWrapper
          MessageTitle="Confirmation"
          Message="Do You want to accept this Request?"
          onActionYes={() => onPopupYesAccept(rows)}
          onActionNo={() => onActionCancel()}
          rows={headerData}
          open={openAccept}
          loading={result.isLoading}
        />
        <PopupMessageAPIWrapper
          MessageTitle="Confirmation"
          Message="Do You want to reject this Request?"
          onActionYes={() => onPopupYesReject(rows)}
          onActionNo={() => onActionCancel()}
          rows={headerData}
          open={openReject}
          loading={result.isLoading}
        />
      </Dialog>
    </Fragment>
  );
};
