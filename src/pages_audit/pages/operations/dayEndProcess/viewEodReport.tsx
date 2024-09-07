import { AuthContext } from "pages_audit/auth";
import { useCallback, useContext, useEffect } from "react";
import * as API from "./api";
import { queryClient } from "cache";
import { useQuery } from "react-query";
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { pendingAcctMetadata } from "../acct-mst/metadata/pendingAcctMetadata";
import { ActionTypes } from "components/dataTable";
import { useNavigate } from "react-router-dom";
import { Alert } from "components/common/alert";
import { Dialog } from "@mui/material";

const actions: ActionTypes[] = [
  {
    actionName: "close",
    actionLabel: "Close",
    multiple: undefined,
    alwaysAvailable: true,
  },
];

export const ViewEodReport = ({
  open,
  close,
  metaData,
  reportData,
  reportLabel,
}) => {
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

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch: slipdataRefetch,
  } = useQuery<any, any>(["getDayendprocessFlag"], () =>
    API.getDayendprocessFlag({
      ENT_COMP_CD: authState?.companyID,
      ENT_BRANCH_CD: authState?.user?.branchCode,
      BASE_COMP_CD: authState?.baseCompanyID,
      BASE_BRANCH_CD: authState?.user?.baseBranchCode,
      A_GD_DATE: authState?.workingDate,
    })
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["pendingtrns"]);
    };
  }, []);
  metaData.gridConfig.gridLabel = reportLabel;

  return (
    <>
      {isError && (
        <Alert
          severity="error"
          errorMsg={error?.error_msg ?? "Somethingwenttowrong"}
          errorDetail={error?.error_detail}
          color="error"
        />
      )}
      <Dialog
        open={open}
        PaperProps={{
          style: {
            width: "60%",
            overflow: "auto",
          },
        }}
        maxWidth="lg"
      >
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
      </Dialog>
    </>
  );
};
