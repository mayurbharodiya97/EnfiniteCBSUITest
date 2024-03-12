import { Fragment, useEffect, useRef, useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { JointDetailIssueEntry } from "./metaData";
import { CheckBookGridMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { GridMetaDataType } from "components/dataTable/types";
import { ClearCacheProvider, queryClient } from "cache";
import * as API from "./api";
import { FormWrapper } from "components/dyanmicForm/formWrapper";
import { InitialValuesType, SubmitFnType } from "packages/form";
import { AuthContext } from "pages_audit/auth";
import { AccDetailContext } from "pages_audit/auth";

export const CheckBook = ({ reqData }) => {
  const { authState } = useContext(AuthContext);
  const myGridRef = useRef<any>(null);
  const { tempStore, setTempStore } = useContext(AccDetailContext);
  const [rows, setRows] = useState([]);

  // const getCheckDetailsList = useMutation(API.getCheckDetailsList, {
  //   onSuccess: (data) => {
  //     console.log(data, " check detailssss");
  //     setRows(data);
  //   },
  //   onError: (error) => {},
  // });

  // useEffect(() => {
  //   tempStore?.accInfo?.ACCT_CD &&
  //     getCheckDetailsList.mutate(tempStore.accInfo);
  // }, [tempStore]);

  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["getCheckDetailsList"], () => API.getCheckDetailsList(reqData));

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
        key={`CheckBookGridMetaData`}
        finalMetaData={CheckBookGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading || isFetching}
        refetchData={() => {}}
        ref={myGridRef}
      />
    </>
  );
};
