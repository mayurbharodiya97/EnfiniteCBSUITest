import { AuthContext } from "pages_audit/auth";
import React, { useState, useEffect, useCallback, useContext } from "react";
import { useQuery } from "react-query";
import * as API from "./api";
import { pendingAcctMetadata } from "./metadata/pendingAcctMetadata";
import { ActionTypes } from "components/dataTable";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import AcctModal from "./AcctModal";
import { Grid } from "@mui/material";
import { useSnackbar } from "notistack";

import {
  MessageBoxWrapper,
  Alert,
  GridMetaDataType,
  GridWrapper,
} from "@acuteinfo/common-base";

const AcctConfirm = () => {
  const { authState } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [rowsData, setRowsData] = useState<any[]>([]);
  const navigate = useNavigate();
  const location: any = useLocation();

  // temporary-use-state
  const [preventConfirmDialog, setPreventConfirmDialog] = useState(false);

  const {
    data: PendingAcct,
    isError: isPendingError,
    isLoading: isPendingAcctLoading,
    isFetching: isPendingAcctFetching,
    refetch: PendingRefetch,
    error: PendingError,
  } = useQuery<any, any>(["getConfirmPendingData", {}], () =>
    API.getPendingAcct({
      COMP_CD: authState?.companyID ?? "",
      BRANCH_CD: authState?.user?.branchCode ?? "",
      REQ_FLAG: "P",
      //   ENTERED_DATE: format(new Date(), "dd-MM-yyyy"),
    })
  );

  const actions: ActionTypes[] = [
    {
      actionName: "view-detail",
      actionLabel: "View Detail",
      multiple: false,
      rowDoubleClick: true,
    },
    // {
    //   actionName: "inactive-customer",
    //   actionLabel: "Inactivate Customer",
    //   multiple: false,
    //   rowDoubleClick: false,
    // },
  ];
  const setCurrentAction = useCallback(
    (data) => {
      // console.log("weohhfdwef", data)
      const maker = data.rows?.[0]?.data?.MAKER;
      const loggedinUser = authState?.user?.id;
      if (maker === loggedinUser) {
        setPreventConfirmDialog(true);
      } else {
        if (data.rows?.[0]?.data?.UPD_TAB_NAME === "EXISTING_PHOTO_MODIFY") {
          navigate("photo-signature", {
            state: data?.rows,
          });
        } else if (data.rows?.[0]?.data?.UPD_TAB_NAME === "FRESH_MODIFY") {
          navigate("view-detail", {
            state: data?.rows,
          });
        } else {
          setRowsData(data?.rows);
          navigate(data?.name, {
            state: data?.rows,
          });
        }
      }
    },
    [navigate]
  );

  useEffect(() => {
    PendingRefetch();
  }, [location]);

  pendingAcctMetadata.gridConfig.gridLabel = "Confirmation Pending Request";
  pendingAcctMetadata.gridConfig["containerHeight"] = {
    min: "60vh",
    max: "calc(100vh - 200px)",
  };

  return (
    <Grid sx={{ mx: "10px" }}>
      {isPendingError && (
        <Alert
          severity={PendingError?.severity ?? "error"}
          errorMsg={PendingError?.error_msg ?? "Something went to wrong.."}
          errorDetail={PendingError?.error_detail}
          color="error"
        />
      )}
      {/* <Typography
          sx={{
            color: (theme) => theme.palette.grey[700],
            mb: (theme) => theme.spacing(2),
          }}
          variant="h5"
        >
          {t("Confirmation Pending")}
        </Typography> */}
      <GridWrapper
        key={`ckycConfirmation` + PendingAcct}
        finalMetaData={pendingAcctMetadata as GridMetaDataType}
        data={PendingAcct ?? []}
        setData={() => null}
        loading={isPendingAcctLoading || isPendingAcctFetching}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => PendingRefetch()}
        // ref={myGridRef}
      />
      {/* old cbs base code according */}
      {/* <MessageBoxWrapper
          MessageTitle={"ALERT"}
          Message={"You can not confirm your own posted transaction"}
          onClickButton={() => {
            setPreventConfirmDialog(false)
            // setConfirmAction(null)
            // setConfirmMsgDialog(false)
            // closeForm()
          }}
          rows={[]}
          buttonNames={["OK"]}
          open={preventConfirmDialog}
        /> */}
      {/* acutecommonbase package cbs base code according */}
      <MessageBoxWrapper
        isOpen={preventConfirmDialog}
        validMessage={"You can not confirm your own posted transactionn"}
        onActionYes={() => {
          setPreventConfirmDialog(false);
          // setConfirmAction(null)
          // setConfirmMsgDialog(false)
          // closeForm()
        }}
        onActionNo={() => {}}
        rows={[]}
      />

      <Routes>
        <Route
          path="view-detail/*"
          element={
            <AcctModal
              onClose={() => navigate(".")}
              formmode={"view"}
              from={"pending-entry"}
            />
          }
        />

        {/* <Route
            path="photo-signature/*"
            element={
              <PhotoSignConfirmDialog
                open={true}
                onClose={() => {
                  navigate(".");
                }}
              />
            }
          /> */}
      </Routes>
    </Grid>
  );
};

export default AcctConfirm;
