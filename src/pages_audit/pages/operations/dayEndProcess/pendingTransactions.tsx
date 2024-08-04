import { AuthContext } from "pages_audit/auth";
import { useCallback, useContext, useEffect, useState } from "react";
import * as API from './api';
import { queryClient } from "cache";
import { useMutation, useQuery } from "react-query";
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { pendingAcctMetadata } from "../acct-mst/metadata/pendingAcctMetadata";
import { ActionTypes } from "components/dataTable";
import { useNavigate } from "react-router-dom";
import { ViewEodReport } from "./viewEodReport";
import { usePopupContext } from "components/custom/popupContext";
import { Alert } from "components/common/alert";
import { pendingTrnsEodReportMetaData, pendingTrnsMetadata } from "./gridMetadata";

const actions: ActionTypes[] = [
    {
      actionName: "close",
      actionLabel: "Close",
      multiple: undefined,
      alwaysAvailable: true,
    },
];

export const PendinGTrns = ({open,close})=>{
    const { authState } = useContext(AuthContext);
    const [openReport, setOpenReport] = useState(false);
    const [rowData, setRowData] = useState({});
    const { MessageBox, CloseMessageBox } = usePopupContext();

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
          API.getPendingTrns({
            ENT_COMP_CD: authState?.companyID,
            ENT_BRANCH_CD: authState?.user?.branchCode,
            BASE_COMP_CD: authState?.baseCompanyID,
            BASE_BRANCH_CD: authState?.user?.baseBranchCode,
            GD_DATE: authState?.workingDate
          })
      );
      const docUrlPayload:any ={
        BASE_COMP:authState?.baseCompanyID,
        BASE_BRANCH:authState?.user?.baseBranchCode,
        DOC_CD:"TRN/399"
      };
      const reportPayload ={
        COMP_CD:authState?.companyID,
        BRANCH_CD:authState?.user?.branchCode,
        TRAN_DT:authState?.workingDate,
        VERSION:"1.0",
        DOCU_CD:"doc_cd"
      }
      const docurlMutation = useMutation(API.getDocUrl,
        {
          onError: async (error: any) => {
    
            const btnName = await MessageBox({
              message: error?.error_msg,
              messageTitle: "error",
              buttonNames: ["Ok"],
            });
    
          },
          onSuccess: async (data) => {
            
          },
        }
      );
      const reportMutation = useMutation(API.getpendingtrnReport,
        {
          onError: async (error: any) => {
    
            const btnName = await MessageBox({
              message: error?.error_msg,
              messageTitle: "error",
              buttonNames: ["Ok"],
            });
    
          },
          onSuccess: async (data) => {
               setRowData(data);
          },
        }
      );

      useEffect(() => {
        return () => {
          queryClient.removeQueries(["pendingtrns"]);
        };
      }, []);
    return(
        <>
           {isError && (
        <Alert
          severity="error"
          errorMsg={error?.error_msg ?? "Somethingwenttowrong"}
          errorDetail={error?.error_detail}
          color="error"
        />
      )}
           <GridWrapper
            key={"pendingtrns"}
            finalMetaData={pendingTrnsMetadata as GridMetaDataType}
            data={data ?? []}
            setData={() => null}
            actions={actions}
            onClickActionEvent={(index, id, currentData) => {
                if (id === "REPORT") {
                    setRowData(currentData);
                    setOpenReport(true);
                    reportMutation.mutate(reportPayload)
                }
                if (id === "OPEN") {
                    docurlMutation.mutate(docUrlPayload)
                }
                }}
            loading={isLoading || isFetching}
            ReportExportButton={true}
            setAction={setCurrentAction}
            />

            {
                openReport ? (
                 <ViewEodReport
                  open={openReport}
                  close={()=>{setOpenReport(false)}}
                  metaData={pendingTrnsEodReportMetaData}
                  reportData={rowData}
                  reportLabel={`Pending Transaction for ${authState?.workingDate},Version:${rowData},KYC Review Due Date Report`}
                 />
                ): ""
            }
       </>
    )
}