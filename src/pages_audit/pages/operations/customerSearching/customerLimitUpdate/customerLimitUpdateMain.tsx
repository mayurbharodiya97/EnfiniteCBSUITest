import { Fragment, useEffect, useContext, useMemo } from "react";
import { useQuery } from "react-query";
import { useSnackbar } from "notistack";
import { useLocation } from "react-router-dom";
import { CustomerLimitUpdate } from "./customerLimitUpdate";
import * as API from "./api";
import { queryClient, ClearCacheContext, ClearCacheProvider } from "cache";
const transformData = (data: any) => {
  if (Array.isArray(data)) {
    return data.map((one, index) => ({
      ...one,
      id: index,
      _hidden: false,
      _isNewRow: false,
    }));
  } else {
    return data;
  }
};
export const CustomerLimitUpdateMain = ({ ClosedEventCall, RefreshData }) => {
  return (
    <ClearCacheProvider>
      <CustomerLimitUpdateData
        ClosedEventCall={ClosedEventCall}
        RefreshData={RefreshData}
      />
    </ClearCacheProvider>
  );
};
const CustomerLimitUpdateData = ({ ClosedEventCall, RefreshData }) => {
  const { state: rows }: any = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const { getEntries } = useContext(ClearCacheContext);

  useEffect(() => {
    if (rows === null || rows.length === 0) {
      enqueueSnackbar("Please select one user to get the details", {
        variant: "warning",
      });
      ClosedEventCall();
      return;
    }
  }, [rows, enqueueSnackbar, ClosedEventCall]);
  const UserName = String(rows?.[0]?.data?.CUSTOMER_ID ?? 0);
  const { data, isLoading, isError, error, refetch } = useQuery<any, any>(
    ["getCustomerLimitDetails", UserName],
    () => API.getCustomerLimitDetails(UserName)
  );
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["GetMiscValue"], {
        exact: false,
      });
    };
  }, []);
  useEffect(() => {
    return () => {
      let entries = getEntries() as any[];
      entries.forEach((one) => {
        queryClient.removeQueries(one);
      });
      queryClient.removeQueries(["getCustomerLimitDetails", UserName]);
    };
  }, [getEntries, UserName]);
  const GidData = useMemo(() => transformData(data), [data]);
  const closeEventCalled = (flag) => {
    if (Boolean(flag) && flag === "Y") {
      RefreshData();
    }
    ClosedEventCall();
  };
  return (
    <Fragment>
      <CustomerLimitUpdate
        key={"CustomerLimitUpdate" + data?.length ?? 0}
        ClosedEventCall={closeEventCalled}
        headerData={rows?.[0]?.data ?? {}}
        initConfigData={GidData}
        MaxSrCd={(GidData ?? []).length}
        isLoding={isLoading}
        isError={isError}
        ErrorMessage={error?.error_msg ?? "Error"}
        RefreshData={refetch}
        refID={rows?.[0]?.data}
      />
    </Fragment>
  );
};
