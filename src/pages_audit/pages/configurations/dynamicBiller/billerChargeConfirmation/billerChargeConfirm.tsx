import {
  useRef,
  useCallback,
  useEffect,
  useContext,
  Fragment,
  useState,
} from "react";
import { BillerChargeConfirmGridMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { ActionTypes } from "components/dataTable";
import { useNavigate } from "react-router-dom";
import { GridMetaDataType } from "components/dataTable/types";
import { ClearCacheContext, queryClient } from "cache";
import { useQuery, useMutation } from "react-query";
import * as API from "../api";
import { useSnackbar } from "notistack";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";

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
];

export const DynamicBillerChargeConfirm = () => {
  const isDataChangedRef = useRef(false);
  const myGridRef = useRef<any>(null);
  const { getEntries } = useContext(ClearCacheContext);
  const { enqueueSnackbar } = useSnackbar();
  const [rowData, setRowData] = useState({});
  const [isOpenAccept, setIsOpenAccept] = useState(false);
  const [isOpenReject, setIsOpenReject] = useState(false);
  const navigate = useNavigate();
  const setCurrentAction = useCallback(
    (data) => {
      setRowData(data?.rows);
      if (data.name === "accept") {
        setIsOpenAccept(true);
      } else if (data.name === "reject") {
        setIsOpenReject(true);
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
  >(["getBillerChargeConfirmGridData"], () =>
    API.getBillerChargeConfirmGridData()
  );

  const result = useMutation(API.updBillerChargeConfigConfirm, {
    onSuccess: (response: any) => {
      enqueueSnackbar(response, { variant: "success" });
      onActionCancel();
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
      queryClient.removeQueries(["getBillerChargeConfirmGridData"]);
    };
  }, [getEntries]);

  const ClosedEventCall = useCallback(() => {
    navigate(".");
  }, [navigate]);

  const onAcceptPopupYes = (rows) => {
    result.mutate({
      categoryID: rows?.[0]?.data?.CATEGORY_ID ?? "",
      subCategoryID: rows?.[0]?.data?.SUB_CATEGORY_ID ?? "",
      billerID: rows?.[0]?.data?.BILLER_ID ?? "",
      confirmed: "Y",
    });
  };
  const onRejectPopupYes = (rows) => {
    result.mutate({
      categoryID: rows?.[0]?.data?.CATEGORY_ID ?? "",
      subCategoryID: rows?.[0]?.data?.SUB_CATEGORY_ID ?? "",
      billerID: rows?.[0]?.data?.BILLER_ID ?? "",
      confirmed: "R",
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
        key={`billerChargeConfirmGrid`}
        finalMetaData={BillerChargeConfirmGridMetaData as GridMetaDataType}
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
