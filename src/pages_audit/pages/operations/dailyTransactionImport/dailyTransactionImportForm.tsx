import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { usePopupContext } from "components/custom/popupContext";
import { Route, Routes, useNavigate } from "react-router-dom";
import { GridMetaDataType } from "components/dataTableStatic";
import {
  DailyTransactionImportGridMetaData,
  DailyTransactionImportMetadata,
} from "./dailyTransactionImportMetadata";
import { ActionTypes } from "components/dataTable";
import { Alert } from "components/common/alert";
import { AuthContext } from "pages_audit/auth";
import { ClearCacheProvider, queryClient } from "cache";
import * as API from "./api";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import { useMutation } from "react-query";
import { enqueueSnackbar } from "notistack";
import { SubmitFnType } from "packages/form";

const actions: ActionTypes[] = [
  {
    actionName: "errors",
    actionLabel: t("Errors"),
    multiple: false,
    alwaysAvailable: true,
    // rowDoubleClick: true,
  },
];
const DailyTransactionImport = () => {
  const { authState } = useContext(AuthContext);
  const formRef = useRef<any>(null);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const setCurrentAction = useCallback(
    async (data) => {
      if (data?.name === "errors") {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );

  const getValidateToSelectFile: any = useMutation(
    API.getValidateToSelectFile,
    {
      onError: (error: any) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
      },
      onSuccess: async (data, variables) => {},
    }
  );
  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    let newData = data;
    if (actionFlag === "SELECT") {
      getValidateToSelectFile.mutate({
        A_BRANCH_CD: data?.BRANCH_CD,
        A_ACCT_TYPE: data?.ACCT_TYPE,
        A_ACCT_CD: data?.ACCT_CD,
        A_CHEQUE_NO: data?.CHEQUE_NO,
        A_TYPE_CD: data?.TYPE_CD,
        // A_TRAN_CD :data ?.A_TRAN_CD ,
        // A_TABLE_NM :data ?.A_TABLE_NM ,
        A_SCREEN_REF: "MST/454",
        A_LOG_COMP: authState?.companyID,
        A_LOG_BRANCH: authState?.user?.branchCode,
      });
    }
    endSubmit(true);
  };

  return (
    <>
      <FormWrapper
        key={"DailyTransactionImportForm"}
        metaData={DailyTransactionImportMetadata}
        initialValues={{}}
        onSubmitHandler={onSubmitHandler}
        formStyle={{
          height: "auto",
        }}
        formState={{
          MessageBox: MessageBox,
        }}
        ref={formRef}
        onFormButtonClickHandel={() => {
          let event: any = { preventDefault: () => {} };
          formRef?.current?.handleSubmit(event, "SELECT");
        }}
      ></FormWrapper>

      <>
        <GridWrapper
          key={`DailyTransactionImportGrid`}
          finalMetaData={DailyTransactionImportGridMetaData as GridMetaDataType}
          data={[]}
          setData={() => {}}
          // loading={getInsuranceDetailData.isLoading}
          actions={actions}
          setAction={setCurrentAction}
        />
      </>
    </>
  );
};

export const DailyTransactionImportForm = () => {
  return (
    <ClearCacheProvider>
      <DailyTransactionImport />
    </ClearCacheProvider>
  );
};
