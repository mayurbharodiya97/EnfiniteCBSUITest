import React, { Fragment, useCallback, useContext, useEffect, useRef, useState } from "react";
import { gridMetadata } from "./gridMetadata";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ActionTypes } from "components/dataTable";
import { GridMetaDataType } from "components/dataTableStatic";
import GridWrapper from "components/dataTableStatic/";
import { enqueueSnackbar } from "notistack";
import { LienMasterFormWrapper } from "./viewDetails/LineMasterViewDetails";
import { useMutation, useQuery } from "react-query";
import * as API from './api';
import { AuthContext } from "pages_audit/auth";
import { Alert } from "components/common/alert";
import { queryClient } from "cache";
import { usePopupContext } from "components/custom/popupContext";


const actions: ActionTypes[] = [
  {
    actionName: "add",
    actionLabel: "Add",
    multiple: undefined,
    alwaysAvailable: true,
  },
  {
    actionName: "view-details",
    actionLabel: "View Detail",
    multiple: false,
    rowDoubleClick: true,
  },
  {
    actionName: "Delete",
    actionLabel: "Delete",
    multiple: false,
  },
];

const LienMasterGrid = () => {

  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const isDeleteDataRef = useRef<any>(null);
  const isDataChangedRef = useRef<any>(null);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const setCurrentAction = useCallback(
    async (data) => {
      if (data?.name === "Delete") {
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
      }
      else {
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
  >(["getLienMasterData"], () =>
    API.getLienMasterData({
      companyID: authState?.companyID,
      branchCode: authState?.user?.branchCode,
    })
  );
  const deleteMutation = useMutation(API.deleteLienMasterData, {
    onError: (error: any) => {
      let errorMsg = "Unknownerroroccured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
      CloseMessageBox();
    },
    onSuccess: (data) => {
      enqueueSnackbar("deleteSuccessfully", {
        variant: "success",
      });
      refetch();
      CloseMessageBox();
    },
  });



  const ClosedEventCall = () => {
    if (isDataChangedRef.current === true) {
      isDataChangedRef.current = true;
      refetch();
      isDataChangedRef.current = false;
    }
    navigate(".");
  };

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getLienMasterData"]);
    };
  }, []);

  return (
    <Fragment>
      {isError && (
        <Alert
          severity="error"
          errorMsg={error?.error_msg ?? "Somethingwenttowrong"}
          errorDetail={error?.error_detail}
          color="error"
        />
      )}
      <GridWrapper
        key={"lienMasterGrid"}
        finalMetaData={gridMetadata as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        actions={actions}
        loading={isLoading || isFetching}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
        defaultSortOrder={[{ id: "LEAN_CD", desc: false }]}
      />
      <Routes>
        <Route
          path="add/*"
          element={
            <LienMasterFormWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={ClosedEventCall}
              defaultView={"add"}
              gridData={data}
            />
          }
        />
        <Route
          path="view-details/*"
          element={
            <LienMasterFormWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={ClosedEventCall}
              defaultView={"view"}
              gridData={data}
            />
          }
        />
      </Routes>

    </Fragment>
  );
};

export default LienMasterGrid;

