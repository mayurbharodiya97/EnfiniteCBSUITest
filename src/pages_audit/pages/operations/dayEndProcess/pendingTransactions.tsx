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
    const [rowData, setRowData] = useState<any>([]);
    const [docData, setDocData] = useState<any>({});
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
        ["getPendingTrns"],
        () =>
          API.getPendingTrns({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
            BASE_BRANCH: authState?.user?.baseBranchCode,
            TRAN_DT: authState?.workingDate
          })
      );
      const docUrlPayload:any ={
        BASE_COMP:authState?.baseCompanyID,
        BASE_BRANCH:authState?.user?.baseBranchCode,
        DOC_CD:docData?.DOC_CD
      };
      const reportPayload ={
        COMP_CD:authState?.companyID,
        BRANCH_CD:authState?.user?.branchCode,
        TRAN_DT:authState?.workingDate,
        A_GD_DATE:authState?.workingDate,
        VERSION:data?.VERSION,
        DOCU_CD:data?.DOCU_CD,
      
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
            // console.log(data);
            setDocData(data);
            window.open(`/cbsenfinity/${data[0]?.DOCUMENT_URL}`);
     
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
            setRowData(data)
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
                    reportMutation.mutate({
                      COMP_CD:authState?.companyID,
                      BRANCH_CD:authState?.user?.branchCode,
                      TRAN_DT:authState?.workingDate,
                      VERSION:currentData?.VERSION,
                      DOCU_CD:currentData?.DOCU_CD,
                    })
                }
                if (id === "OPEN") {
                  console.log(currentData);
                  
                    docurlMutation.mutate({
                      BASE_COMP:authState?.baseCompanyID,
                      BASE_BRANCH:authState?.user?.baseBranchCode,
                      DOC_CD:currentData?.DOCU_CD
                    })
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
                  reportLabel={`Pending Transaction for ${authState?.workingDate},Version:${rowData?.VERSION},KYC Review Due Date Report`}
                 />
                ): ""
            }
       </>
    )
}