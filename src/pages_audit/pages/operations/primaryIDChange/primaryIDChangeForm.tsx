import { Fragment, useRef, useCallback, useState, useMemo } from "react";
import { useMutation } from "react-query";
import { FormComponentView } from "components/formcomponent";
import { PrimaryIDChangeFilterForm } from "./metaData";
import { PrimaryIDChangeGridMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { useNavigate } from "react-router-dom";
import { GridMetaDataType } from "components/dataTable/types";
import { FilterFormMetaType } from "components/formcomponent/filterform";
import { ClearCacheProvider } from "cache";
import { ActionTypes } from "components/dataTable";
import * as API from "./api";
import { UpdateRequestDataVisibleColumn } from "components/utils";
import { useSnackbar } from "notistack";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
const actions: ActionTypes[] = [
  {
    actionName: "setPrimary",
    actionLabel: "Set As Primary",
    multiple: false,
    rowDoubleClick: false,
  },
];

export const PrimaryIDChangeForm = () => {
  return (
    <ClearCacheProvider>
      <PrimaryIDChange />
    </ClearCacheProvider>
  );
};
const PrimaryIDChange = () => {
  const navigate = useNavigate();
  const myGridRef = useRef<any>(null);
  const myGridRefCnt = useRef<any>(0);
  const [rowData, setRowData] = useState({});
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [retData, setRetData] = useState({ REG_ACCT_CARD_NO: "" });
  // const [secondButtonVisible, setSecondButtonVisible] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const setCurrentAction = useCallback(
    (data) => {
      setRowData(data?.rows);
      if (data.name === "setPrimary") {
        setIsOpenPopup(true);
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );

  const getData = useMutation(API.getPrimaryIDChangeData, {
    onSuccess: (response: any) => {},
    onError: (error: any) => {},
  });

  const saveData = useMutation(API.sentNewPrimaryIDRequest, {
    onSuccess: (response: any) => {
      enqueueSnackbar(response, {
        variant: "success",
      });
      onActionCancel();
      myGridRefCnt.current = 0;
      getData.data[0] = {};
    },
    onError: (error: any) => {
      onActionCancel();
    },
  });
  const onActionCancel = () => {
    setIsOpenPopup(false);
  };
  const onPopupYes = (rows) => {
    saveData.mutate(rows);
  };
  const ClickEventManage = useCallback(
    (data, columnvisible) => {
      let retdata = UpdateRequestDataVisibleColumn(data, columnvisible);
      setRetData(retdata);
      getData.mutate({
        regWith: retdata?.SEARCH_WITH,
        accountCardNo: retdata?.REG_ACCT_CARD_NO,
      });
    },
    [getData]
  );

  const data = useMemo(() => {
    if (!Array.isArray(getData.data)) {
      return { ...retData };
    } else {
      myGridRefCnt.current = myGridRefCnt.current + 1;
      return { ...retData, ...getData.data[0]?.MASTER };
    }
  }, [getData.data, retData]);

  return (
    <Fragment>
      {getData.isError && (
        <Alert
          severity={getData.error?.severity ?? "error"}
          errorMsg={getData.error?.error_msg ?? "Something went to wrong.."}
          errorDetail={getData.error?.error_detail}
          color="error"
        />
      )}
      {saveData.isError && (
        <Alert
          severity={saveData.error?.severity ?? "error"}
          errorMsg={saveData.error?.error_msg ?? "Something went to wrong.."}
          errorDetail={saveData.error?.error_detail}
          color="error"
        />
      )}
      <FormComponentView
        key={
          "primaryIDChange" +
            myGridRefCnt.current +
            "" +
            retData?.REG_ACCT_CARD_NO ?? ""
        }
        finalMetaData={PrimaryIDChangeFilterForm as FilterFormMetaType}
        onAction={ClickEventManage}
        loading={getData.isLoading}
        data={data ?? {}}
      ></FormComponentView>
      <GridWrapper
        key={`primaryIDChangeDetailGrid`}
        finalMetaData={PrimaryIDChangeGridMetaData as GridMetaDataType}
        data={getData.data?.[0]?.CUSTDATA ?? []}
        setData={() => null}
        loading={getData.isLoading}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => {}}
        ref={myGridRef}
      />
      {isOpenPopup ? (
        <PopupMessageAPIWrapper
          MessageTitle="Confirmation"
          Message="Do you want to set this account/card as a Primary Identifier?"
          onActionYes={(rowVal) => onPopupYes(rowVal)}
          onActionNo={() => onActionCancel()}
          rows={{ ...data, ...rowData }}
          open={isOpenPopup}
          loading={saveData.isLoading}
        />
      ) : null}
    </Fragment>
  );
};
