import { Grid, Typography } from "@mui/material";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { AuthContext } from "pages_audit/auth";
import { useCallback, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import * as API from "./api";
import { t } from "i18next";
import { ckyc_pending_req_meta_data } from "./metadata";
import { GridMetaDataType } from "components/dataTableStatic";
import { ActionTypes } from "components/dataTable";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Alert } from "components/common/alert";
import FormModal from "./formModal/formModal";
import { format } from "date-fns";

const PendingCustomer = () => {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  const [rowsData, setRowsData] = useState<any[]>([]);

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isCustomerData, setIsCustomerData] = useState(true);

  useEffect(() => {
    if (isLoadingData) {
      setTimeout(() => {
        setIsLoadingData(false);
        setIsCustomerData(true);
      }, 5000);
    }
  }, [isLoadingData]);

  const {
    data: PendingData,
    isError: isPendingError,
    isLoading: isPendingDataLoading,
    isFetching: isPendingDataFetching,
    refetch: PendingRefetch,
    error: PendingError,
  } = useQuery<any, any>(["getPendingData", {}], () =>
    API.getPendingData({
      COMP_CD: authState?.companyID ?? "",
      REQ_FLAG: "A",
      ENTERED_DATE: format(new Date(), "dd-MM-yyyy"),
      // ENTERED_DATE: "26-12-2023"
    })
  );

  const pendingActions: ActionTypes[] = [
    {
      actionName: "view-detail",
      actionLabel: "View Detail",
      multiple: false,
      rowDoubleClick: true,
    },
    {
      actionName: "view-all",
      actionLabel: "View All",
      multiple: false,
      rowDoubleClick: false,
      alwaysAvailable: true,
      isNodataThenShow: true,
    },
  ];

  const setCurrentAction = useCallback(
    (data) => {
      setRowsData(data?.rows);
      navigate(data?.name, {
        state: data?.rows,
      });
    },
    [navigate]
  );

  return (
    <Grid>
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
                variant="h6"
            >
                {t("PendingReq")}
            </Typography> */}
      <Grid item>
        <GridWrapper
          key={`PendingCustEntrties` + PendingData}
          finalMetaData={ckyc_pending_req_meta_data as GridMetaDataType}
          data={PendingData ?? []}
          setData={() => null}
          loading={isPendingDataLoading || isPendingDataFetching}
          actions={pendingActions}
          setAction={setCurrentAction}
          refetchData={() => PendingRefetch()}
          // ref={myGridRef}
        />
      </Grid>
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
              formmode={"edit"}
              from={"pending-entry"}
            />
          }
        />
      </Routes>
    </Grid>
  );
};

export default PendingCustomer;