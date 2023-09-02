import {
  Fragment,
  useRef,
  useCallback,
  useState,
  useMemo,
  useEffect,
} from "react";
import { useMutation } from "react-query";
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
import { AuthContext } from "pages_audit/auth";
import { useContext } from "react";
import { SubmitFnType } from "packages/form";

const ChequeBookEntry = () => {
  const myGridRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const isErrorFuncRef = useRef<any>(null);

  const getData = useMutation(API.getChequeBookEntryData, {
    onSuccess: (response: any) => {
      // Handle success
    },
    onError: (error: any) => {
      // Handle error
    },
  });

  const onSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError
  ) => {
    //@ts-ignore
    endSubmit(true, "Please enter any value");

    getData.mutate({
      companyID: authState.companyID,
      branchCD: data?.BRANCH_CD,
      acctType: data?.ACCT_TYPE,
      accountNo: data?.ACCT_CD,
    });
  };

  const ClickEventManage = () => {
    let event: any = { preventDefault: () => {} };
    isErrorFuncRef?.current?.handleSubmit(event, "BUTTON_CLICK");
  };

  return (
    <Fragment>
      <div
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            ClickEventManage();
          }
        }}
      >
        {getData.isError && (
          <Alert
            severity={getData.error?.severity ?? "error"}
            errorMsg={getData.error?.error_msg ?? "Something went to wrong.."}
            errorDetail={getData.error?.error_detail}
            color="error"
          />
        )}
        {/* {saveData.isError && (
          <Alert
            severity={saveData.error?.severity ?? "error"}
            errorMsg={saveData.error?.error_msg ?? "Something went to wrong.."}
            errorDetail={saveData.error?.error_detail}
            color="error"
          />
        )} */}
        <GridWrapper
          key={`ChequeBookEntryGrid`}
          finalMetaData={ChequebookentryGridMetaData as GridMetaDataType}
          data={getData?.data ?? []}
          setData={() => null}
          loading={getData.isLoading}
          // setAction={setCurrentAction}
          refetchData={() => {}}
          ref={myGridRef}
        />
        <FormWrapper
          key={"ChequeBookEntry"}
          metaData={ChequeBookIssueEntry}
          loading={getData.isLoading}
          hideHeader={true}
          //  initialValues={rows?.[0]?.data as InitialValuesType}
          ref={isErrorFuncRef}
          onSubmitHandler={onSubmitHandler}
          //@ts-ignore
          displayMode={"new"}
          formStyle={{
            background: "white",
            height: "40vh",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        ></FormWrapper>
      </div>
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
