import { Fragment, useRef, useCallback, useState, useMemo } from "react";
import { useMutation } from "react-query";
import { FormComponentView } from "components/formcomponent";
import { ChequeBookIssueEntry } from "./metaData";
import { ChequebookentryGridMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { useNavigate } from "react-router-dom";
import { GridMetaDataType } from "components/dataTable/types";
import { ClearCacheProvider } from "cache";
import * as API from "./api";
import { UpdateRequestDataVisibleColumn } from "components/utils";
import { useSnackbar } from "notistack";
import { FormWrapper } from "components/dyanmicForm/formWrapper";
import { AcctViewMetadata } from "./metaDataAcct";
import { AuthContext } from "pages_audit/auth";
import { useContext } from "react";

export const useGetDataMutation = () => {
  const getData = useMutation(API.getChequeBookEntryData, {
    onSuccess: (response: any) => {
      // Handle success
    },
    onError: (error: any) => {
      // Handle error
    },
  });

  return getData;
};

const ChequeBookEntry = () => {
  const navigate = useNavigate();
  const myGridRef = useRef<any>(null);
  const [secondButtonVisible, setSecondButtonVisible] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { authState } = useContext(AuthContext);

  const setCurrentAction = useCallback(
    (data) => {
      navigate(data?.name, {
        state: data?.rows,
      });
    },
    [navigate]
  );

  const getData = useGetDataMutation();
  // const getData = useMutation(API.getChequeBookEntryData, {
  //   onSuccess: (response: any) => {
  //     setSecondButtonVisible(true);
  //   },
  //   onError: (error: any) => {
  //     // setRetData({ REG_WITH: "A", REG_ACCT_CARD_NO: "" });
  //     setSecondButtonVisible(false);
  //   },
  // });

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

      getData.mutate({
        companyID: authState.companyID,
        branchCD: retdata?.BRANCH_CD,
        acctType: retdata?.ACCT_TYPE,
        accountNo: retdata?.ACCT_CD,
      });
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
        data={getData?.data ?? []}
        setData={() => null}
        loading={getData.isLoading}
        setAction={setCurrentAction}
        refetchData={() => {}}
        ref={myGridRef}
      />
      <FormWrapper
        key={"AccountView" + (data ?? []).length}
        metaData={AcctViewMetadata}
        loading={getData.isLoading}
        hideHeader={true}
        //  initialValues={rows?.[0]?.data as InitialValuesType}
        //  onSubmitHandler={onSubmitHandler}
        //@ts-ignore
        displayMode={"view"}
        formStyle={{
          background: "white",
          height: "20vh",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      ></FormWrapper>
      <FormWrapper
        key={"ChequeBookEntry" + (data ?? []).length}
        metaData={ChequeBookIssueEntry}
        loading={getData.isLoading}
        hideHeader={true}
        //  initialValues={rows?.[0]?.data as InitialValuesType}
        //  onSubmitHandler={onSubmitHandler}
        //@ts-ignore
        displayMode={"new"}
        formStyle={{
          background: "white",
          height: "20vh",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      ></FormWrapper>
    </Fragment>
  );
};
export const ChequeBookEntryForm = () => {
  return (
    <ClearCacheProvider>
      <ChequeBookEntry />
    </ClearCacheProvider>
  );
};
