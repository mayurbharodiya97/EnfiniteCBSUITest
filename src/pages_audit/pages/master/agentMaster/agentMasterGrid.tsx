import { useRef, useCallback, useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { AgentMasterGridMetaData } from "./gridMetadata";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import { enqueueSnackbar } from "notistack";
import { AgentMasterFormWrapper } from "./agentMasterForm";
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

export const AgentMasterGrid = () => {
  const navigate = useNavigate();
  const isDataChangedRef = useRef(false);
  const { getEntries } = useContext(ClearCacheContext);
  const isDeleteDataRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { t } = useTranslation();

  const deleteMutation = useMutation(API.agentMasterDML, {
    onError: async (error: any) => {
      let errorMsg = t("Unknownerroroccured");
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      await MessageBox({
        messageTitle: "Error",
        message: errorMsg ?? "",
        icon: "ERROR",
      });
      CloseMessageBox();
    },
    onSuccess: () => {
      enqueueSnackbar(t("RecordsDeletedMsg"), {
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
  >(["getAgentMasterGirdData", authState?.user?.branchCode], () =>
    API.getAgentMasterGirdData({
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
        "getAgentMasterGirdData",
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
      {isError && (
        <Alert
          severity="error"
          errorMsg={error?.error_msg ?? t("Somethingwenttowrong")}
          errorDetail={error?.error_detail}
          color="error"
        />
      )}
      <GridWrapper
        key={"agentMasterGrid"}
        finalMetaData={AgentMasterGridMetaData as GridMetaDataType}
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
            <AgentMasterFormWrapper
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
            <AgentMasterFormWrapper
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
