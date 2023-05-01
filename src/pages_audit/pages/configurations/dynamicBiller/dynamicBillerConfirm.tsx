import {
  useRef,
  useCallback,
  useEffect,
  useContext,
  Fragment,
  useState,
} from "react";
import { DynamicBillerConfirmGridMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { ActionTypes } from "components/dataTable";
import { Route, Routes, useNavigate } from "react-router-dom";
import { GridMetaDataType } from "components/dataTable/types";
import { ClearCacheContext, queryClient } from "cache";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import { useSnackbar } from "notistack";
import { RefreshBillersData } from "./refreshBillerData";
import BillerDetailRefresh from "./refreshBillerData/billerDetailRefresh/billerDetailRefresh";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { DynamicBillerConfirmGrid } from "./billerConfirm";

const actions: ActionTypes[] = [
  {
    actionName: "accept",
    actionLabel: "Accept",
    multiple: false,
    rowDoubleClick: false,
  },
  {
    actionName: "reject",
    actionLabel: "Reject",
    multiple: false,
    rowDoubleClick: false,
  },
  {
    actionName: "view-detail",
    actionLabel: "View Detail",
    multiple: false,
    rowDoubleClick: true,
  },
];

export const DynamicBillerConfirm = () => {
  const isDataChangedRef = useRef(false);
  const myGridRef = useRef<any>(null);
  const { getEntries } = useContext(ClearCacheContext);
  const { enqueueSnackbar } = useSnackbar();
  const [rowData, setRowData] = useState({});
  const [isOpenAcceptDialog, setIsOpenAcceptDialog] = useState(false);
  const [isOpenRejectDialog, setIsOpenRejectDialog] = useState(false);
  const navigate = useNavigate();
  const setCurrentAction = useCallback(
    (data) => {
      setRowData(data?.rows);
      if (data.name === "accept") {
        setIsOpenAcceptDialog(true);
      } else if (data.name === "reject") {
        setIsOpenRejectDialog(true);
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getBillerConfirmGridData"], () => API.getBillerConfirmGridData());

  const result = useMutation(API.updateBillerConfigConfirm, {
    onSuccess: (response: any) => {
      enqueueSnackbar(response, { variant: "success" });
      onActionCancel();
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
      queryClient.removeQueries(["getBillerConfirmGridData"]);
    };
  }, [getEntries]);

  const ClosedEventCall = useCallback(() => {
    navigate(".");
  }, [navigate]);

  const onAcceptPopupYes = (rows) => {
    result.mutate({ confirmed: "Y", trancd: rows?.[0]?.data?.TRAN_CD });
  };
  const onRejectPopupYes = (rows) => {
    result.mutate({ confirmed: "R", trancd: rows?.[0]?.data?.TRAN_CD });
  };

  const onActionCancel = () => {
    setIsOpenAcceptDialog(false);
    setIsOpenRejectDialog(false);
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
        key={`dynamicBillerConfirmGrid`}
        finalMetaData={DynamicBillerConfirmGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading || isFetching}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
        ref={myGridRef}
      />
      {isOpenAcceptDialog && (
        <PopupMessageAPIWrapper
          MessageTitle="Confirmation"
          Message="Do you want to accept this request?"
          onActionYes={(rowVal) => onAcceptPopupYes(rowVal)}
          onActionNo={() => onActionCancel()}
          rows={rowData}
          open={isOpenAcceptDialog}
          loading={result.isLoading}
        />
      )}
      {isOpenRejectDialog && (
        <PopupMessageAPIWrapper
          MessageTitle="Confirmation"
          Message="Do you want to reject this request?"
          onActionYes={(rowVal) => onRejectPopupYes(rowVal)}
          onActionNo={() => onActionCancel()}
          rows={rowData}
          open={isOpenRejectDialog}
          loading={result.isLoading}
        />
      )}
      <Routes>
        <Route
          path="view-detail/*"
          element={
            <DynamicBillerConfirmGrid onCloseDialog={() => ClosedEventCall()} />
          }
        />
      </Routes>
    </Fragment>
  );
};
