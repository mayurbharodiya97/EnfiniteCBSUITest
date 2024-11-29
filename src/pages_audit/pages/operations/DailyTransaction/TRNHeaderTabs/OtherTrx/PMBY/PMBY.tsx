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
import { PMBYGridMetaData } from "./gridMetadata";
export const PMBY = ({ reqData }) => {
  const { authState } = useContext(AuthContext);
  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["getPMBYList", { reqData }], () => API.getPMBYList(reqData));

  useEffect(() => {
    return () => {
      const keysToRemove = ["getPMBYList"].map((key) => [
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
        key={`PMBYGridMetaData`}
        finalMetaData={PMBYGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        refetchData={refetch}
        loading={isLoading || isFetching}
      />
    </Fragment>
  );
};
