import { Fragment, useCallback, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ActionTypes } from "components/dataTable";
import { GridMetaDataType } from "components/dataTableStatic";
import GridWrapper from "components/dataTableStatic/";
import { useQuery } from "react-query";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import { Alert } from "components/common/alert";
import { queryClient } from "cache";
import { usePopupContext } from "components/custom/popupContext";
import { confirmedHistoryMetaData } from "./confirmedHistoryMetaData";
import { Dialog } from "@mui/material";
import { format } from "date-fns";

const actions: ActionTypes[] = [
  {
    actionName: "close",
    actionLabel: "Close",
    multiple: undefined,
    alwaysAvailable: true,
  },
];

export const ConFirmedHistory = ({ open, close }) => {
  const { state: rows }: any = useLocation();
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
      TRAN_DT: format(new Date(rows[0].data?.TRAN_DT), "dd/MMM/yyyy"),
      ENTERED_BRANCH_CD: authState?.user?.baseBranchCode,
      SCREEN_REF: "PAYSLIP",
      TRAN_CD: rows[0].data?.TRAN_CD,
    })
  );
  const modifyArray = (data) => {
    if (data) {
      data.forEach((item, index) => {
        if (index === 0) {
          item.ENTRY_TYPE = "Entry";
        } else {
          item.ENTRY_TYPE = "confirmation";
        }
      });
      return data;
    } else {
      return [];
    }
  };
  const modifiedData = modifyArray(data);

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getShowConfirmedHistory"]);
    };
  }, []);

  return (
    <Fragment>
      <Dialog open={open} fullWidth maxWidth="md">
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
          data={modifiedData ?? []}
          loading={isLoading || isFetching}
          setData={() => null}
          actions={actions}
          setAction={setCurrentAction}
        />
      </Dialog>
    </Fragment>
  );
};
