import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ActionTakenMasterGridMetaData } from "./gridMetadata";
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { ActionTypes } from "components/dataTable";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ActionTakenMasterFormWrapper } from "./actionTakenMasterForm";
import { AuthContext } from "pages_audit/auth";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import { ClearCacheContext, queryClient } from "cache";
import { Alert } from "components/common/alert";
import { enqueueSnackbar } from "notistack";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";

const actions: ActionTypes[] = [
  {
    actionName: "add",
    actionLabel: "Add",
    multiple: undefined,
    alwaysAvailable: true,
    rowDoubleClick: false,
  },
  {
    actionName: "view-details",
    actionLabel: "View Detail",
    multiple: false,
    rowDoubleClick: true,
  },
  {
    actionName: "delete",
    actionLabel: "Delete",
    multiple: false,
    rowDoubleClick: false,
  },
];

export const ActionTakenMasterGrid = () => {
  const navigate = useNavigate();
  const isDataChangedRef = useRef(false);
  const [isDelete, setDelete] = useState(false);
  const { getEntries } = useContext(ClearCacheContext);
  const isDeleteDataRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);

  const setCurrentAction = useCallback(
    (data) => {
      if (data?.name === "delete") {
        isDeleteDataRef.current = data?.rows?.[0];
        setDelete(true);
      } else if (data?.name === "add") {
        navigate(data?.name, {
          state: [],
        });
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
  >(["getActionTakenMasterGridData", authState?.user?.branchCode], () =>
    API.getActionTakenMasterGridData({
      companyID: authState?.companyID ?? "",
      branchCode: authState?.user?.branchCode ?? "",
    })
  );

  useEffect(() => {
    return () => {
      let entries = getEntries() as any[];
      if (Array.isArray(entries) && entries.length > 0) {
        entries.forEach((one) => {
          queryClient.removeQueries(one);
        });
      }
      queryClient.removeQueries([
        "getActionTakenMasterGridData",
        authState?.user?.branchCode,
      ]);
    };
  }, [getEntries]);

  const handleDialogClose = useCallback(() => {
    navigate(".");
    if (isDataChangedRef.current === true) {
      refetch();
      isDataChangedRef.current = false;
    }
  }, [navigate]);

  const deleteMutation = useMutation(API.deleteActionTakenMasterData, {
    onError: (error: any) => {},
    onSuccess: () => {
      enqueueSnackbar("Record successfully deleted", {
        variant: "success",
      });
      refetch();
      setDelete(false);
    },
  });

  const onDeleteYes = (rows) => {
    deleteMutation.mutate({
      ...rows?.data,
      _isDeleteRow: true,
    });
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
        key={"actionTakenMasterGrid"}
        finalMetaData={ActionTakenMasterGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading || isFetching}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
      />
      <Routes>
        <Route
          path="add/*"
          element={
            <ActionTakenMasterFormWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={handleDialogClose}
              defaultView={"new"}
              gridData={data}
            />
          }
        />
        <Route
          path="view-details/*"
          element={
            <ActionTakenMasterFormWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={handleDialogClose}
              defaultView={"view"}
            />
          }
        />
      </Routes>

      {isDelete ? (
        <PopupMessageAPIWrapper
          MessageTitle="Confirmation"
          Message="Are you sure to delete selected row?"
          onActionYes={(rows) => onDeleteYes(rows)}
          onActionNo={() => setDelete(false)}
          rows={isDeleteDataRef.current}
          open={isDelete}
          loading={deleteMutation.isLoading}
        />
      ) : null}
    </Fragment>
  );
};
