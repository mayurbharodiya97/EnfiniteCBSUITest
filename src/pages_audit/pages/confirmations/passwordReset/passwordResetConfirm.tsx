import { DetailsGridWithHeader } from "components/detailPopupGridData";
import { PasswordResetForm } from "./metaData";
import { Fragment, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import * as API from "./api";
import { PasswordResetGridMetaData } from "./gridMetadata";
import { GridMetaDataType } from "components/dataTable/types";
import { FilterFormMetaType } from "components/formcomponent/filterform";
import { RemarksAPIWrapper } from "components/custom/Remarks";
import { useMutation, useQuery } from "react-query";
import { Alert } from "components/common/alert";
import { AuthContext } from "pages_audit/auth";

export const PasswordResetConfirm = ({ ClosedEventCall, isRefreshRef }) => {
  const authController = useContext(AuthContext);
  const { state: rows }: any = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [isOpenAccept, setIsOpenAccept] = useState(false);
  const [isOpenReject, setIsOpenReject] = useState(false);
  useEffect(() => {
    if (rows.length === 0) {
      enqueueSnackbar("Please select one user to get the details", {
        variant: "warning",
      });
      ClosedEventCall();
      return;
    }
  }, [rows, enqueueSnackbar, ClosedEventCall]);
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getPasswordResetDetail", rows[0]?.data?.CUSTOMER_ID], () =>
    API.getPasswordResetDetail(rows[0]?.data?.CUSTOMER_ID)
  );
  const mutation = useMutation(API.upadtePasswordResetConfirm, {
    onSuccess: (response: any) => {
      enqueueSnackbar(response, {
        variant: "success",
      });
      isRefreshRef.current = true;
      //onActionCancel();
      ClosedEventCall();
    },
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
      onActionCancel();
    },
  });
  const updateAcceptData = (val, rows) => {
    mutation.mutate({
      confirmed: "Y",
      remarks: val,
      trancd: rows?.TRAN_CD ?? "",
    });
  };
  const updateRejectData = (val, rows) => {
    mutation.mutate({
      confirmed: "R",
      remarks: val,
      trancd: rows?.TRAN_CD ?? "",
    });
  };
  const onActionCancel = () => {
    setIsOpenAccept(false);
    setIsOpenReject(false);
  };
  // const ClickEventManage = useCallback((data, columnvisible) => {
  //   setIsOpenPopup(true);
  // }, []);
  return (
    <Fragment>
      {isError && (
        <Alert
          severity="error"
          errorMsg={error?.error_msg ?? "Something went to wrong.."}
          errorDetail={error?.error_detail}
          color="error"
        />
      )}
      <DetailsGridWithHeader
        metadata={PasswordResetGridMetaData as GridMetaDataType}
        ClosedEventCall={ClosedEventCall}
        data={data ?? []}
        isLoading={isLoading || isFetching}
        HeaderMetaData={PasswordResetForm as FilterFormMetaType}
        HeaderData={rows[0]?.data ?? {}}
        ClickEventManage={() => {}}
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
                {PasswordResetForm?.gridConfig?.title ?? ""}
              </Typography>
              <Button
                onClick={(event) => {
                  if (
                    (rows[0]?.data?.LAST_ENTERED_BY || "").toLowerCase() ===
                    (authController?.authState?.user?.id || "").toLowerCase()
                  ) {
                    enqueueSnackbar("You can not accept your own entry.", {
                      variant: "warning",
                    });
                  } else {
                    setIsOpenAccept(true);
                  }
                }}
                color="primary"
              >
                Accept
              </Button>
              <Button
                onClick={(event) => {
                  if (
                    (rows[0]?.data?.LAST_ENTERED_BY || "").toLowerCase() ===
                    (authController?.authState?.user?.id || "").toLowerCase()
                  ) {
                    enqueueSnackbar("You can not reject your own entry.", {
                      variant: "warning",
                    });
                  } else {
                    setIsOpenReject(true);
                  }
                }}
                color="primary"
              >
                Reject
              </Button>
              <Button onClick={handelCloseEvent} color="primary">
                Close
              </Button>
            </Toolbar>
          </AppBar>
        )}
      </DetailsGridWithHeader>
      {isOpenAccept ? (
        <RemarksAPIWrapper
          TitleText={"Accept Remarks"}
          onActionNo={() => onActionCancel()}
          onActionYes={updateAcceptData}
          isLoading={mutation.isLoading}
          isEntertoSubmit={true}
          AcceptbuttonLabelText="Ok"
          CanceltbuttonLabelText="Cancel"
          open={isOpenAccept}
          rows={rows[0]?.data ?? {}}
        />
      ) : null}
      {isOpenReject ? (
        <RemarksAPIWrapper
          TitleText={"Rejection Remarks"}
          onActionNo={() => onActionCancel()}
          onActionYes={updateRejectData}
          isLoading={mutation.isLoading}
          isEntertoSubmit={true}
          AcceptbuttonLabelText="Ok"
          CanceltbuttonLabelText="Cancel"
          open={isOpenReject}
          rows={rows[0]?.data ?? {}}
        />
      ) : null}
    </Fragment>
  );
};
