import React, { Fragment, useCallback, useContext, useEffect, useRef, useState } from "react";
import { gridMetadata } from "./gridMetadata";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ActionTypes } from "components/dataTable";
import { GridMetaDataType } from "components/dataTableStatic";
import GridWrapper  from "components/dataTableStatic/";
import { enqueueSnackbar } from "notistack";
import { BankIfscCdMasterFormWrapper } from "./viewDetails/bankIfscCodeMasterViewDetails";
import { useMutation, useQuery } from "react-query";
import * as API from './api';
import { AuthContext } from "pages_audit/auth";
import { Alert } from "components/common/alert";
import { queryClient } from "cache";
import { usePopupContext } from "components/custom/popupContext";

import ImportData from "./fileupload/importData";


const actions: ActionTypes[] = [
  {
 actionName: "add",
 actionLabel: "Add",
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
 actionName: "Delete",
 actionLabel: "Delete",
 multiple: false,
},
{ 
actionName: "Import",
actionLabel: "Import",
multiple: undefined,
rowDoubleClick: false,
alwaysAvailable:true,
},
];

const BankIfscCodeMaasterGrid = ()=> {
  
  const {authState} = useContext(AuthContext);
  const navigate = useNavigate();
  const isDeleteDataRef = useRef<any>(null);
  const isDataChangedRef = useRef<any>(null);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const setCurrentAction = useCallback(
  async  (data) => {
      if (data?.name === "Delete") {
        isDeleteDataRef.current = data?.rows?.[0];
        const btnName = await MessageBox({
          message: "Are you sure to delete selected row?",
          messageTitle: "Confirmation",
          buttonNames: ["Yes", "No"],
          loadingBtnName: ["Yes"],
        });
        if (btnName === "Yes") {
          deleteMutation.mutate({
            ...isDeleteDataRef.current?.data,
            _isDeleteRow: true,
          });
        }
      }
      navigate(data?.name, {
        state: data?.rows,
      });
    },
    [navigate]
);

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
  any,
  any
>(["getBankIfscCdData"], () =>
  API.getBankIfscCdData({
    companyID: authState?.companyID,
    branchCode: authState?.user?.branchCode,
  })
);
const deleteMutation = useMutation(API.deleteupdateBankIfscCodeData, {
  onError: (error: any) => {},
  onSuccess: (data) => {
    enqueueSnackbar("Records successfully deleted", {
      variant: "success",
    });
    refetch();
    CloseMessageBox();
  },
});



const ClosedEventCall = () => {
  if (isDataChangedRef.current === true) {
    isDataChangedRef.current = true;
    refetch();
    isDataChangedRef.current = false;
  }
  navigate(".");
};
  
useEffect(() => {
  return () => {
    queryClient.removeQueries(["getBankIfscCdData"]);
  };
}, []);

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
      <GridWrapper
        key={"getBankIfscCdDataGrid"}
        finalMetaData={gridMetadata as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        actions={actions}
        loading={isLoading || isFetching}
        setAction={setCurrentAction}
        refetchData={() =>refetch()}
      />
<Routes>
      <Route
          path="add/*"
          element={
            <BankIfscCdMasterFormWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={ClosedEventCall}
              defaultView={"add"}
            />
          }
        />
        <Route
          path="view-details/*"
          element={
            <BankIfscCdMasterFormWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={ClosedEventCall}
              defaultView={"view"}
            />
          }
        />
         <Route
          path="Import/*"
          element={
            <ImportData
            CloseFileUpload={ClosedEventCall}
            />
          }
        />
      </Routes>
     
    </Fragment>
  );
};

export default BankIfscCodeMaasterGrid;

