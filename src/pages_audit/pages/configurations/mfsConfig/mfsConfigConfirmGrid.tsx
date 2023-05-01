import {
  useRef,
  useCallback,
  Fragment,
  useEffect,
  useContext,
  useState,
} from "react";
import GridWrapper from "components/dataTableStatic";
import { ActionTypes } from "components/dataTable";
import { useNavigate } from "react-router-dom";
import { GridMetaDataType } from "components/dataTable/types";
import { makeStyles } from "@material-ui/core";
import * as API from "./api";
import { useMutation, useQuery } from "react-query";
import { MFSGridMetaData } from "./gridMetadata";
import { ClearCacheContext, queryClient } from "cache";
import { Alert } from "components/common/alert";
import { useSnackbar } from "notistack";
import { AuthContext } from "pages_audit/auth";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";

export const useDialogStyles = makeStyles({
  topScrollPaper: {
    alignItems: "center",
  },
  topPaperScrollBody: {
    verticalAlign: "top",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--white)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
});

const actions: ActionTypes[] = [
  {
    actionName: "accept",
    actionLabel: "Accept",
    multiple: false,
    rowDoubleClick: false,
    shouldExclude: (data, authDetails) => {
      if (Array.isArray(data) && data.length > 0) {
        if (
          data[0]?.data?.CONFIRMED === "R" ||
          data[0]?.data?.CONFIRMED === "Y"
        ) {
          return true;
        }
      }
      return false;
    },
  },
  {
    actionName: "reject",
    actionLabel: "Reject",
    multiple: false,
    rowDoubleClick: false,
    shouldExclude: (data, authDetails) => {
      if (Array.isArray(data) && data.length > 0) {
        if (
          data[0]?.data?.CONFIRMED === "R" ||
          data[0]?.data?.CONFIRMED === "Y"
        ) {
          return true;
        }
      }
      return false;
    },
  },
];

export const MFSConfigConfirm = () => {
  const myGridRef = useRef<any>(null);
  const navigate = useNavigate();
  const { getEntries } = useContext(ClearCacheContext);
  const { enqueueSnackbar } = useSnackbar();
  const [rowData, setRowData] = useState({});
  const [isOpenAccept, setIsOpenAccept] = useState(false);
  const [isOpenReject, setIsOpenReject] = useState(false);
  const authController = useContext(AuthContext);

  const setCurrentAction = useCallback(
    (data) => {
      setRowData(data?.rows);
      let confirmed = data?.rows[0]?.data?.CONFIRMED;
      let enteredBy = data?.rows[0]?.data?.LAST_ENTERED_BY;
      if (confirmed === "Y") {
        enqueueSnackbar("Request has been already accepted.", {
          variant: "warning",
        });
      } else if (confirmed === "R") {
        enqueueSnackbar("Request has been already rejected.", {
          variant: "warning",
        });
      } else {
        if (data.name === "accept") {
          if (
            (enteredBy || "").toLowerCase() ===
            (authController?.authState?.user?.id || "").toLowerCase()
          ) {
            enqueueSnackbar("You can not accept your own entry.", {
              variant: "warning",
            });
          } else {
            setIsOpenAccept(true);
          }
        } else if (data.name === "reject") {
          if (
            (enteredBy || "").toLowerCase() ===
            (authController?.authState?.user?.id || "").toLowerCase()
          ) {
            enqueueSnackbar("You can not reject your own entry.", {
              variant: "warning",
            });
          } else {
            setIsOpenReject(true);
          }
        } else {
          navigate(data?.name, {
            state: data?.rows,
          });
        }
      }
    },
    [navigate]
  );

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getMFSGridData", "N"], () => API.getMFSGridData("N", "CONFIRM"));
  const result = useMutation(API.confirmMFSConfigReq, {
    onSuccess: (response: any) => {
      enqueueSnackbar(response, { variant: "success" });
      refetch();
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.error_msg ?? "error", { variant: "error" });
    },
    onSettled: () => {
      onActionCancel();
    },
  });

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getMFSGridData", "N"]);
    };
  }, [getEntries]);
  MFSGridMetaData.gridConfig.gridLabel = "MFS Configuration Confirmation";

  const onAcceptPopupYes = (rows) => {
    result.mutate({
      confirmed: "Y",
      tranCode: rows[0]?.data?.TRAN_CD ?? "",
      companyCode: rows[0]?.data?.COMP_CD ?? "",
    });
  };
  const onRejectPopupYes = (rows) => {
    result.mutate({
      confirmed: "R",
      tranCode: rows[0]?.data?.TRAN_CD ?? "",
      companyCode: rows[0]?.data?.COMP_CD ?? "",
    });
  };
  const onActionCancel = () => {
    setIsOpenAccept(false);
    setIsOpenReject(false);
  };
  return (
    <Fragment>
      {isError && (
        <Alert
          severity="error"
          errorMsg={error?.error_msg ?? "Something went to wrong.."}
          errorDetail={error?.error_detail}
          color="error"
        />
      )}
      <GridWrapper
        key={`MFSConfirmGrid`}
        finalMetaData={MFSGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading || isFetching}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
        ref={myGridRef}
      />
      {isOpenAccept ? (
        <PopupMessageAPIWrapper
          MessageTitle="Confirmation"
          Message="Do you want to accept this Request?"
          onActionYes={(rowVal) => onAcceptPopupYes(rowVal)}
          onActionNo={() => onActionCancel()}
          rows={rowData}
          open={isOpenAccept}
          loading={result.isLoading}
        />
      ) : null}
      {isOpenReject ? (
        <PopupMessageAPIWrapper
          MessageTitle="Confirmation"
          Message="Do you want to reject this Request?"
          onActionYes={(rowVal) => onRejectPopupYes(rowVal)}
          onActionNo={() => onActionCancel()}
          rows={rowData}
          open={isOpenReject}
          loading={result.isLoading}
        />
      ) : null}
    </Fragment>
  );
};
