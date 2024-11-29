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
import { OwChqGridMetaData } from "./gridMetadata";
export const OW_Chq = ({ reqData }) => {
  const { authState } = useContext(AuthContext);
  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["getOWChqList", { reqData }], () => API.getOWChqList(reqData));

  const Credit = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
  }).format(
    parseFloat(
      data
        ?.reduce((sum, item: any) => {
          if (item?.CR_DR === "Credit") {
            return sum + Number(item?.AMOUNT ?? 0);
          }
          return sum;
        }, 0)
        .toFixed(2)
    )
  );
  const Dedit = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
  }).format(
    parseFloat(
      data
        ?.reduce((sum, item: any) => {
          if (item?.CR_DR === "Dedit") {
            return sum + Number(item?.AMOUNT ?? 0);
          }
          return sum;
        }, 0)
        .toFixed(2)
    )
  );

  OwChqGridMetaData.gridConfig.footerNote = `Credit Amount:- ${
    isNaN(parseFloat(Credit)) ? "0.00" : Credit
  } (Cr.)\u00A0\u00A0\u00A0\u00A0  Debit Amount:- ${
    isNaN(parseFloat(Dedit)) ? "0.00" : Dedit
  } (Dr.)`;
  useEffect(() => {
    return () => {
      const keysToRemove = ["getOWChqList"].map((key) => [
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
        key={`OwChqGridMetaData` + data?.length}
        finalMetaData={OwChqGridMetaData as GridMetaDataType}
        loading={isLoading || isFetching}
        data={data ?? []}
        setData={() => null}
        refetchData={refetch}
      />
    </Fragment>
  );
};
