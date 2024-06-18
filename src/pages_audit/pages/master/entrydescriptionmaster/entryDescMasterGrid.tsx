import { ClearCacheContext, queryClient } from "cache";
import { Alert } from "components/common/alert";
import { usePopupContext } from "components/custom/popupContext";
import { ActionTypes } from "components/dataTable";
import { GridMetaDataType } from "components/dataTable/types";
import GridWrapper from "components/dataTableStatic";
import { enqueueSnackbar } from "notistack";
import { AuthContext } from "pages_audit/auth";
import { Fragment, useCallback, useContext, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { Route, Routes, useNavigate } from "react-router-dom";
import * as API from "./api";
import { EntryDescMasterGridMetaData } from "./gridMetadata";
import { EntryDescMasterWrapper } from "./viewDetails/entryDescMasterForm";

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
    actionLabel: "ViewDetails",
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

export const EntryDescMasterGrid = () => {
  const { getEntries } = useContext(ClearCacheContext);
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const navigate = useNavigate();
  const isDataChangedRef = useRef(false);
  const isDeleteDataRef = useRef<any>(null);
  const { t } = useTranslation();

  const deleteMutation = useMutation(API.updateEntryDescMasterData, {
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
    onSuccess: () => {
      enqueueSnackbar("Records successfully deleted", {
        variant: "success",
      });
      CloseMessageBox();
      refetch();
    },
  });

  const setCurrentAction = useCallback(
    async (data) => {
      if (data?.name === "delete") {
        isDeleteDataRef.current = data?.rows?.[0];
        const btnName = await MessageBox({
          message: "DeleteData",
          messageTitle: "Confirmation",
          buttonNames: [t("Yes"), t("NO")],
          loadingBtnName: ["Yes"],
        });
        if (btnName === t("Yes")) {
          deleteMutation.mutate({
            data: { ...isDeleteDataRef.current?.data, _isDeleteRow: true },
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
  >(["getEntryDescMasterGridData", authState?.user?.branchCode ?? ""], () =>
    API.getEntryDescMasterGridData({
      companyID: authState?.companyID ?? "",
      branchCode: authState?.user?.branchCode ?? "",
    })
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries([
        "getEntryDescMasterGridData",
        authState?.user?.branchCode,
      ]);
    };
  }, [getEntries]);

  const handleDialogClose = useCallback(() => {
    if (isDataChangedRef.current === true) {
      isDataChangedRef.current = true;
      refetch();
      isDataChangedRef.current = false;
    }
    navigate(".");
  }, [navigate]);

  return (
    <Fragment>
      {isError && (
        <Alert
          severity="error"
          errorMsg={error?.error_msg ?? "Something went to wrong.."}
          errorDetail={error?.error_detail ?? ""}
          color="error"
        />
      )}

      <GridWrapper
        key={"entryDescMasterGrid"}
        finalMetaData={EntryDescMasterGridMetaData as GridMetaDataType}
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
            <EntryDescMasterWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={handleDialogClose}
              defaultView={"new"}
              gridData={data}
            />
          }
        />
        <Route
          path="view-details"
          element={
            <EntryDescMasterWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={handleDialogClose}
              defaultView={"view"}
              gridData={data}
            />
          }
        />
      </Routes>
    </Fragment>
  );
};
