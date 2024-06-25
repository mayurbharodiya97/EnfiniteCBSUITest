import { useCallback, useContext, useEffect, useRef } from "react";
import GridWrapper from "components/dataTableStatic";
import { ClearingBankMstGridMetaData } from "./gridMetadata";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import * as API from "./api";
import { Route, Routes, useNavigate } from "react-router-dom";
import { AuthContext } from "pages_audit/auth";
import { Alert } from "components/common/alert";
import { useMutation, useQuery } from "react-query";
import { ClearCacheContext, queryClient } from "cache";
import { AddBranchGrid } from "./branch/addBranchGrid";
import { ClearingBankMstFormWrapper } from "./form";
import { enqueueSnackbar } from "notistack";
import { usePopupContext } from "components/custom/popupContext";

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
];

export const ClearingBankMstGrid = () => {
  const isDeleteDataRef = useRef<any>(null);
  const isDataChangedRef = useRef(false);
  const { authState } = useContext(AuthContext);
  const { getEntries } = useContext(ClearCacheContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (authState?.user?.baseBranchCode === authState?.user?.branchCode) {
      actions.push({
        actionName: "add-branch",
        actionLabel: "Add Branch",
        multiple: false,
        rowDoubleClick: false,
      });
    }
    return () => {
      actions.length = 0;
      actions.push(
        {
          actionName: "add",
          actionLabel: "Add",
          multiple: undefined,
          rowDoubleClick: false,
          alwaysAvailable: true,
        },
        {
          actionName: "view-details",
          actionLabel: "ViewDetails",
          multiple: false,
          rowDoubleClick: true,
        },
        {
          actionName: "delete",
          actionLabel: "Delete",
          multiple: false,
          rowDoubleClick: false,
        }
      );
    };
  }, []);

  const setCurrentAction = useCallback(
    async (data) => {
      if (data?.name === "delete") {
        isDeleteDataRef.current = data?.rows?.[0];
        const btnName = await MessageBox({
          message: "DeleteData",
          messageTitle: "Confirmation",
          buttonNames: ["Yes", "No"],
          loadingBtnName: ["Yes"],
        });
        if (btnName === "Yes") {
          deleteMutation.mutate({
            ...isDeleteDataRef.current?.data,
            _isDeleteRow: true,
          });
        }
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

  const deleteMutation = useMutation(API.clearingBankMasterDataDML, {
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
      CloseMessageBox();
    },
    onSuccess: (data) => {
      enqueueSnackbar("Record successfully deleted", {
        variant: "success",
      });
      CloseMessageBox();
      refetch();
    },
  });

  const handleDialogClose = useCallback(() => {
    navigate(".");
    if (isDataChangedRef.current === true) {
      refetch();
      isDataChangedRef.current = false;
    }
  }, [navigate]);

  return (
    <>
      {isError && (
        <Alert
          severity="error"
          errorMsg={error?.error_msg ?? "Something went to wrong.."}
          errorDetail={error?.error_detail}
          color="error"
        />
      )}
      <GridWrapper
        key={`clearingBankMstGrid` + actions.length}
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
              gridData={data}
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
              gridData={data}
            />
          }
        />
        <Route
          path="add-branch/*"
          element={<AddBranchGrid handleDialogClose={handleDialogClose} />}
        />
      </Routes>
    </>
  );
};
