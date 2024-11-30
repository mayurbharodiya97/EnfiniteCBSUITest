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
import { LienDetailGridMetaData } from "./gridMetadata";
export const LienDetail = ({ reqData }) => {
  const { authState } = useContext(AuthContext);
  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["getLienDetailList", { reqData }], () => API.getLienDetailList(reqData));

  useEffect(() => {
    return () => {
      const keysToRemove = ["getLienDetailList"].map((key) => [
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
        key={`LienDetailGridMetaData`}
        finalMetaData={LienDetailGridMetaData as GridMetaDataType}
        loading={isLoading || isFetching}
        data={data ?? []}
        setData={() => null}
        refetchData={refetch}
      />
    </Fragment>
  );
};
