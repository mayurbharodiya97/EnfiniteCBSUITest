import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import GridWrapper from "components/dataTableStatic";
import { ClearingBankMstGridMetaData } from "./gridMetadata";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import * as API from "./api";
import { Route, Routes, useNavigate } from "react-router-dom";
import { AuthContext } from "pages_audit/auth";
import { Alert } from "reactstrap";
import { useQuery } from "react-query";
import { ClearCacheContext, queryClient } from "cache";
import { AddBranchGrid } from "./branch/addBranchGrid";
import { ClearingBankMstFormWrapper } from "./form";

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
    actionLabel: "View Details",
    multiple: false,
    rowDoubleClick: true,
  },
  {
    actionName: "delete",
    actionLabel: "Delete",
    multiple: false,
    rowDoubleClick: false,
  },
  {
    actionName: "add-branch",
    actionLabel: "Add Branch",
    multiple: false,
    rowDoubleClick: false,
  },
];

export const ClearingBankMstGrid = () => {
  const [isDelete, setDelete] = useState(false);
  const isDeleteDataRef = useRef<any>(null);
  const isDataChangedRef = useRef(false);
  const { authState } = useContext(AuthContext);
  const { getEntries } = useContext(ClearCacheContext);

  const navigate = useNavigate();
  const setCurrentAction = useCallback(
    (data) => {
      if (data?.name === "delete") {
        isDeleteDataRef.current = data?.rows?.[0];
        setDelete(true);
      } else if (data?.name === "add") {
        navigate(data?.name, {
          state: [],
        });
      } else if (data?.name === "add-branch") {
        navigate(data?.name);
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
  >(["getClearingBankMasterData", authState?.user?.branchCode], () =>
    API.getClearingBankMasterData({
      branchCode: authState?.user?.branchCode ?? "",
      companyID: authState?.companyID ?? "",
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
        "getClearingBankMasterData",
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
        key={`clearingBankMstGrid`}
        finalMetaData={ClearingBankMstGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading || isFetching}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
      />
      <Routes>
        <Route
          path="view-details/*"
          element={
            <ClearingBankMstFormWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={handleDialogClose}
              defaultView={"view"}
            />
          }
        />
        <Route
          path="add/*"
          element={
            <ClearingBankMstFormWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={handleDialogClose}
              defaultView={"new"}
            />
          }
        />
        <Route
          path="add-branch/*"
          element={<AddBranchGrid handleDialogClose={handleDialogClose} />}
        />
      </Routes>
    </Fragment>
  );
};
