import { Fragment, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { LimitGridMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { GridMetaDataType } from "components/dataTable/types";
import { ClearCacheProvider, queryClient } from "cache";
import * as API from "./api";
import { FormWrapper } from "components/dyanmicForm/formWrapper";
import { AuthContext } from "pages_audit/auth";
import { AccDetailContext } from "pages_audit/auth";
import { useContext } from "react";
import { InitialValuesType, SubmitFnType } from "packages/form";

export const Limit = () => {
  const myGridRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AccDetailContext);
  const [rows, setRows] = useState([]);

  const getLimitList = useMutation(API.getLimitList, {
    onSuccess: (data) => {
      console.log(data, " getLimitList");
      setRows(data);
    },
    onError: (error) => {},
  });

  useEffect(() => {
    tempStore?.accInfo?.ACCT_CD && getLimitList.mutate(tempStore.accInfo);
  }, [tempStore]);

  return (
    <>
      <GridWrapper
        key={`LimitGridMetaData`}
        finalMetaData={LimitGridMetaData as GridMetaDataType}
        data={rows}
        setData={() => null}
        loading={getLimitList.isLoading}
        refetchData={() => {}}
        ref={myGridRef}
      />
    </>
  );
};
