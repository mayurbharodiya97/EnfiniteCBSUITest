import { AuthContext } from "pages_audit/auth";
import { useCallback, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import * as API from "./api";
import { useQuery } from "react-query";
import {
  Alert,
  GridMetaDataType,
  GridWrapper,
  queryClient,
} from "@acuteinfo/common-base";
import { t } from "i18next";
import { lockerDeatilsViewMetadata } from "./gridNetaData";
import { dataContext } from "./lockerOperationTrns";
export const LockerViewDetailsGrid = () => {
  const { authState } = useContext(AuthContext);
  const { payload } = useContext(dataContext);
  const navigate = useNavigate();

  const setCurrentAction = useCallback(
    async (data) => {
      navigate(data?.name, {
        state: data?.rows,
      });
    },
    [navigate]
  );
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(
    ["getLockerDetails"],
    () =>
      API.getLockerOperationTrnsData({
        COMP_CD: authState?.companyID,
        BRANCH_CD: authState?.user?.branchCode,
        ACCT_CD: payload?.ACCT_CD,
        ACCT_TYPE: payload?.ACCT_TYPE,
        WORKING_DATE: authState?.workingDate,
      }),
    {
      enabled: !!payload?.ACCT_CD && payload?.ACCT_CD !== "",
    }
  );
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getLockerDetails"]);
    };
  }, []);
  return (
    <Fragment>
      {isError && (
        <Alert
          severity="error"
          errorMsg={error?.error_msg ?? t("Somethingwenttowrong")}
          errorDetail={error?.error_detail}
          color="error"
        />
      )}
      <GridWrapper
        key={"modeMasterGrid"}
        finalMetaData={lockerDeatilsViewMetadata as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        onClickActionEvent={(index, id, currentData) => {
          if (id === "DELETE") {
          }
          if (id === "SIGN") {
          }
        }}
        hideHeader={true}
        actions={[]}
        loading={isLoading || isFetching}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
      />
    </Fragment>
  );
};
