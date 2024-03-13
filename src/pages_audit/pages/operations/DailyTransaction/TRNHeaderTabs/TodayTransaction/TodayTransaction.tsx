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
import { AccDetailContext } from "pages_audit/auth";

const TodayTransaction = ({ reqData }) => {
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AccDetailContext);
  const myGridRef = useRef<any>(null);
  const [rows, setRows] = useState([]);

  // const getTodayTransList = useMutation(API.getTodayTransList, {
  //   onSuccess: (data) => {
  //     console.log(data, " getTodayTransList detailssss");
  //     setRows(data);
  //   },
  //   onError: (error) => {},
  // });

  // useEffect(() => {
  //   tempStore?.accInfo?.ACCT_CD && getTodayTransList.mutate(tempStore.accInfo);
  // }, [tempStore]);

  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["getTodayTransList", { reqData }], () => API.getTodayTransList(reqData));

  return (
    <>
      {isError ? (
        <Fragment>
          <div style={{ width: "100%", paddingTop: "10px" }}>
            <Alert
              severity={error?.severity ?? "error"}
              errorMsg={error?.error_msg ?? "Error"}
              errorDetail={error?.error_detail ?? ""}
            />
          </div>
        </Fragment>
      ) : null}
      <GridWrapper
        key={`TodayTransGridMetaData`}
        finalMetaData={TodayTransGridMetaData as GridMetaDataType}
        loading={isLoading || isFetching}
        data={data ?? []}
        setData={() => null}
        refetchData={() => {}}
        ref={myGridRef}
      />
    </>
  );
};
export const TodayTransactionForm = ({ reqData }) => {
  return (
    <ClearCacheProvider>
      <TodayTransaction reqData={reqData} />
    </ClearCacheProvider>
  );
};
