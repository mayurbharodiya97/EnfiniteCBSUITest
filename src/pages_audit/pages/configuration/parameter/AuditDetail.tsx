import {  Dialog } from "@mui/material";
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { AuditMetadata } from "./gridMetadata";
import { useQuery } from "react-query";
import * as API from "./api"
import { useCallback, useContext, useEffect } from "react";
import { AuthContext } from "pages_audit/auth";
import { ActionTypes } from "components/dataTable";
import { useNavigate } from "react-router-dom";
import { queryClient } from "cache";
const actions: ActionTypes[] = [
  {
    actionName: "close",
    actionLabel: "Close",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
];
 const AuditDetail = ({ open, onClose, rowsData}) => {
    const navigate = useNavigate();
    const { data, isLoading, isFetching,} = useQuery<any, any>(
        ["getParaAuditHistory"],
        () => API.getParaAuditHistory({
            para_cd:rowsData?.PARA_CD,
            comp_cd:rowsData?.COMP_CD,
            branch_cd:rowsData?.BRANCH_CD,
        })
      );
      const setCurrentAction = useCallback(async (data) => {
        if (data.name === "close") {
            onClose(onClose)
        } else {
          navigate(data?.name);
        }
      }, [navigate]);

      useEffect(()=>{
        return () => {
          AuditMetadata.gridConfig.gridLabel="Para Code = "+rowsData?.PARA_CD+" "+rowsData?.PARA_NM
          queryClient.removeQueries("getParaAuditHistory");
        }
      },[])
    
  return (
    <>
    <Dialog
      open={open}
      PaperProps={{
        style: {
          maxWidth: "1200px",
        },
      }}
    >
        <GridWrapper
        key={"parametersGridAudit"}
        finalMetaData={AuditMetadata as GridMetaDataType}
        data={data ?? []}
        ReportExportButton={true}
        actions={actions}
        setAction={setCurrentAction}
        setData={() => null}
        loading={isLoading || isFetching}
      />
    </Dialog>
  </>
  );
};
export default AuditDetail;
