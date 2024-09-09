import { useContext, useEffect } from "react";
import GridWrapper from "components/dataTableStatic";
import { GridMetaDataType } from "components/dataTable/types";
import { Alert } from "components/common/alert";
import { useQuery } from "react-query";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import { queryClient } from "cache";
import { useTranslation } from "react-i18next";
import { VouchersDetailsGridMetaData } from "./vouchersDetailsGridMetadata";
import { useLocation } from "react-router-dom";

export const VouchersDetailsGrid = () => {
  const { authState } = useContext(AuthContext);
  const { t } = useTranslation();
  const { state: rows }: any = useLocation();

  //Get voucher Details data
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getVouchersDetails", authState?.user?.branchCode], () =>
    API.getVouchersDetails({
      companyID: authState?.companyID ?? "",
      branchCode: authState?.user?.branchCode ?? "",
      tranCd: rows?.[0]?.data?.TRAN_CD ?? "",
    })
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries([
        "getVouchersDetails",
        authState?.user?.branchCode,
      ]);
    };
  }, []);

  return (
    <>
      {isError && (
        <Alert
          severity="error"
          errorMsg={error?.error_msg ?? t("Somethingwenttowrong")}
          errorDetail={error?.error_detail}
          color="error"
        />
      )}
      <GridWrapper
        key={"vouchersDetailsGrid"}
        finalMetaData={VouchersDetailsGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading || isFetching}
        refetchData={() => refetch()}
      />
    </>
  );
};
