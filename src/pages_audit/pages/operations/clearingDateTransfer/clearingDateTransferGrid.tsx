import {
  useRef,
  useCallback,
  useContext,
  Fragment,
  useState,
  useEffect,
} from "react";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { ActionTypes } from "components/dataTable";
import { useMutation } from "react-query";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import { SubmitFnType } from "packages/form";
import { format } from "date-fns";
import FormWrapper from "components/dyanmicForm";
import { ClearCacheProvider, queryClient } from "cache";
import {
  RetrieveFormConfigMetaData,
  clearingDateTransferGridMetaData,
  slipClearingDateTransferGridMetaData,
} from "./girdMetadata";
const actions: ActionTypes[] = [
  {
    actionName: "transfer",
    actionLabel: "Transfer",
    multiple: true,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
];

const ClearingDateTransferGrid = () => {
  const { authState } = useContext(AuthContext);
  const formRef = useRef<any>(null);
  const [isFlag, setIsFlag] = useState();

  const mutation: any = useMutation(
    "getRetrievalClearingData",
    API.getRetrievalClearingData,
    {
      onSuccess: (data) => { },
      onError: (error: any) => { },
    }
  );
  const slipMutation: any = useMutation(
    "slipGetRetrievalClearingData",
    API.slipGetRetrievalClearingData,
    {
      onSuccess: (data) => { },
      onError: (error: any) => { },
    }
  );
  const transferDateMutation: any = useMutation(
    "transferDateClearingData",
    API.transferDateClearingData,
    {
      onSuccess: (data) => { },
      onError: (error: any) => { },
    }
  );


  const setCurrentAction = useCallback((data) => {
    if (data?.name === "transfer") {
      console.log("data", data);
    }
  }, []);

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    delete data["RETRIEVE"];
    if (data?.FLAG === "S") {
      data = {
        CLEARING_DT: format(new Date(data["FR_TRAN_DT"]), "dd/MMM/yyyy"),
        ZONE: data["FR_ZONE"],
        COMP_CD: authState.companyID,
        BRANCH_CD: authState.user.branchCode,
        FLAG: data?.FLAG,
      };
      slipMutation.mutate(data);
      endSubmit(true);
    } else {
      data = {
        CLEARING_DT: format(new Date(data["FR_TRAN_DT"]), "dd/MMM/yyyy"),
        ZONE: data["FR_ZONE"],
        COMP_CD: authState.companyID,
        BRANCH_CD: authState.user.branchCode,
        FLAG: data?.FLAG,
      };
      mutation.mutate(data);
      endSubmit(true);
    }
  };
  if (clearingDateTransferGridMetaData) {
    if (isFlag === "B") {
      clearingDateTransferGridMetaData.gridConfig.allowRowSelection = true;
    } else {
      clearingDateTransferGridMetaData.gridConfig.allowRowSelection = false;
    }
  }

  return (
    <Fragment>
      <>
        <FormWrapper
          key={`retrieveForm`}
          metaData={RetrieveFormConfigMetaData}
          initialValues={{
            FR_TRAN_DT: authState?.workingDate,
            TO_TRAN_DT: authState?.workingDate,
          }}
          onSubmitHandler={onSubmitHandler}
          formStyle={{
            background: "white",
          }}
          onFormButtonClickHandel={(id) => {
            let event: any = { preventDefault: () => { } };
            // if (mutation?.isLoading) {
            if (id === "RETRIEVE") {
              formRef?.current?.handleSubmit(event, "RETRIEVE");
            }
          }}
          formState={{ ZONE_TRAN_TYPE: "S" }}
          setDataOnFieldChange={(action, payload) => {
            setIsFlag(payload);
          }}
          ref={formRef}
        />
        <Fragment>
          {mutation.isError && (
            <Alert
              severity="error"
              errorMsg={
                mutation.error?.error_msg ?? "Something went to wrong.."
              }
              errorDetail={mutation.error?.error_detail}
              color="error"
            />
          )}
          {/* {mutation?.data ? ( */}
          <GridWrapper
            key={"clearingDateTransferGrid" + isFlag}
            finalMetaData={
              isFlag === "S"
                ? slipClearingDateTransferGridMetaData
                : clearingDateTransferGridMetaData
            }
            data={
              isFlag === "S" ? slipMutation?.data ?? [] : mutation?.data ?? []
            }
            setData={() => null}
            loading={
              isFlag === "S"
                ? slipMutation?.isLoading || slipMutation?.isFetching
                : mutation.isLoading || mutation.isFetching
            }
            actions={actions}
            setAction={setCurrentAction}
          />
        </Fragment>
      </>
    </Fragment>
  );
};
export const ClearingDateTransferGridWrapper = () => {
  return (
    <ClearCacheProvider>
      <ClearingDateTransferGrid />
    </ClearCacheProvider>
  );
};
