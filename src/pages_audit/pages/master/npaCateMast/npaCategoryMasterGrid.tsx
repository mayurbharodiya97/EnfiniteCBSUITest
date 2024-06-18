import { ClearCacheContext, queryClient } from "cache";
import { Alert } from "components/common/alert";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { ActionTypes } from "components/dataTable";
import { GridMetaDataType } from "components/dataTable/types";
import GridWrapper from "components/dataTableStatic";
import { enqueueSnackbar } from "notistack";
import { AuthContext } from "pages_audit/auth";
import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useQuery } from "react-query";
import { Route, Routes, useNavigate } from "react-router-dom";
import * as API from "./api";
import { NpaCategoryMasterGridMetaData } from "./gridMetadata";
import { NpaCategoryMasterWrapper } from "./viewDetails/npaCategoryMasterForm";

const actions: ActionTypes[] = [
  {
    actionName: "add",
    actionLabel: "Add",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
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
export const NpaCategoryMasterGrid = () => {
  const { getEntries } = useContext(ClearCacheContext);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const isDataChangedRef = useRef(false);
  const isDeleteDataRef = useRef<any>(null);
  const [isDelete, setDelete] = useState(false);

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
  >(["getNpaCategoryMasterGridData", authState?.user?.branchCode], () =>
    API.getNpaCategoryMasterGridData({
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
        "getNpaCategoryMasterGridData",
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

  const onAcceptDelete = (rows) => {
    setDelete(false);
    enqueueSnackbar("Records successfully deleted", {
      variant: "success",
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
        key={"npaCategoryMasterGrid"}
        finalMetaData={NpaCategoryMasterGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading || isFetching}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
      />
      <Routes>
        <Route
          path="add"
          element={
            <NpaCategoryMasterWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={handleDialogClose}
              defaultView={"new"}
            />
          }
        />
        <Route
          path="view-details"
          element={
            <NpaCategoryMasterWrapper
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
          onActionYes={(rows) => onAcceptDelete(rows)}
          onActionNo={() => setDelete(false)}
          rows={isDeleteDataRef.current}
          open={isDelete}
        />
      ) : null}
    </Fragment>
  );
};
