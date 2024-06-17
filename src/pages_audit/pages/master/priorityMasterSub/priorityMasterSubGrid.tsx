import { Fragment, useContext } from "react";
import { useRef, useCallback } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ActionTypes } from "components/dataTable";
import { Prioritymastersubmetadata } from "./gridMetaData";
import { ProritymastersubformWrapper } from "./ViewDetail/priorityMasterSubForm";
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { enqueueSnackbar } from "notistack";
import { AuthContext } from "pages_audit/auth";
import * as API from "./api";
import { useMutation, useQuery } from "react-query";
import { Alert } from "components/common/alert";
import { usePopupContext } from "components/custom/popupContext";
import { t } from "i18next";
const actions: ActionTypes[] = [
  {
    actionName: "add",
    actionLabel: t("Add"),
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "view-details",
    actionLabel: t("ViewDetail"),
    multiple: false,
    rowDoubleClick: true,
  },
  {
    actionName: "Delete",
    actionLabel: t("Delete"),
    multiple: false,
  },
];

const Prioritymastersub = () => {

  const authController = useContext(AuthContext);
  const isDataChangedRef = useRef(false);
  const isDeleteDataRef = useRef<any>(null);
  const navigate = useNavigate();
  const { MessageBox, CloseMessageBox } = usePopupContext();
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
  >(["getPriorityMasterSubData"], () =>
    API.getPriorityMasterSubData({
      companyID: authController?.authState?.companyID,
      branchCode: authController?.authState?.user?.branchCode,
    })
  );

  const deleteMutation = useMutation(API.deletePriorityMasterSubData, {
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
        key={"prioritymastersub"}
        finalMetaData={Prioritymastersubmetadata as GridMetaDataType}
        loading={isLoading || isFetching}
        data={data ?? []}
        setData={() => null}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
        defaultSortOrder={[{ id: "SUB_PRIORITY_CD", desc: false }]}
      />
      <Routes>
        <Route
          path="add/*"
          element={
            <ProritymastersubformWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={ClosedEventCall}
              defaultView={"add"}
            />
          }
        />
        <Route
          path="view-details/*"
          element={
            <ProritymastersubformWrapper
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

export default Prioritymastersub;