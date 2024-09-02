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
import { DailyTransactionImportGridMetaData, DailyTransactionImportMetadata } from "./dailyTransactionImportMetadata";
import { ActionTypes } from "components/dataTable";
import { Alert } from "components/common/alert";
import { AuthContext } from "pages_audit/auth";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "react-query";
import { ClearCacheProvider, queryClient } from "cache";
import * as API from "./api";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

const actions: ActionTypes[] = [
  {
    actionName: "errors",
    actionLabel: t("Errors"),
    multiple: false,
    alwaysAvailable: true
    // rowDoubleClick: true,
  },
];
const DailyTransactionImport = () => {
  const { authState } = useContext(AuthContext);

  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { t } = useTranslation();
  const myMasterRef = useRef<any>(null);
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


  const onSubmitHandler = ({
    data,
    resultValueObj,
    resultDisplayValueObj,
    endSubmit,
  }) => {
    let newData = data

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
        onFormButtonClickHandel={() => {
          let event: any = { preventDefault: () => { } };
          // formRef?.current?.handleSubmit(event, "POPULATE");
          console.log("formRef?.current", event);
        }}
      >
      </FormWrapper >

      <>
        <GridWrapper
          key={`DailyTransactionImportGrid`}
          finalMetaData={DailyTransactionImportGridMetaData as GridMetaDataType}
          data={[]}
          setData={() => { }}
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
