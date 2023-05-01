import { Fragment, useRef, useCallback, useState } from "react";
import { useMutation } from "react-query";
import { FormComponentView } from "components/formcomponent";
import { CustomerSearchingFilterForm } from "./metaData";
import { CustomerSearchingGridMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { ActionTypes } from "components/dataTable";
import { Routes, Route, useNavigate } from "react-router-dom";
import { GridMetaDataType } from "components/dataTable/types";
import { FilterFormMetaType } from "components/formcomponent/filterform";
import { ClearCacheProvider } from "cache";
import * as API from "./api";
import { UpdateRequestDataVisibleColumn } from "components/utils";
import { CustomerDetailsGrid } from "./customerDetails/customerDetails";
import { CustomerDataRefreshView } from "./customerDataRefresh";
import { CustomerLimitUpdateMain } from "./customerLimitUpdate";
import { RemarksAPIWrapper } from "components/custom/Remarks";
import { useSnackbar } from "notistack";
const actions: ActionTypes[] = [
  {
    actionName: "view-details",
    actionLabel: "View Details",
    multiple: false,
    rowDoubleClick: true,
  },
  {
    actionName: "limit-configuration",
    actionLabel: "Limit Modification",
    multiple: false,
    rowDoubleClick: false,
  },
  {
    actionName: "refresh-data",
    actionLabel: "Current Relationship Data",
    multiple: false,
    rowDoubleClick: false,
  },
  {
    actionName: "lock-unlock-user",
    actionLabel: "Restrict",
    multiple: false,
    rowDoubleClick: false,
    shouldExclude: (rows) => {
      let exclude = false;
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].data?.STATUS !== "Unlock") {
          exclude = true;
          break;
        }
      }
      return exclude;
    },
  },
  {
    actionName: "lock-unlock-user",
    actionLabel: "Unlock",
    multiple: false,
    rowDoubleClick: false,
    shouldExclude: (rows) => {
      let exclude = false;
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].data?.STATUS !== "Restrict") {
          exclude = true;
          break;
        }
      }
      return exclude;
    },
  },
];
export const CustomerSearchingForm = () => {
  return (
    <ClearCacheProvider>
      <CustomerSearching />
    </ClearCacheProvider>
  );
};
const CustomerSearching = () => {
  const navigate = useNavigate();
  const myGridRef = useRef<any>(null);
  const [rowsData, setRowsData] = useState([]);
  const [isOpenRemarks, setOpenRemarks] = useState(false);
  const [isRemarkTitle, setRemarkTitle] = useState("Confirmation Remarks");
  const [retData, setRetData] = useState("Confirmation Remarks");

  const { enqueueSnackbar } = useSnackbar();

  const setCurrentAction = useCallback(
    (data) => {
      setRowsData(data?.rows[0]?.data);
      if (data.name === "lock-unlock-user") {
        if (data?.rows[0]?.data.STATUS === "Restrict") {
          setRemarkTitle("Unlocking Remarks");
        } else {
          setRemarkTitle("Restriction Remarks");
        }
        setOpenRemarks(true);
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );

  const saveData = useMutation(API.getCustomerListSearching, {
    onSuccess: (response: any) => {},
    onError: (error: any) => {},
  });

  const mutation = useMutation(API.updateRestrictUnlockUserData, {
    onSuccess: (response: any) => {
      enqueueSnackbar(response, {
        variant: "success",
      });
      onActionCancel();
      saveData.mutate({ data: retData });
    },
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
      onActionCancel();
    },
  });
  const ClickEventManage = useCallback(
    (data, columnvisible) => {
      let retdata = UpdateRequestDataVisibleColumn(data, columnvisible);
      setRetData(retdata);
      saveData.mutate({ data: retdata });
    },
    [saveData]
  );
  const updateRestictUnlockUser = (val, rows) => {
    let restrictUnlockStatus = "Y";
    if (rows?.STATUS === "Restrict") {
      restrictUnlockStatus = "Y";
    } else if (rows?.STATUS === "Unlock") {
      restrictUnlockStatus = "N";
    }
    mutation.mutate({
      userName: rows?.USER_NAME ?? "",
      restrictUnlockStatus: restrictUnlockStatus,
      remarks: val,
    });
  };
  const onActionCancel = () => {
    setOpenRemarks(false);
  };
  const ClosedEventCall = useCallback(() => {
    navigate(".");
  }, [navigate]);
  const RefreshData = () => {
    saveData.mutate({ data: retData });
  };
  return (
    <Fragment>
      {saveData.isError && (
        <Alert
          severity={saveData.error?.severity ?? "error"}
          errorMsg={saveData.error?.error_msg ?? "Something went to wrong.."}
          errorDetail={saveData.error?.error_detail}
          color="error"
        />
      )}
      <FormComponentView
        key={"customerSearching"}
        finalMetaData={CustomerSearchingFilterForm as FilterFormMetaType}
        onAction={ClickEventManage}
        loading={saveData.isLoading}
        data={{}}
      ></FormComponentView>
      <GridWrapper
        key={`customerSearchingGrid`}
        finalMetaData={CustomerSearchingGridMetaData as GridMetaDataType}
        data={saveData.data ?? []}
        setData={() => null}
        loading={saveData.isLoading}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => {}}
        ref={myGridRef}
      />

      <Routes>
        <Route
          path="view-details"
          element={<CustomerDetailsGrid ClosedEventCall={ClosedEventCall} />}
        />
        <Route
          path="refresh-data"
          element={
            <CustomerDataRefreshView ClosedEventCall={ClosedEventCall} />
          }
        />
        <Route
          path="limit-configuration"
          element={
            <CustomerLimitUpdateMain
              ClosedEventCall={ClosedEventCall}
              RefreshData={() => {
                RefreshData();
              }}
            />
          }
        />
      </Routes>
      <RemarksAPIWrapper
        TitleText={isRemarkTitle}
        onActionNo={() => onActionCancel()}
        onActionYes={updateRestictUnlockUser}
        isLoading={mutation.isLoading}
        isEntertoSubmit={true}
        AcceptbuttonLabelText="Ok"
        CanceltbuttonLabelText="Cancel"
        open={isOpenRemarks}
        rows={rowsData}
      />
    </Fragment>
  );
};
