import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import GridWrapper from "components/dataTableStatic";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import * as API from "./api";
import { useMutation, useQuery } from "react-query";
import { AuthContext } from "pages_audit/auth";
import { getApiGridMetaData } from "./getApiGridMetadata";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ClearCacheContext, queryClient } from "cache";
import { GetApiForm } from "./getApiFormData/getApiForm";
import { enqueueSnackbar } from "notistack";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";

const actions: ActionTypes[] = [
  {
    actionName: "add",
    actionLabel: "Add",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  // {
  //   actionName: "view-details",
  //   actionLabel: "Edit Detail",
  //   multiple: false,
  //   rowDoubleClick: true,
  // },
];
export const GetApiConfig = () => {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const { getEntries } = useContext(ClearCacheContext);
  const isDataChangedRef = useRef(false);
  const [openAccept, setopenAccept] = useState(false);
  const isErrorFuncRef = useRef<any>(null);

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getDynamicApiList"], () => API.getDynamicApiList());

  const deleteData: any = useMutation(API.savedynamicAPIconfig, {
    onSuccess: (data) => {
      enqueueSnackbar("Data Delete successfully", { variant: "success" });
      isDataChangedRef.current = true;
      // closeDialog();
      onActionCancel();
    },
    onError: (error: any) => {
      console.log("<<<error", error);
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
      }
      if (isErrorFuncRef.current == null) {
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
      }
      onActionCancel();
    },
  });
  const onActionCancel = () => {
    setopenAccept(false);
  };
  useEffect(() => {
    return () => {
      let entries = getEntries() as any[];
      if (Array.isArray(entries) && entries.length > 0) {
        entries.forEach((one) => {
          queryClient.removeQueries(one);
        });
      }
      queryClient.removeQueries(["getDynamicApiList"]);
    };
  }, [getEntries]);
  const ClosedEventCall = useCallback(() => {
    if (isDataChangedRef.current === true) {
      // isDataChangedRef.current = true;
      refetch();
      // isDataChangedRef.current = false;
    }
    navigate(".");
  }, [navigate]);

  const setCurrentAction = useCallback(
    (data) => {
      navigate(data?.name, {
        state: data?.rows,
      });
    },
    [navigate]
  );
  const onPopupYesAccept = (rows) => {
    deleteData.mutate({
      ...rows,
    });
  };
  return (
    <>
      <GridWrapper
        key={"dynGridConfigGrid"}
        finalMetaData={getApiGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading || isFetching}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
        // ref={myGridRef}
        // defaultSortOrder={[{ id: "TRAN_CD", desc: false }]}
        onClickActionEvent={(index, id, data) => {
          console.log("<<<delete", index, id, data);
          isErrorFuncRef.current = {
            _isNewRow: false,
            _isDeleteRow: true,
            ID: "" + data.ID,
            DETAILS_DATA: {
              isNewRow: [],
              isDeleteRow: [],
              isUpdatedRow: [],
            },
            _UPDATEDCOLUMNS: [],
            _OLDROWVALUE: {},
            DOC_API_DTL: {
              _isDeleteRow: true,
              API_ID: "" + data.ID,
              _isNewRow: false,
              COMP_CD: authState.companyID,
              BRANCH_CD: authState.user.branchCode,
              DOC_CD: "Default     ",
              API_ENDPOINT: `/enfinityCommonServiceAPI/GETDYNAMICDATA/${data?.ACTION.toUpperCase()}`,
            },
          };
          setopenAccept(true);
        }}
      />
      {openAccept ? (
        <PopupMessageAPIWrapper
          MessageTitle="Confirmation"
          Message="Do you want to Delete this Data ?"
          onActionYes={(rowVal) => onPopupYesAccept(rowVal)}
          onActionNo={() => onActionCancel()}
          rows={isErrorFuncRef.current}
          open={openAccept}
          loading={deleteData.isLoading}
        />
      ) : null}
      <Routes>
        <Route
          path="add/*"
          element={
            <GetApiForm
              isDataChangedRef={isDataChangedRef}
              closeDialog={ClosedEventCall}
              //   defaultView={"add"}
            />
          }
        />
        {/* <Route
          path="view-details/*"
          element={
            <DynamicGridConfigWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={ClosedEventCall}
              defaultView={"view"}
            />
          }
        /> */}
      </Routes>
    </>
  );
};
