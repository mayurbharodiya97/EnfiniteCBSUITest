import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { stopPayGridMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import { ClearCacheProvider, queryClient } from "cache";
import * as API from "./api";
import { FormWrapper } from "components/dyanmicForm/formWrapper";
import { AuthContext } from "pages_audit/auth";
import { AccDetailContext } from "pages_audit/auth";
import { useContext } from "react";
import { InitialValuesType, SubmitFnType } from "packages/form";
const actions: ActionTypes[] = [
  {
    actionName: "view-detail",
    actionLabel: "Release",
    multiple: false,
    rowDoubleClick: true,
    alwaysAvailable: true,
  },
  
];
export const StopPay = () => {
  const myGridRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AccDetailContext);
  const [rows, setRows] = useState([]);
  const [dataRow, setDataRow] = useState<any>({});

  // api define
  const getStopPayList = useMutation(API.getStopPayList, {
    onSuccess: (data) => {
      console.log(data, " getStopPayList detailssss");
      setRows(data);
    },
    onError: (error) => {},
  });

  useEffect(() => {
    tempStore?.accInfo?.ACCT_CD && getStopPayList.mutate(tempStore.accInfo);
  }, [tempStore]);
  const setCurrentAction = useCallback((data) => {
    let row = data.rows[0]?.data;
    console.log(row, "rowwww");
    setDataRow(row);

    if (data.name === "view-detail") {
      console.log("heloooo");
    }
  }, []);
  return (
    <>
      <GridWrapper
        key={`stopPayGridMetaData`}
        finalMetaData={stopPayGridMetaData as GridMetaDataType}
        data={rows}
        setData={() => null}
        loading={getStopPayList.isLoading}
        refetchData={() => {}}
        ref={myGridRef}       
         actions={actions}
        setAction={setCurrentAction}
        onlySingleSelectionAllow={true}
        isNewRowStyle={true}
      />
    </>
  );
};
