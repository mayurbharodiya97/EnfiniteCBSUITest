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
import { Dialog } from "@mui/material";
import { dayEndErroeLogMetaData, verifyDayendChecksumsMetaData } from "./gridMetadata";

const actions: ActionTypes[] = [
    {
      actionName: "close",
      actionLabel: "Close",
      multiple: undefined,
      alwaysAvailable: true,
    },
];

export const DayendExecute = ({open,close})=>{
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
        ["VerifyDayendChecksums"],
        () =>
          API.getVerifyDayEndCheksumsData({
            COMP_CD:authState?.companyID,
            BASE_BRANCH_CD:authState?.user?.baseBranchCode,
            ARG:"R",
            CHKSM_TYPE:"B"
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
            window.open(`/cbsenfinity/${data[0]?.DOC_URL}`, "_blank");
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
      <Dialog
      open={open}
      fullScreen
      maxWidth="xl"
      >
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
      finalMetaData={verifyDayendChecksumsMetaData as GridMetaDataType}
      data={[] ?? []}
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
        metaData={dayEndErroeLogMetaData}
        reportData={rowData}
        reportLabel={`EOD Error Log : ${authState?.workingDate} and Version${rowData} User Defined Checksum`}
        />
      ): ""
      }
      </Dialog>
       </>
    )
}
