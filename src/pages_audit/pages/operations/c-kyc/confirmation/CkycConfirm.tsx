import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { AuthContext } from "pages_audit/auth";
import React, { useState, useEffect, useCallback, useContext } from "react";
import { useQuery } from "react-query";
import * as API from "../api";
import { format } from "date-fns";
import { ckyc_pending_req_meta_data } from "../metadata";
import { GridMetaDataType } from "components/dataTableStatic";
import { ActionTypes } from "components/dataTable";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import FormModal from "../formModal/formModal";
import { Grid, Typography } from "@mui/material";
import { t } from "i18next";
import PhotoSignConfirmDialog from "../formModal/formDetails/formComponents/individualComps/PhotoSignConfirmDialog";
import { useSnackbar } from "notistack";


export const CkycConfirm = () => {
  const { authState } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [rowsData, setRowsData] = useState<any[]>([]);
  const navigate = useNavigate();
  const location: any = useLocation();

  // temporary-use-state
  const [isCustomerData, setIsCustomerData] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);
  

  const {
      data: PendingData,
      isError: isPendingError,
      isLoading: isPendingDataLoading,
      isFetching: isPendingDataFetching,
      refetch: PendingRefetch,
  } = useQuery<any, any>(["getConfirmPendingData", {}], () =>
    API.getPendingData({
      COMP_CD: authState?.companyID ?? "",
      // BRANCH_CD: authState?.user?.branchCode ?? "",
    //   ENTERED_DATE: format(new Date(), "dd-MM-yyyy"),
      REQ_FLAG: "P",
      // ENTERED_DATE:  format(new Date(), "dd-MM-yyyy"),
      // ENTERED_DATE: "22-12-2023"
    })
  )

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
      const maker = data.rows?.[0]?.data?.MAKER
      const loggedinUser = authState?.user?.id;
      if(maker === loggedinUser) {
        enqueueSnackbar("You can not confirm your own posted transaction", {
          variant: "error",
        })
      } else {
        if(data.rows?.[0]?.data?.UPD_TAB_NAME === "EXISTING_PHOTO_MODIFY") {
          navigate("photo-signature", {
            state: data?.rows,
          })
        } else if(data.rows?.[0]?.data?.UPD_TAB_NAME === "FRESH_MODIFY") {
          navigate("view-detail", {
            state: data?.rows,
          })
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
    PendingRefetch()
  }, [location])

    ckyc_pending_req_meta_data.gridConfig.gridLabel = "Confirmation Pending Request";
    ckyc_pending_req_meta_data.gridConfig["containerHeight"] = {
      min: "42vh",
      max: "65vh",
    }

  return (
    <Grid sx={{mx:"10px"}}>
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
          key={`ckycConfirmation`+PendingData}
          finalMetaData={ckyc_pending_req_meta_data as GridMetaDataType}
          data={PendingData ?? []}
          setData={() => null}
          loading={isPendingDataLoading || isPendingDataFetching}
          actions={actions}
          setAction={setCurrentAction}
          refetchData={() => PendingRefetch()}
          // ref={myGridRef}
        />

        <Routes>
          <Route
            path="view-detail/*"
            element={
              <FormModal
                isLoadingData={isLoadingData}
                setIsLoadingData={setIsLoadingData}
                isCustomerData={isCustomerData}
                setIsCustomerData={setIsCustomerData}
                onClose={() => navigate(".")}
                formmode={"view"}
                from={"confirmation-entry"}
              />
            }
          />

          <Route
            path="photo-signature/*"
            element={
              <PhotoSignConfirmDialog
                open={true}
                onClose={() => {
                  navigate(".");
                }}
              />
            }
          />
        </Routes>
    </Grid>
  );
};
