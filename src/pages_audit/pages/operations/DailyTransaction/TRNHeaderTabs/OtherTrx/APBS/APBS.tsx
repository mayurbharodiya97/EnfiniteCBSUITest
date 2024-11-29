import {
  Alert,
  GridMetaDataType,
  GridWrapper,
  queryClient,
} from "@acuteinfo/common-base";
import { AuthContext } from "pages_audit/auth";
import { Fragment, useContext, useEffect } from "react";
import { useQuery } from "react-query";
import * as API from "./api";
import { APBSGridMetaData } from "./gridMetadata";
export const APBS = ({ reqData }) => {
  const { authState } = useContext(AuthContext);
  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["getAPBSList", { reqData }], () => API.getAPBSList(reqData));

  useEffect(() => {
    return () => {
      const keysToRemove = ["getAPBSList"].map((key) => [
        key,
        authState?.user?.branchCode,
      ]);
      keysToRemove.forEach((key) => queryClient.removeQueries(key));
    };
  }, []);
  return (
    <Fragment>
      {isError ? (
        <Alert
          severity={error?.severity ?? "error"}
          errorMsg={error?.error_msg ?? "Error"}
          errorDetail={error?.error_detail ?? ""}
        />
      ) : null}
      <GridWrapper
        key={`APBSGridMetaData`}
        finalMetaData={APBSGridMetaData as GridMetaDataType}
        data={data ?? []}
        loading={isLoading || isFetching}
        setData={() => null}
        refetchData={refetch}
      />
    </Fragment>
  );
};
