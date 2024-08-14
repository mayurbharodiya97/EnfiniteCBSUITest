import { ClearCacheProvider, queryClient } from 'cache';
import { GridWrapper } from 'components/dataTableStatic/gridWrapper';
import { Fragment, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { RetrievedinfoGridMetaData } from './RetrivalInfoGridMetadata';
import { GridMetaDataType } from 'components/dataTableStatic';
import { ActionTypes } from 'components/dataTable';
import { AuthContext } from 'pages_audit/auth';
import { Route, Routes, useNavigate } from 'react-router-dom';
import * as API from './api';
import { useQuery } from 'react-query';
import { Alert } from 'components/common/alert';
import { DataRetrival } from './RetriveData';
import { PayslipConfirmationFormDetails } from './payslipConfirmationForm';

const actions: ActionTypes[] = [
  {
    actionName: "view-All",
    actionLabel: "View All",
    multiple: undefined,
    alwaysAvailable: true,
  },
  {
    actionName: "view-details",
    actionLabel: "View Detail",
    multiple: false,
    rowDoubleClick: true,
  },
  {
    actionName: "Retrive",
    actionLabel: "Retrive",
    multiple: undefined,
    alwaysAvailable: true,
  },
];

interface PayslipData {
  TRAN_CD: string;
  AMOUNT: string;
  TOTAL_AMT?: number; // Optional because it's calculated
}

const PayslipissueconfirmationGrid = () => {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dateDialog, setDateDialog] = useState(true); // Changed to false to not show dialog initially
  const [retrivedValues, setRetrivedValues] = useState<PayslipData[]>([]);
  const [actionMenu, setActionMenu] = useState(actions);
  const [activeFlag, setActiveFlag] = useState("P");
  const isDataChangedRef = useRef(false);

  const { data, isLoading, isFetching, isError, error, refetch: slipdataRefetch } = useQuery<PayslipData[], Error>(
    ["getPayslipCnfRetrieveData", activeFlag],
    () =>
      API.getPayslipCnfRetrieveData({
        A_LANG: "en",
        ENT_COMP_CD: authState?.companyID ?? "",
        ENT_BRANCH_CD: authState?.user?.branchCode ?? "",
        GD_DATE: authState?.workingDate ?? "",
        FROM_DT: authState?.workingDate ?? "",
        TO_DT: authState?.workingDate ?? "",
        FLAG: activeFlag,
      }),
    {
      enabled: !!authState?.companyID && !!authState?.user?.branchCode && !!authState?.workingDate,
    }
  );

  useEffect(() => {
    if (data) {
      const totals = data.reduce<Record<string, number>>((acc, obj) => {
        const amount = parseFloat(obj.AMOUNT);
        acc[obj.TRAN_CD] = (acc[obj.TRAN_CD] || 0) + amount;
        return acc;
      }, {});

      const processedData = data.map(obj => ({
        ...obj,
        TOTAL_AMT: totals[obj.TRAN_CD],
      }));

      setRetrivedValues(processedData);
    }
  }, [data]);

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getPayslipCnfRetrieveData"]);
    };
  }, []);

  const setCurrentAction = useCallback(
    async (data) => {
      if (data.name === "Retrive") {
        setDateDialog(true);
      } else if (data.name === "view-All" || data.name === "view-Pending") {
        setActiveFlag(prevActiveFlag => {
          const newFlag = prevActiveFlag === "A" ? "P" : "A";
          setActionMenu(prevActions => [
            {
              ...prevActions[0],
              actionLabel: newFlag === "P" ? "View All" : "View Pending",
              actionName: newFlag === "P" ? "view-All" : "view-Pending",
            },
            ...prevActions.slice(1),
          ]);
          return newFlag;
        });
      } else {
        navigate(data.name, {
          state: data.rows,
        });
      }
    },
    [navigate]
  );

  const handleRetrivedData = (data: PayslipData[] | null) => {
    if (!Array.isArray(data)) {
      console.error("Invalid data format:", data);
      return;
    }

    const totals = data.reduce<Record<string, number>>((acc, obj) => {
      const amount = parseFloat(obj.AMOUNT);
      acc[obj.TRAN_CD] = (acc[obj.TRAN_CD] || 0) + amount;
      return acc;
    }, {});

    const processedData = data.map(obj => ({
      ...obj,
      TOTAL_AMT: totals[obj.TRAN_CD],
    }));

    setRetrivedValues(processedData);
  };

  const handleRefetch = (refetchFn: () => void) => {
    refetchFn();
  }

  const ClosedEventCall = () => {
    if (isDataChangedRef.current) {
      slipdataRefetch();
      isDataChangedRef.current = false;
    }
    navigate(".");
  };

  return (
    <Fragment>
      {isError && (
        <Alert
          severity="error"
          errorMsg={error?.message ?? "Something went wrong"}
          errorDetail={error?.message}
          color="error"
        />
      )}
      <GridWrapper
        key={"PayslipCnfRetrieveDataGrid"}
        finalMetaData={RetrievedinfoGridMetaData as GridMetaDataType}
        data={retrivedValues}
        setData={() => null}
        actions={actionMenu}
        loading={isLoading || isFetching}
        setAction={setCurrentAction}
        refetchData={() => {
          slipdataRefetch();
        }}
      />
      <Routes>
        <Route
          path="view-details/*"
          element={
            <PayslipConfirmationFormDetails
              defaultView={"view"}
              closeDialog={ClosedEventCall}
              slipdataRefetch={slipdataRefetch}
            />
          }
        />
      </Routes>
      <DataRetrival
        closeDialog={() => setDateDialog(false)}
        open={dateDialog}
        onUpload={(data) => {
          if (data) {
            handleRetrivedData(data);
          }
        }}
      />
    </Fragment>
  );
};

export const payslipissueconfirmation = () => {
  return (
    <ClearCacheProvider>
      <PayslipissueconfirmationGrid />
    </ClearCacheProvider>
  );
};
