import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ActionTypes } from "components/dataTable";
import { GridMetaDataType } from "components/dataTableStatic";
import GridWrapper from "components/dataTableStatic/";
import { useQuery } from "react-query";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import { Alert } from "components/common/alert";
import { ClearCacheProvider, queryClient } from "cache";
import { DataRetrival } from "./DataRetrival";
import { RetrieveGridMetaData } from "./paySlipMetadata";
import { PaySlipIssueEntryData } from "./PayslipIsuueEntryform";

const actions: ActionTypes[] = [
  {
    actionName: "add",
    actionLabel: "Add",
    multiple: undefined,
    alwaysAvailable: true,
  },
  {
    actionName: "Retrive",
    actionLabel: "Retrive",
    multiple: undefined,
    alwaysAvailable: true,
  },
  {
    actionName: "view-details",
    actionLabel: "View Detail",
    multiple: false,
    rowDoubleClick: true,
  },
];

const RetriveDataGrid = () => {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isDataChangedRef = useRef<any>(null);
  const initialRender = useRef<any>(true);
  const [RetreivedData, setRetrievedData] = useState([]);
  const [openDataRetrivalForm, setopenDataRetrivalForm] = useState(false);

  const setCurrentAction = useCallback(
    async (data) => {
      if (data.name === "Retrive") {
        setopenDataRetrivalForm(true);
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch: slipdataRefetch,
  } = useQuery<any, any>(["getRetrievalPaySlipEntryData"], () =>
    API.getRetrievalPaySlipEntryData({
      companyID: authState?.companyID,
      branchCode: authState?.user?.branchCode,
      FROM_DT: authState?.workingDate,
      TO_DT: authState?.workingDate,
      USER_LEVEL: authState?.role,
      GD_DATE: authState?.workingDate,
    })
  );

  useEffect(() => {
    setGridVal(data);
  }, [data]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      if (location.pathname === "/cbsenfinity/operation/payslip-issue-entry") {
        navigate("add");
      }
    }
  }, [location.pathname, navigate]);

  const setGridVal = async (data) => {
    await setRetrievedData(data);
  };

  const ClosedEventCall = () => {
    if (isDataChangedRef.current === true) {
      isDataChangedRef.current = true;
      slipdataRefetch();
      isDataChangedRef.current = false;
    }
    navigate(".");
  };

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getRetrievalPaySlipEntryData"]);
    };
  }, []);

  return (
    <Fragment>
      {isError && (
        <Alert
          severity="error"
          errorMsg={error?.error_msg ?? "Somethingwenttowrong"}
          errorDetail={error?.error_detail}
          color="error"
        />
      )}

      <GridWrapper
        key={"retrieveGridMetaData"}
        finalMetaData={RetrieveGridMetaData as GridMetaDataType}
        data={RetreivedData ?? []}
        setData={() => null}
        actions={actions}
        loading={isLoading || isFetching}
        setAction={setCurrentAction}
        refetchData={async () => {
          slipdataRefetch();
          await setGridVal(data);
        }}
        defaultSortOrder={[{ id: "LEAN_CD", desc: false }]}
      />

      <Routes>
        <Route
          path="add/*"
          element={
            <PaySlipIssueEntryData
              defaultView={"add"}
              closeDialog={ClosedEventCall}
              slipdataRefetch={slipdataRefetch}
            />
          }
        />
        <Route
          path="view-details/*"
          element={
            <PaySlipIssueEntryData
              defaultView={"view"}
              closeDialog={ClosedEventCall}
              slipdataRefetch={slipdataRefetch}
            />
          }
        />
      </Routes>
      <DataRetrival
        closeDialog={() => {
          setopenDataRetrivalForm(false);
        }}
        open={openDataRetrivalForm}
        onUpload={async (result) => {
          setRetrievedData(result);
        }}
      />
    </Fragment>
  );
};

export const PaySlipIssueEntry = () => {
  return (
    <ClearCacheProvider>
      <RetriveDataGrid />
    </ClearCacheProvider>
  );
};
