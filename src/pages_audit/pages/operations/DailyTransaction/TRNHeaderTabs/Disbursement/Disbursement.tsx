import { Fragment, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { DisbursementGridMetaData } from "./gridMetadata";
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

export const Disbursement = () => {
  const myGridRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AccDetailContext);
  const [rows, setRows] = useState([]);

  // api define
  const getDisbursementList = useMutation(API.getDisbursementList, {
    onSuccess: (data) => {
      console.log(data, " getDisbursementList detailssss");
      setRows(data);
    },
    onError: (error) => {},
  });

  useEffect(() => {
    console.log(tempStore, "tempStore");
    tempStore?.accInfo?.ACCT_CD &&
      getDisbursementList.mutate(tempStore.accInfo);
  }, [tempStore]);

  return (
    <>
      <GridWrapper
        key={`DisbursementGridMetaData`}
        finalMetaData={DisbursementGridMetaData as GridMetaDataType}
        data={rows}
        setData={() => null}
        loading={getDisbursementList.isLoading}
        refetchData={() => {}}
        ref={myGridRef}
      />
    </>
  );
};
