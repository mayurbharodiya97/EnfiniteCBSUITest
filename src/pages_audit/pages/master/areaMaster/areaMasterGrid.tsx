import { Fragment, useContext, useEffect, useState } from "react";
import { useRef, useCallback } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ActionTypes } from "components/dataTable";
import { AreaMasterGridMetaData } from "./gridMetaData";
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { AuthContext } from "pages_audit/auth";
import * as API from "./api";
import { useMutation, useQuery } from "react-query";
import { Alert } from "components/common/alert";
import { enqueueSnackbar } from "notistack";
import { AreaMasterFormWrapper } from "./viewDetails/areaMasterForm";
import { usePopupContext } from "components/custom/popupContext";
import { t } from "i18next";

let actions: ActionTypes[] = [
  {
    actionName: "add",
    actionLabel: "Add",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "view-details",
    actionLabel: "ViewDetail",
    multiple: false,
    rowDoubleClick: true,
  },
  {
    actionName: "delete",
    actionLabel: "Delete",
    multiple: false,
  },
];


const AreaMaster = () => {
  const authController = useContext(AuthContext);
  const isDataChangedRef = useRef(false);
  const isDeleteDataRef = useRef<any>(null);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const navigate = useNavigate();
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
      }
      navigate(data?.name, {
        state: data?.rows,
      });
    },
    [navigate]
  );
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getAreaMasterData"], () =>
    API.getAreaMasterData({
      companyID: authController?.authState?.companyID,
      branchCode: authController?.authState?.user?.branchCode,
    })
  );
  const { data: miscdata } = useQuery<
    any,
    any
  >(["getMiscTableConfig"], () =>
    API.GETMISCTABLECONFIG("AREA_MST")
  );
  let userLevel;
  if (Array.isArray(miscdata)) {
    miscdata.forEach((item) => {
      userLevel = item.USER_LEVEL;
    });
  }

  const LoginuserLevel = authController?.authState?.role;
  if (LoginuserLevel >= userLevel) {
    AreaMasterGridMetaData.gridConfig.gridLabel = "Area Master (MST/046)" + "(View-Only)";
    actions = [];
  }
  else {
    AreaMasterGridMetaData.gridConfig.gridLabel = "Area Master (MST/046)";
  }

  const deleteMutation = useMutation(API.deleteAreaMasterData, {
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
        key={"areaMaster"}
        finalMetaData={AreaMasterGridMetaData as GridMetaDataType}
        loading={isLoading || isFetching}
        data={data ?? []}
        setData={() => null}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
      />
      <Routes>
        <Route
          path="add/*"
          element={
            <AreaMasterFormWrapper
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
            <AreaMasterFormWrapper
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

export default AreaMaster;
