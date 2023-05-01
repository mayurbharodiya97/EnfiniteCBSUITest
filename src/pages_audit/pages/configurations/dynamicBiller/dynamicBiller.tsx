import {
  useRef,
  useCallback,
  useEffect,
  useContext,
  Fragment,
  useState,
} from "react";
import { DynamicBillerGridMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { ActionTypes } from "components/dataTable";
import { Route, Routes, useNavigate } from "react-router-dom";
import { GridMetaDataType } from "components/dataTable/types";
import { ClearCacheContext, queryClient } from "cache";
import { useQuery, useMutation } from "react-query";
import * as API from "./api";
import { useSnackbar } from "notistack";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { BillerDetailWrapper } from "./billerDetail";
import { RefreshBillersData } from "./refreshBillerData";
import { BillerChargeConfigWrapper } from "./billerChargeConfig";

const actions: ActionTypes[] = [
  {
    actionName: "refresh-data",
    actionLabel: "Refresh",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "view-detail",
    actionLabel: "View Detail",
    multiple: false,
    rowDoubleClick: true,
  },
  {
    actionName: "charge",
    actionLabel: "Charges",
    multiple: true,
    rowDoubleClick: false,
  },
  {
    actionName: "delete",
    actionLabel: "Delete",
    multiple: true,
    rowDoubleClick: false,
  },
];

export const DynamicBillers = () => {
  const isDataChangedRef = useRef(false);
  const myGridRef = useRef<any>(null);
  const { getEntries } = useContext(ClearCacheContext);
  const { enqueueSnackbar } = useSnackbar();
  const [rowData, setRowData] = useState({});
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const navigate = useNavigate();
  const setCurrentAction = useCallback(
    (data) => {
      console.log(data);
      setRowData(data?.rows);
      if (data.name === "delete") {
        setIsOpenDeleteDialog(true);
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
  >(["getBillerGridData"], () => API.getBillerGridData());

  const result = useMutation(API.deleteBillerConfigConfirm, {
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
      queryClient.removeQueries(["getBillerGridData"]);
    };
  }, [getEntries]);

  const ClosedEventCall = useCallback(() => {
    navigate(".");
  }, [navigate]);

  const onPopupYes = (rows) => {
    result.mutate({
      categoryID: rows?.[0]?.data?.CATEGORY_ID ?? "",
      subCategoryID: rows?.[0]?.data?.SUB_CATEGORY_ID ?? "",
      billerID: rows?.[0]?.data?.BILLER_ID ?? "",
    });
  };

  const onActionCancel = () => {
    setIsOpenDeleteDialog(false);
  };

  console.log(">>rowData", rowData);
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
        key={`dynamicBillerGrid`}
        finalMetaData={DynamicBillerGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading || isFetching}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
        ref={myGridRef}
      />

      {isOpenDeleteDialog && (
        <PopupMessageAPIWrapper
          MessageTitle="Confirmation"
          Message="Do you want to delete this request?"
          onActionYes={(rowVal) => onPopupYes(rowVal)}
          onActionNo={() => onActionCancel()}
          rows={rowData}
          open={isOpenDeleteDialog}
          loading={result.isLoading}
        />
      )}
      <Routes>
        <Route
          path="view-detail/*"
          element={
            <BillerDetailWrapper
              handleDialogClose={ClosedEventCall}
              // parentData={rowData}
            />
          }
        />
        <Route
          path="refresh-data/*"
          element={<RefreshBillersData onCloseDialog={ClosedEventCall} />}
        />
        <Route
          path="charge/*"
          element={
            <BillerChargeConfigWrapper
              handleDialogClose={ClosedEventCall}
              isDataChangedRef={isDataChangedRef}
            />
          }
        />
      </Routes>
    </Fragment>
  );
};
