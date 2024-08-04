import { Fragment, useCallback, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ActionTypes } from "components/dataTable";
import { GridMetaDataType } from "components/dataTableStatic";
import GridWrapper from "components/dataTableStatic/";
import { useQuery } from "react-query";
import * as API from './api';
import { AuthContext } from "pages_audit/auth";
import { Alert } from "components/common/alert";
import { queryClient } from "cache";
import { usePopupContext } from "components/custom/popupContext";
import { confirmedHistoryMetaData } from "./confirmedHistoryMetaData";
import { Dialog } from "@mui/material";
const { state: rows }: any = useLocation();
 

const actions: ActionTypes[] = [
  {
    actionName: "close",
    actionLabel: "Close",
    multiple: undefined,
    alwaysAvailable: true,
  },
];


export const ConFirmedHistory = ({open,close}) => {

  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const { MessageBox, CloseMessageBox } = usePopupContext();

  const setCurrentAction = useCallback(
    async (data) => {
      if (data?.name === "close") {
       close();
      }
    },
    [navigate]
  );

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getShowConfirmedHistory"], () =>
    API.getShowConfirmedHistory({
    ENTERED_COMP_CD: authState?.companyID,
    TRAN_DT: authState?.workingDate,
    ENTERED_BRANCH_CD: authState?.user?.baseBranchCode,
    SCREEN_REF: "RPT/15",
    TRAN_CD: rows?.TRAN_CD
    })
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getConfirmedHistory"]);
    };
  }, []);

  return (
    <Fragment>
         <Dialog
          open={open}
          fullWidth
          maxWidth="lg"
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
        key={"modeMasterGrid"}
        finalMetaData={confirmedHistoryMetaData as GridMetaDataType}
        data={data ?? []}
        loading={isLoading||isFetching}
        setData={() => null}
        actions={actions}
        setAction={setCurrentAction}
      />
      </Dialog>

    </Fragment>
  );
};


