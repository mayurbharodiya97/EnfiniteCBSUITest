import { Fragment, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { snapShotGridMetaData } from "./gridMetadata";
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
import { useSnackbar } from "notistack";

export const SnapShot = () => {
  const { enqueueSnackbar } = useSnackbar();
  const myGridRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AccDetailContext);
  const [rows, setRows] = useState([]);

  // api define
  const getSnapShotList = useMutation(API.getSnapShotList, {
    onSuccess: (data) => {
      console.log(data, " getSnapShotList detailssss");
      setRows(data);
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
    },
  });

  useEffect(() => {
    tempStore?.accInfo?.ACCT_CD && getSnapShotList.mutate(tempStore.accInfo);
  }, [tempStore]);

  return (
    <>
      <div></div>
      <GridWrapper
        key={`snapShotGridMetaData`}
        finalMetaData={snapShotGridMetaData as GridMetaDataType}
        data={rows}
        setData={() => null}
        loading={getSnapShotList.isLoading}
        refetchData={() => {}}
        ref={myGridRef}
      />
    </>
  );
};
