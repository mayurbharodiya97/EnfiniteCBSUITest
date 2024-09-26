import { AuthContext } from "pages_audit/auth";
import { useCallback, useContext, useEffect, useState } from "react";
import * as API from "./api";
import { queryClient } from "cache";
import { useMutation, useQuery } from "react-query";
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { pendingAcctMetadata } from "../acct-mst/metadata/pendingAcctMetadata";
import { ActionTypes } from "components/dataTable";
import { useNavigate } from "react-router-dom";
import { ViewEodReport } from "./viewEodReport";
import { usePopupContext } from "components/custom/popupContext";
import { Alert } from "components/common/alert";
import {
  pendingTrnsEodReportMetaData,
  pendingTrnsMetadata,
} from "./gridMetadata";

const actions: ActionTypes[] = [
  {
    actionName: "close",
    actionLabel: "Close",
    multiple: undefined,
    alwaysAvailable: true,
  },
];

export const PendinGTrns = ({ open, close }) => {
  const { authState } = useContext(AuthContext);
  const [openReport, setOpenReport] = useState(false);
  const [rowData, setRowData] = useState<any>([]);
  const [docData, setDocData] = useState<any>({});
  const [openedWindow, setOpenedWindow] = useState<Window | null>(null);
  const { MessageBox } = usePopupContext();
  const navigate = useNavigate();

  const setCurrentAction = useCallback(
    async (data) => {
      if (data?.name === "close") {
        close();
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate, close]
  );

  const { data, isLoading, isFetching, isError, error } = useQuery<any, any>(
    ["getPendingTrns"],
    () =>
      API.getPendingTrns({
        COMP_CD: authState?.companyID,
        BRANCH_CD: authState?.user?.branchCode,
        BASE_BRANCH: authState?.user?.baseBranchCode,
        TRAN_DT: authState?.workingDate,
      })
  );

  const docurlMutation = useMutation(API.getDocUrl, {
    onError: async (error: any) => {
      await MessageBox({
        message: error?.error_msg,
        messageTitle: "error",
        buttonNames: ["Ok"],
      });
    },
    onSuccess: async (data) => {
      console.log("Doc URL data:", data);
      setDocData(data);

      // Ensure URL is valid
      const url = `/cbsenfinity/${data[0]?.DOCUMENT_URL}`;
      const newWindow = window.open(url, "_blank");

      if (newWindow) {
        setOpenedWindow(newWindow);
        newWindow.focus();
        queryClient.removeQueries(["getDocUrl"]);
      } else {
        console.error(
          "Failed to open the window. It might be blocked by a pop-up blocker."
        );
      }
    },
  });

  const reportMutation = useMutation(API.getpendingtrnReport, {
    onError: async (error: any) => {
      await MessageBox({
        message: error?.error_msg,
        messageTitle: "error",
        buttonNames: ["Ok"],
      });
    },
    onSuccess: async (data) => {
      console.log("Report data:", data);
      setRowData(data);
    },
  });

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["pendingtrns"]);
    };
  }, []);

  return (
    <>
      {isError && (
        <Alert
          severity="error"
          errorMsg={error?.error_msg ?? "Something went wrong"}
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
              COMP_CD: authState?.companyID,
              BRANCH_CD: authState?.user?.branchCode,
              TRAN_DT: authState?.workingDate,
              VERSION: currentData?.VERSION,
              DOCU_CD: currentData?.DOCU_CD,
            });
          }
          if (id === "OPEN") {
            console.log("Opening document:", currentData);
            docurlMutation.mutate({
              BASE_COMP: authState?.baseCompanyID,
              BASE_BRANCH: authState?.user?.baseBranchCode,
              DOC_CD: currentData?.DOCU_CD,
            });
          }
        }}
        loading={isLoading || isFetching}
        ReportExportButton={true}
        setAction={setCurrentAction}
      />

      {openReport ? (
        <ViewEodReport
          open={openReport}
          close={() => {
            setOpenReport(false);
          }}
          metaData={pendingTrnsEodReportMetaData}
          reportData={rowData}
          reportLabel={`Pending Transaction for ${authState?.workingDate}, Version: ${rowData?.VERSION}, KYC Review Due Date Report`}
        />
      ) : (
        ""
      )}
    </>
  );
};
