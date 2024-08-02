import { ClearCacheProvider, queryClient } from 'cache';
import { GridWrapper } from 'components/dataTableStatic/gridWrapper';
import { Fragment, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { RetrievedinfoGridMetaData } from './RetrivalInfoGridMetadata';
import { GridMetaDataType } from 'components/dataTableStatic';
import { ActionTypes } from 'components/dataTable';
import { AuthContext } from 'pages_audit/auth';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { usePopupContext } from 'components/custom/popupContext';
import * as API from './api';
import { useQuery } from 'react-query';
import { Alert } from 'components/common/alert';
import { DateRetrievalDialog } from 'components/custom/dateRetrievalPara';
import { useStyles } from "pages_audit/style";
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

const PayslipissueconfirmationGrid = () => {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dateDialog, setDateDialog] = useState(true);
  const [retrivedValues, setRetrivedValues] = useState([]);
  const [actionMenu, setActionMenu] = useState(actions);
  const [activeFlag, setActiveFlag] = useState("P");
  const isDataChangedRef = useRef<any>(null);

  const setCurrentAction = useCallback(
    async (data) => {
      if (data.name === "Retrive") {
        setDateDialog(true);
      } else if (data.name === "view-All" || data.name === "view-Pending") {
        setActiveFlag(prevActiveSiFlag => {
          const newActiveSiFlag = prevActiveSiFlag === "A" ? "P" : "A";
          setActionMenu(prevActions => {
            const newActions = [...prevActions];
            newActions[0].actionLabel = newActiveSiFlag === "P" ? "View All" : "View Pending";
            newActions[0].actionName = newActiveSiFlag === "P" ? "view-All" : "view-Pending";
            return newActions;
          });
          return newActiveSiFlag;
        });
      } 
      if (data?.name === "view-All") {
          
      }else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );
  
  const { data, isLoading, isFetching, isError, error, refetch:slipdataRefetch } = useQuery<any, any>(
    ["getPayslipCnfRetrieveData",activeFlag], 
    () =>
      API.getPayslipCnfRetrieveData({
        ENT_COMP_CD: authState?.companyID,
        ENT_BRANCH_CD: authState?.user?.branchCode,
        GD_DATE: authState?.workingDate,
        FROM_DT: authState?.workingDate,
        TO_DT: authState?.workingDate,
        FLAG: activeFlag,
      })
  );
  const setGridVal = async (data) => {
    await setRetrivedValues(data);
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
    setGridVal(data)
  }, [data]);
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getPayslipCnfRetrieveData"]);
    };
  }, []);
  const handleRetrivedData = (data)=>{
   setRetrivedValues(data)
  }

  return (
    <Fragment>
      {isError && (
        <Alert
          severity="error"
          errorMsg={error?.error_msg ?? "Something went wrong"}
          errorDetail={error?.error_detail}
          color="error"
        />
      )}
  

      <GridWrapper
        key={"PayslipCnfRetrieveDataGrid"}
        finalMetaData={RetrievedinfoGridMetaData as GridMetaDataType}
        data={retrivedValues ?? []}
        setData={()=>null}
        actions={actionMenu} 
        loading={isLoading || isFetching}
        setAction={setCurrentAction}
        refetchData={() =>{ 
          slipdataRefetch();
          setGridVal(data);
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
    closeDialog={() => { setDateDialog(false) }}
    open={dateDialog}
    onUpload={ (result) =>handleRetrivedData(result) }
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
