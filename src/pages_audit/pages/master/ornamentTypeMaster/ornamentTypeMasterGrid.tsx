import { useRef, useCallback, useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import { OrnamentTypeMasterGridMetaData } from "./gridMetadata";
import { OrnamentTypeMasterFormWrapper } from "./ornamentTypeMasterForm";
import { useTranslation } from "react-i18next";

import {
  usePopupContext,
  Alert,
  GridWrapper,
  GridMetaDataType,
  ActionTypes,
  queryClient,
  ClearCacheContext,
} from "@acuteinfo/common-base";
import { enqueueSnackbar } from "notistack";
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

export const OrnamentTypeMasterGrid = () => {
  const navigate = useNavigate();
  const isDataChangedRef = useRef(false);
  const { getEntries } = useContext(ClearCacheContext);
  const isDeleteDataRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { t } = useTranslation();

  const deleteMutation = useMutation(API.ornamentTypeMasterDML, {
    onError: async (error: any) => {
      CloseMessageBox();
    },
    onSuccess: () => {
      enqueueSnackbar(t("RecordRemovedMsg"), {
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
          buttonNames: ["Yes", "No"],
          loadingBtnName: ["Yes"],
          icon: "CONFIRM",
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
  >(["getOrnamentTypeMasterGirdData", authState?.user?.branchCode], () =>
    API.getOrnamentTypeMasterGirdData({
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
        "getOrnamentTypeMasterGirdData",
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
    <>
      {(isError || deleteMutation.isError) && (
        <Alert
          severity="error"
          errorMsg={
            error?.error_msg ||
            deleteMutation?.error?.error_msg ||
            t("Somethingwenttowrong")
          }
          errorDetail={
            error?.error_detail || deleteMutation?.error?.error_detail || ""
          }
          color="error"
        />
      )}

      <GridWrapper
        key={"ornamentTypeMasterGrid"}
        finalMetaData={OrnamentTypeMasterGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading || isFetching}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
        enableExport={true}
      />

      <Routes>
        <Route
          path="add/*"
          element={
            <OrnamentTypeMasterFormWrapper
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
            <OrnamentTypeMasterFormWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={handleDialogClose}
              defaultView={"view"}
              gridData={data}
            />
          }
        />
      </Routes>
    </>
  );
};