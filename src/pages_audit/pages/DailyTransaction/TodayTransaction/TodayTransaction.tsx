import { Fragment, useEffect, useRef, useState, useContext } from "react";
import { useMutation, useQuery } from "react-query";
import { TodayTransGridMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { GridMetaDataType } from "components/dataTable/types";
import { ClearCacheProvider, queryClient } from "cache";
import * as API from "./api";
import { FormWrapper } from "components/dyanmicForm/formWrapper";
import { AuthContext } from "pages_audit/auth";

import { InitialValuesType, SubmitFnType } from "packages/form";

const TodayTransaction = () => {
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AuthContext);
  const [rows, setRows] = useState([]);

  const getTodayTransList = useMutation(API.getTodayTransList, {
    onSuccess: (data) => {
      console.log(data, " getTodayTransList detailssss");
      setRows(data);
    },
    onError: (error) => {},
  });

  useEffect(() => {
    tempStore?.accInfo?.ACCT_CD && getTodayTransList.mutate(tempStore.accInfo);
  }, [tempStore]);

  const myGridRef = useRef<any>(null);

  return (
    <>
      <GridWrapper
        key={`TodayTransGridMetaData`}
        finalMetaData={TodayTransGridMetaData as GridMetaDataType}
        data={rows}
        setData={() => null}
        // loading={getData.isLoading}
        // setAction={setCurrentAction}
        refetchData={() => {}}
        ref={myGridRef}
      />
    </>
  );
};
export const TodayTransactionForm = () => {
  return (
    <ClearCacheProvider>
      <TodayTransaction />
    </ClearCacheProvider>
  );
};
