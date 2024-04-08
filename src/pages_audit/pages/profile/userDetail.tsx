import { GridMetaDataType } from "components/dataTableStatic";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import React, { useContext } from "react";
import { UserLoginDtlGridMetaData } from "./metaData";
import { AuthContext } from "pages_audit/auth";
import * as API from "./api";
import { useQuery } from "react-query";

export const UserDetail = () => {
  const { authState } = useContext(AuthContext);
  const userActivityData = useQuery<any, any, any>(["GETUSERACTIVITY"], () =>
    API.getUserLoginDetails({ userID: authState?.user?.id })
  );
  return (
    <>
      <GridWrapper
        key={`userDetail`}
        finalMetaData={UserLoginDtlGridMetaData as GridMetaDataType}
        data={userActivityData.data ?? []}
        setData={() => null}
        //loading={result.isLoading}
        actions={[]}
        setAction={() => {}}
        refetchData={() => {}}
        headerToolbarStyle={{
          background: "var(--theme-color2)",
          color: "black",
        }}
      />
    </>
  );
};
