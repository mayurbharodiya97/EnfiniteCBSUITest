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
import { Typography } from "@mui/material";
import { t } from "i18next";


export const CkycConfirm = () => {
  const { authState } = useContext(AuthContext);
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
      BRANCH_CD: authState?.user?.branchCode ?? "",
    //   ENTERED_DATE: format(new Date(), "dd-MM-yyyy"),
      REQ_FLAG: "P  ",
      ENTERED_DATE: "06-12-2023",
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
      setRowsData(data?.rows);
      navigate(data?.name, {
        state: data?.rows,
      });
      // }
    },
    // []
    [navigate]
  );

  useEffect(() => {
    PendingRefetch()
  }, [location.pathname])

  return (
    <>
        {/* <Typography
          sx={{
            color: (theme) => theme.palette.grey[700],
            mb: (theme) => theme.spacing(2),
          }}
          variant="h5"
        >
          {t("Confirmation Pending")}
        </Typography> */}
        <Typography
          sx={{
            color: (theme) => theme.palette.grey[700],
            mb: (theme) => theme.spacing(2),
          }}
          variant="h6"
        >
          {t("PendingReq")}
        </Typography>
        <GridWrapper
          key={`PendingCustEntrties`+PendingData}
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
                displayMode={"view"}
              />
            }
          />
        </Routes>
    </>
  );
};
