import { AuthContext } from "pages_audit/auth";
import { useCallback, useContext, useEffect } from "react";
import * as API from './api';
import { queryClient } from "cache";
import { useQuery } from "react-query";
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { pendingAcctMetadata } from "../acct-mst/metadata/pendingAcctMetadata";
import { ActionTypes } from "components/dataTable";
import { useNavigate } from "react-router-dom";

const actions: ActionTypes[] = [
    {
      actionName: "close",
      actionLabel: "Close",
      multiple: undefined,
      alwaysAvailable: true,
    },
];

export const ViewEodReport = ({open,close,metaData,reportData})=>{
    const { authState } = useContext(AuthContext);
    const navigate = useNavigate();

    const setCurrentAction = useCallback(
        async (data) => {
          if (data?.name === "close") {
            close();
          }
          navigate(data?.name, {
            state: data?.rows,
          });
        },
        [navigate]
      );

    const { data, isLoading, isFetching, isError, error, refetch: slipdataRefetch } = useQuery<any, any>(
        ["getDayendprocessFlag"],
        () =>
          API.getDayendprocessFlag({
            ENT_COMP_CD: authState?.companyID,
            ENT_BRANCH_CD: authState?.user?.branchCode,
            BASE_COMP_CD: authState?.baseCompanyID,
            BASE_BRANCH_CD: authState?.user?.baseBranchCode,
            GD_DATE: authState?.workingDate
          })
      );

      useEffect(() => {
        return () => {
          queryClient.removeQueries(["pendingtrns"]);
        };
      }, []);
    return(
        <>
           <GridWrapper
            key={"ViewEodReport"}
            finalMetaData={metaData as GridMetaDataType}
            data={reportData ?? []}
            setData={() => null}
            actions={actions}
            loading={isLoading || isFetching}
            ReportExportButton={true}
            setAction={setCurrentAction}
            />
       </>
    )
}