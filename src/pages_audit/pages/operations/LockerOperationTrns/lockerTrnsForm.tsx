import {
  ClearCacheProvider,
  extractMetaData,
  FormWrapper,
  MetaDataType,
  SubmitFnType,
  usePopupContext,
  utilFunction,
} from "@acuteinfo/common-base";
import { Fragment } from "react/jsx-runtime";
import { useContext, useEffect, useState } from "react";
import { lockerTrnsViewFormMetadata } from "./formMetaData";
import { AuthContext } from "pages_audit/auth";
import { useMutation } from "react-query";
import { getLockerViewMst } from "./api";
import { t } from "i18next";
import { dataContext } from "./lockerOperationTrns";

const LockerTrnsForm = () => {
  const [formMode, setFormMode] = useState("add");
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { payload } = useContext(dataContext);
  const [callCount, setCallCount] = useState(0);

  const viewMasterMutation = useMutation(getLockerViewMst, {
    onError: async (error: any) => {
      let errorMsg = t("Unknownerroroccured");
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      const btnName = await MessageBox({
        message: errorMsg,
        messageTitle: "Error",
        icon: "ERROR",
        buttonNames: ["Ok"],
      });
    },
    onSuccess: (data) => {
      console.log(data, "Master View Data");
    },
  });

  useEffect(() => {
    if (payload?.ACCT_CD && payload?.ACCT_CD !== "") {
      setCallCount((prev) => prev + 1);
      viewMasterMutation.mutate({
        COMP_CD: authState?.companyID,
        BRANCH_CD: authState?.user?.branchCode,
        ACCT_CD: payload?.ACCT_CD,
        ACCT_TYPE: payload?.ACCT_TYPE,
        WORKING_DATE: authState?.workingDate,
      });
    }
  }, [payload?.ACCT_CD]);

  console.log(callCount, "counter");

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData: any,
    endSubmit,
    setFieldError
  ) => {
    endSubmit(true);
  };

  return (
    <Fragment>
      <FormWrapper
        key={"lockerTrnsViewForm" + viewMasterMutation.data}
        metaData={
          extractMetaData(lockerTrnsViewFormMetadata, formMode) as MetaDataType
        }
        initialValues={
          viewMasterMutation.data ? viewMasterMutation.data[0] : {}
        }
        hideHeader={true}
        displayMode={formMode}
        onSubmitHandler={onSubmitHandler}
        formStyle={{
          background: "white",
        }}
      ></FormWrapper>
    </Fragment>
  );
};
export const LockerTrnsFormView = () => {
  return (
    <Fragment>
      <ClearCacheProvider>
        <LockerTrnsForm />
      </ClearCacheProvider>
    </Fragment>
  );
};
