import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import * as API from "./api";
import { SIDetailGridMetaData } from "./gridMetadata";
import {
  ActionTypes,
  Alert,
  GridMetaDataType,
  GridWrapper,
  queryClient,
} from "@acuteinfo/common-base";
import SiExecuteDetailView from "pages_audit/pages/operations/standingInstruction/siExecuteDetailView";
import { AuthContext } from "pages_audit/auth";

const actions: ActionTypes[] = [
  {
    actionName: "view-details",
    actionLabel: "ViewDetail",
    multiple: undefined,
    rowDoubleClick: true,
    alwaysAvailable: false,
  },
];

export const SIDetail = ({ reqData }) => {
  const { authState } = useContext(AuthContext);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [rows, setRows] = useState<any>({});
  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["getSIDetailList", { reqData }], () => API.getSIDetailList(reqData));

  const setCurrentAction = useCallback(async (data) => {
    if (data?.name === "view-details") {
      setRows(data?.rows?.[0]?.data);
      setDetailsOpen(true);
    }
  }, []);
  useEffect(() => {
    return () => {
      const keysToRemove = ["getSIDetailList"].map((key) => [
        key,
        authState?.user?.branchCode,
      ]);
      keysToRemove.forEach((key) => queryClient.removeQueries(key));
    };
  }, []);

  return (
    <>
      {isError ? (
        <Alert
          severity={error?.severity ?? "error"}
          errorMsg={error?.error_msg ?? "Error"}
          errorDetail={error?.error_detail ?? ""}
        />
      ) : null}
      <GridWrapper
        key={`SIDetailGridMetaData`}
        finalMetaData={SIDetailGridMetaData as GridMetaDataType}
        loading={isLoading || isFetching}
        data={data ?? []}
        setData={() => null}
        refetchData={() => refetch()}
        actions={actions}
        setAction={setCurrentAction}
      />

      <SiExecuteDetailView
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        lineId={rows?.LINE_ID ?? ""}
        srCd={rows?.SR_CD ?? ""}
        tran_cd={rows?.TRAN_CD ?? ""}
        screenFlag={"SIDTL_TRN"}
      />
    </>
  );
};
