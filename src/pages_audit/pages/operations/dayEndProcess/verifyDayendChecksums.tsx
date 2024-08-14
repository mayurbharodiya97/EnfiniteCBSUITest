import { AuthContext } from "pages_audit/auth";
import { useCallback, useContext, useEffect, useState } from "react";
import * as API from './api';
import { queryClient } from "cache";
import { useMutation, useQuery } from "react-query";
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { verifyDayendChecksumsMetaData, dayEndErroeLogMetaData } from "./gridMetadata";
import { ActionTypes } from "components/dataTable";
import { useNavigate } from "react-router-dom";
import { ViewEodReport } from "./viewEodReport";
import { usePopupContext } from "components/custom/popupContext";
import { Alert } from "components/common/alert";
import { Dialog } from "@mui/material";
import { LoadingTextAnimation } from "components/common/loader";

const actions: ActionTypes[] = [
  {
    actionName: "close",
    actionLabel: "Close",
    multiple: undefined,
    alwaysAvailable: true,
  },
];

export const VerifyDayendChecksums = ({ open, close }) => {
  const { authState } = useContext(AuthContext);
  const [openReport, setOpenReport] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [gridData, setGridData] = useState([]);
  const { MessageBox } = usePopupContext();
  const navigate = useNavigate();

  const handleAction = useCallback(
    async (data) => {
      if (data?.name === "close") {
        close();
      } else {
        navigate(data?.name, { state: data?.rows });
      }
    },
    [navigate, close]
  );

  const { data: validatedData, isLoading: validateLoading, isError: validateError, error: validateErrorDetails, isSuccess: validateSuccess } = useQuery(
    ["getValidateEod"],
    () => API.getValidateEod({ 
      SCREEN_REF: "TRN/399",
       FLAG: "C" 
    }),

  );

  const { data: checkSumsData, isLoading: checksumsLoading, isError: checksumsError, error: checksumsErrorDetails, isSuccess: checksumsSuccess } = useQuery(
    ["getCheckSums"],
    () => API.getCheckSums({
      FLAG:"C",
      SCREEN_REF:"TRN/399",
         FOR_BRANCH:"099 ",
         EOD_EOS_FLG:"E"
       }),
    {
      enabled: validateSuccess, // Only run if validation is successful
    }
  );

  const { data: gridDataResponse, isLoading: gridDataLoading, isError: gridDataError, error: gridDataErrorDetails } = useQuery(
    ["executeChecksums"],
    () => API.executeChecksums({
      //@ts-ignore
      FLAG:"C",
      SCREEN_REF:"TRN/399",
     FOR_BRANCH:"099 ",
     EOD_EOS_FLG:"E",
     CHKSM_TYPE:"B",
     SR_CD:"48",
     MENDETORY:"Y",
     EOD_VER_ID:"212"
       }),
    {
      enabled: checksumsSuccess, // Only run if checksums data retrieval is successful
      onSuccess: (data) => setGridData(data),
    }
  );

  const docUrlPayload = {
    BASE_COMP: authState?.baseCompanyID,
    BASE_BRANCH: authState?.user?.baseBranchCode,
    DOC_CD: "TRN/399",
  };

  const reportPayload = {
    COMP_CD: authState?.companyID,
    BRANCH_CD: authState?.user?.branchCode,
    TRAN_DT: authState?.workingDate,
    VERSION: "1.0",
    DOCU_CD: "doc_cd",
  };

  const docUrlMutation = useMutation(API.getDocUrl, {
    onError: async (error) => {
      await MessageBox({
        //@ts-ignore
        message: error?.error_msg,
        messageTitle: "Error",
        buttonNames: ["Ok"],
      });
    },
    onSuccess: (data) => {
      window.open(`/cbsenfinity/${data[0]?.DOC_URL}`, "_blank");
    },
  });

  const reportMutation = useMutation(API.getpendingtrnReport, {
    onError: async (error) => {
      await MessageBox({
        //@ts-ignore
        message: error?.error_msg,
        messageTitle: "Error",
        buttonNames: ["Ok"],
      });
    },
    onSuccess: (data) => {
      setRowData(data);
      setOpenReport(true);
    },
  });

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["pendingtrns"]);
    };
  }, []);


  return (
    <>
      <Dialog open={open} fullScreen maxWidth="xl">
        {validateError && (
          <Alert
            severity="error"
              //@ts-ignore
            errorMsg={validateErrorDetails?.error_msg ?? "Something went wrong"}
              //@ts-ignore
            errorDetail={validateErrorDetails?.error_detail}
            color="error"
          />
        )}
        {checksumsError && (
          <Alert
            severity="error"
            //@ts-ignore
            errorMsg={checksumsErrorDetails?.error_msg ?? "Something went wrong"}
              //@ts-ignore
            errorDetail={checksumsErrorDetails?.error_detail}
            color="error"
          />
        )}
        {gridDataError && (
          <Alert
            severity="error"
              //@ts-ignore
            errorMsg={gridDataErrorDetails?.error_msg ?? "Something went wrong"}
              //@ts-ignore
            errorDetail={gridDataErrorDetails?.error_detail}
            color="error"
          />
        )}
        {

        }
        {
          gridDataLoading ? 
     
        <GridWrapper
          key={"pendingtrns"}
          finalMetaData={verifyDayendChecksumsMetaData as GridMetaDataType}
          data={gridData}
          setData={() => null}
          actions={actions}
          onClickActionEvent={(index, id, currentData) => {
            if (id === "REPORT") {
              reportMutation.mutate(reportPayload);
            }
            if (id === "OPEN") {
              docUrlMutation.mutate(docUrlPayload);
            }
          }}
          loading={gridDataLoading || validateLoading || checksumsLoading}
          ReportExportButton={true}
          setAction={handleAction}
        />:
         <LoadingTextAnimation/>
      }
        {openReport && (
          <ViewEodReport
            open={openReport}
            close={() => setOpenReport(false)}
            metaData={dayEndErroeLogMetaData}
            reportData={rowData}
            reportLabel={`EOD Error Log : ${authState?.workingDate} and Version ${rowData} User Defined Checksum`}
          />
        )}
      </Dialog>
    </>
  );
};
