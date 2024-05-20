import React, { Fragment, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Prioritymastermainmetadata } from "./gridMetaData";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ActionTypes } from "components/dataTable";
import { GridMetaDataType } from "components/dataTableStatic";
import GridWrapper from "components/dataTableStatic/";
import { enqueueSnackbar } from "notistack";
import { ProrityformWrapper } from "./viewDetail/priorityMasterMainForm";
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
    rowDoubleClick: true,
  },
];

const PriorityMasterMainGrid = () => {

  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const navigate = useNavigate();
  const isDeleteDataRef = useRef<any>(null);
  const isDataChangedRef = useRef<any>(null);

  const setCurrentAction = useCallback(
    async (data) => {
      if (data?.name === "Delete") {
        isDeleteDataRef.current = data?.rows?.[0];
        const btnName = await MessageBox({
          message: "Are you sure to delete selected row?",
          messageTitle: "Confirmation",
          buttonNames: ["Yes", "No"],
          loadingBtnName: "Yes",
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
  >(["getPriorityMainMasterData"], () =>
    API.getPriorityMainMasterData({
      companyID: authState?.companyID,
      branchCode: authState?.user?.branchCode,
    })
  );
  const deleteMutation = useMutation(API.deletePriorityMasterMainData, {
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
      enqueueSnackbar("Records successfully deleted", {
        variant: "success",
      });
      CloseMessageBox();
      refetch();
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
      queryClient.removeQueries(["getPriorityMainMasterData"]);
    };
  }, []);

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
        key={"getPriorityMainMasterData"}
        finalMetaData={Prioritymastermainmetadata as GridMetaDataType}
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
            <ProrityformWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={ClosedEventCall}
              defaultView={"add"}
            />
          }
        />
        <Route
          path="view-details/*"
          element={
            <ProrityformWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={ClosedEventCall}
              defaultView={"view"}
            />
          }
        />
      </Routes>
    </Fragment>
  );
};

export default PriorityMasterMainGrid;

