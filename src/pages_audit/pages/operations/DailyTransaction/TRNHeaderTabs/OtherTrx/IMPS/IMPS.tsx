import { Fragment, useEffect } from "react";
import { useQuery } from "react-query";
import { IMPSGridMetaData } from "./gridMetadata";
import {
  Alert,
  GridMetaDataType,
  GridWrapper,
  queryClient,
} from "@acuteinfo/common-base";
import { AuthContext } from "pages_audit/auth";
import { useContext } from "react";
import * as API from "./api";
export const IMPS = ({ reqData }) => {
  const { authState } = useContext(AuthContext);
  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["getIMPSList", { reqData }], () => API.getIMPSList(reqData));
  useEffect(() => {
    return () => {
      const keysToRemove = ["getIMPSList"].map((key) => [
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
        key={`IMPSGridMetaData`}
        finalMetaData={IMPSGridMetaData as GridMetaDataType}
        loading={isLoading || isFetching}
        data={data ?? []}
        setData={() => null}
        refetchData={refetch}
      />
    </Fragment>
  );
};
