import { DetailsGridWithHeader } from "components/detailPopupGridData";
import { PasswordResetForm } from "./metaData";
import { Fragment, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import * as API from "./api";
import { PasswordResetGridMetaData } from "./gridMetadata";
import { GridMetaDataType } from "components/dataTable/types";
import { FilterFormMetaType } from "components/formcomponent/filterform";
import { useMutation, useQuery } from "react-query";
import { Alert } from "components/common/alert";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { AuthContext } from "pages_audit/auth";

export const CustomerActivationConfirm = ({
  ClosedEventCall,
  isRefreshRef,
}) => {
  const { state: rows }: any = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [isOpenAccept, setIsOpenAccept] = useState(false);
  const [isOpenReject, setIsOpenReject] = useState(false);
  const authController = useContext(AuthContext);

  useEffect(() => {
    if (rows.length === 0) {
      enqueueSnackbar("Please select one user to get the details", {
        variant: "warning",
      });
      ClosedEventCall();
      return;
    }
  }, [rows, enqueueSnackbar, ClosedEventCall]);
  // const result = useMutation(API.getCustomerActivationDetail, {
  //   onSuccess: (response: any) => {},
  //   onError: (error: any) => {},
  // });
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getReleaseUsersGridData", rows[0]?.data?.TRAN_CD], () =>
    API.getCustomerActivationDetail(rows[0]?.data?.TRAN_CD)
  );
  const mutation = useMutation(API.upadteCustomerActivationConfirm, {
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
  const updateAcceptData = (rows) => {
    mutation.mutate({
      confirmed: "Y",
      tranList: [{ TRAN_CD: rows[0]?.data.TRAN_CD + "" ?? "" }],
    });
  };
  const updateRejectData = (rows) => {
    mutation.mutate({
      confirmed: "R",
      tranList: [{ TRAN_CD: rows[0]?.data.TRAN_CD + "" ?? "" }],
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
                    enqueueSnackbar("You can not accept your own Entry.", {
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
                  // if (
                  //   (rows[0]?.data?.LAST_ENTERED_BY || "").toLowerCase() ===
                  //   (authController?.authState?.user?.id || "").toLowerCase()
                  // ) {
                  //   enqueueSnackbar("You can not reject your own Entry.", {
                  //     variant: "warning",
                  //   });
                  // } else {
                  setIsOpenReject(true);
                  // }
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
        <PopupMessageAPIWrapper
          MessageTitle="Confirmation"
          Message="Do You want to accept this Request?"
          onActionYes={() => updateAcceptData(rows)}
          onActionNo={() => onActionCancel()}
          rows={rows[0]?.data ?? {}}
          open={isOpenAccept}
          loading={mutation.isLoading}
        />
      ) : null}
      {isOpenReject ? (
        <PopupMessageAPIWrapper
          MessageTitle="Confirmation"
          Message="Do You want to reject this Request?"
          onActionYes={() => updateRejectData(rows)}
          onActionNo={() => onActionCancel()}
          rows={rows[0]?.data ?? {}}
          open={isOpenReject}
          loading={mutation.isLoading}
        />
      ) : null}
    </Fragment>
  );
};
