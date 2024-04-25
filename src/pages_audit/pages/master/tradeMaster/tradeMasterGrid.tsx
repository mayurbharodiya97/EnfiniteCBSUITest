import { Fragment, useContext, useState } from "react";
import { useRef, useCallback } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ActionTypes } from "components/dataTable";
import { TradeMasterGridMetaData } from "./gridMetaData";
import { TrademasterformWrapper } from "./viewDetails/tradeMasterForm";
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { AuthContext } from "pages_audit/auth";
import * as API from "./api";
import { useMutation, useQuery } from "react-query";
import { Alert } from "components/common/alert";
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
  

   const TradeMaster = () => {
    const {authState} = useContext(AuthContext);
    const isDataChangedRef = useRef(false);
    const isDeleteDataRef = useRef<any>(null);
    const [isDelete, SetDelete] = useState(false);
    const navigate = useNavigate();
    const setCurrentAction = useCallback(
      (data) => {
        if (data?.name === "Delete") {
          isDeleteDataRef.current = data?.rows?.[0];
          SetDelete(true);
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
  >(["getTradeMasterData",authState.user.branchCode], () =>
    API.getTradeMasterData({
      companyID: authState?.companyID,
      branchCode: authState?.user?.branchCode,
    })
  );

  const deleteMutation = useMutation(API.deleteTradeMasterData, {
    onError: (error: any) => { },
    onSuccess: (data) => {
      enqueueSnackbar("Records successfully deleted", {
        variant: "success",
      });
      refetch();
      SetDelete(false);
    },
  });

    const onAcceptDelete = (rows) => {
      deleteMutation.mutate({
        ...rows?.data,
        _isDeleteRow: true,
      });
    };
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
        { isError && (
                <Alert
          severity="error"
          errorMsg={error?.error_msg ?? "Something went to wrong.."}
          errorDetail={error?.error_detail}
          color="error"
        />
        )}
        <GridWrapper
          key={"dynGridConfigGrid"}
          finalMetaData={TradeMasterGridMetaData as GridMetaDataType}
          loading={isLoading || isFetching}
          data={data ?? []}
          setData={() => null}
          actions={actions}
          setAction={setCurrentAction}
          refetchData={()=>refetch()}
        />
     <Routes>
        <Route
          path="add/*"
          element={
            <TrademasterformWrapper
            isDataChangedRef={isDataChangedRef}
              closeDialog={ClosedEventCall}
              defaultView={"add"}
            />
          }
        />
        <Route
          path="view-details/*"
          element={
            <TrademasterformWrapper
            isDataChangedRef={isDataChangedRef}
              closeDialog={ClosedEventCall}
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
          onActionNo={() => SetDelete(false)}
          rows={isDeleteDataRef.current}
          open={isDelete}
          loading={deleteMutation.isLoading}
        />
      ) : null}
      </Fragment>
    );
  };
  
  export default TradeMaster;