import { GridMetaDataType } from "components/dataTableStatic";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import React, { useContext, useEffect } from "react";
import { UserLoginDtlGridMetaData } from "./metaData";
import { AuthContext } from "pages_audit/auth";
import * as API from "./api";
import { useQuery } from "react-query";
import { queryClient } from "cache";
import { Alert } from "components/common/alert";

export const UserDetail = () => {
  const { authState } = useContext(AuthContext);

  const userActivityData = useQuery<any, any, any>(["GETUSERACTIVITY"], () =>
    API.getUserLoginDetails({ userID: authState?.user?.id })
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["GETEMPLOYEEDTL"]);
    };
  }, []);

  return (
    <>
      {userActivityData?.isError ? (
        <Alert
          severity="error"
          errorMsg={
            userActivityData.error?.error_msg ?? "Unknown Error occured"
          }
          errorDetail={userActivityData.error?.error_detail ?? ""}
        />
      ) : null}
      <GridWrapper
        key={`user-Detail`}
        finalMetaData={UserLoginDtlGridMetaData as GridMetaDataType}
        data={userActivityData.data ?? []}
        setData={() => null}
        loading={userActivityData.isLoading}
        headerToolbarStyle={{
          background: "var(--theme-color2)",
          color: "black",
        }}
      />
    </>
  );
};
