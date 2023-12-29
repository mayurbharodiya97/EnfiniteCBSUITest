import { Fragment, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { JointDetailIssueEntry } from "./metaData";
import { SearchGridMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { GridMetaDataType } from "components/dataTable/types";
import { ClearCacheProvider, queryClient } from "cache";
import * as API from "./api";
import { FormWrapper } from "components/dyanmicForm/formWrapper";
import { AuthContext } from "pages_audit/auth";
import { useContext } from "react";
import { InitialValuesType, SubmitFnType } from "packages/form";

export const Search = () => {
  const { authState } = useContext(AuthContext);

  const { tempStore, setTempStore } = useContext(AuthContext);
  const [rows, setRows] = useState([]);
  console.log(tempStore, "temppp");

  const getSearchList = useMutation(API.getSearchList, {
    onSuccess: (data) => {
      console.log(data, " getSearchList detailssss");
      setRows(data);
    },
    onError: (error) => {},
  });

  useEffect(() => {
    tempStore?.accInfo?.ACCT_CD && getSearchList.mutate(tempStore.accInfo);
  }, [tempStore]);

  const myGridRef = useRef<any>(null);
  const isErrorFuncRef = useRef<any>(null);

  const getData = useMutation(API.getChequeBookEntryData, {
    onSuccess: (response: any) => {
      // Handle success
    },
    onError: (error: any) => {
      // Handle error
    },
  });

  const getData8888 = useMutation(API.getChequeLeavesList88888, {
    onSuccess: (response: any) => {
      // Handle success
    },
    onError: (error: any) => {
      // Handle error
    },
  });
  const ClickEventManage = () => {
    let event: any = { preventDefault: () => {} };
    isErrorFuncRef?.current?.handleSubmit(event, "BUTTON_CLICK");
  };

  const onSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError
  ) => {
    //@ts-ignore
    endSubmit(true, "Please enter any value");
    if (Boolean(data?.NO_OF_CHEQUE)) {
      getData8888.mutate({ NO_OF_CHEQUE: data?.NO_OF_CHEQUE });
    }
    getData.mutate({
      companyID: authState.companyID,
      branchCD: data?.BRANCH_CD,
      acctType: data?.ACCT_TYPE,
      accountNo: data?.ACCT_CD.padEnd(20, " "),
    });
  };
  let dat1 = getData8888?.data?.[0];
  let dat2 = getData?.data?.[0];
  let Newdata = getData8888.isSuccess ? { ...dat2, ...dat1 } : dat2;
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
        <GridWrapper
          key={`SearchGridMetaData`}
          finalMetaData={SearchGridMetaData as GridMetaDataType}
          data={rows}
          setData={() => null}
          loading={getData.isLoading}
          // setAction={setCurrentAction}
          refetchData={() => {}}
          ref={myGridRef}
        />
      </div>
    </Fragment>
  );
};
