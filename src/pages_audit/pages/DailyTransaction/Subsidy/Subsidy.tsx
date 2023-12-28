import { Fragment, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { SubsidyGridMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { GridMetaDataType } from "components/dataTable/types";
import { ClearCacheProvider, queryClient } from "cache";
import * as API from "./api";
import { FormWrapper } from "components/dyanmicForm/formWrapper";
import { AuthContext } from "pages_audit/auth";
import { useContext } from "react";
import { InitialValuesType, SubmitFnType } from "packages/form";

export const Subsidy = () => {
  const myGridRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AuthContext);
  const [rows, setRows] = useState([]);

  // api define
  const getDisbursementList = useMutation(API.getSubsidyList, {
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
        key={`SubsidyGridMetaData`}
        finalMetaData={SubsidyGridMetaData as GridMetaDataType}
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
