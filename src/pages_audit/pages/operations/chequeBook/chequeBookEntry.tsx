import { Fragment, useRef, useCallback, useState, useMemo } from "react";
import { useMutation } from "react-query";
import { FormComponentView } from "components/formcomponent";
import { ChequebookentryFilterForm } from "./metaData";
import { ChequebookentryGridMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { useNavigate } from "react-router-dom";
import { GridMetaDataType } from "components/dataTable/types";
import { FilterFormMetaType } from "components/formcomponent/filterform";
import { ClearCacheProvider } from "cache";
import * as API from "./api";
import { UpdateRequestDataVisibleColumn } from "components/utils";
import { useSnackbar } from "notistack";

export const ChequeBookEntryForm = () => {
  return (
    <ClearCacheProvider>
      <ChequeBookEntry />
    </ClearCacheProvider>
  );
};
const ChequeBookEntry = () => {
  const navigate = useNavigate();
  const myGridRef = useRef<any>(null);
  const [secondButtonVisible, setSecondButtonVisible] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const setCurrentAction = useCallback(
    (data) => {
      navigate(data?.name, {
        state: data?.rows,
      });
    },
    [navigate]
  );

  const getData = useMutation(API.getChequeBookEntryData, {
    onSuccess: (response: any) => {
      setSecondButtonVisible(true);
    },
    onError: (error: any) => {
      // setRetData({ REG_WITH: "A", REG_ACCT_CARD_NO: "" });
      setSecondButtonVisible(false);
    },
  });

  const saveData = useMutation(API.saveCustomerRegisterRequest, {
    onSuccess: (response: any) => {
      setSecondButtonVisible(false);
      enqueueSnackbar(response, {
        variant: "success",
      });
      getData.data[0] = {};
    },
    onError: (error: any) => {
      setSecondButtonVisible(true);
    },
  });

  const ClickEventManage = useCallback(
    (data, columnvisible) => {
      let retdata = UpdateRequestDataVisibleColumn(data, columnvisible);
      console.log(">>retdata", retdata);
      // setRetData(retdata);
      if (retdata?.REG_WITH === "I") {
        // setOpenCBDetails(true);
      } else {
        // getData.mutate({
        //   regWith: retdata?.REG_WITH,
        //   accountCardNo: retdata?.REG_ACCT_CARD_NO,
        // });
      }
    },
    [getData]
  );
  const ClickSecondButtonEventManage = useCallback(
    (retdata, columnvisible) => {
      let retrdata = UpdateRequestDataVisibleColumn(retdata, columnvisible);
      // setRetData(retrdata);
      data[0].CUSTOM_USER_NM = retrdata?.CUSTOM_USER_NM;
      //   saveData.mutate({
      //     inputData: data?.[0],
      //   });
    },
    [getData]
  );

  const data = useMemo(() => {
    if (Array.isArray(getData.data)) {
      return { ...getData.data[0] };
    } else {
      return "";
    }
  }, [getData.data]);
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
      <GridWrapper
        key={`ChequeBookEntryGrid`}
        finalMetaData={ChequebookentryGridMetaData as GridMetaDataType}
        data={data?.[0]?.ALL_ACCOUNT_DETAIL ?? []}
        setData={() => null}
        loading={getData.isLoading}
        setAction={setCurrentAction}
        refetchData={() => {}}
        ref={myGridRef}
      />
      <FormComponentView
        key={"ChequeBookEntry" + (data ?? []).length}
        finalMetaData={ChequebookentryFilterForm as FilterFormMetaType}
        onAction={ClickEventManage}
        loading={getData.isLoading}
        data={data ?? {}}
        submitSecondAction={ClickSecondButtonEventManage}
        submitSecondButtonName="Save"
        submitSecondButtonHide={!secondButtonVisible}
        submitSecondLoading={false}
      ></FormComponentView>
    </Fragment>
  );
};
