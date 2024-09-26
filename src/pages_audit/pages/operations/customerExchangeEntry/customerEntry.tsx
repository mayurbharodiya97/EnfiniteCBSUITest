import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import {
  CustomerEntryTableMetdata,
  CustomerFormMetadata,
} from "./customerEntryMetadata";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "pages_audit/auth";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import { GradientButton } from "components/styledComponent/button";
import CashierExchangeTable from "../cashierExchangeEntry/tableComponent/tableComponent";
import { AppBar, LinearProgress } from "@mui/material";
import { usePopupContext } from "components/custom/popupContext";
import { enqueueSnackbar } from "notistack";
import { Alert } from "components/common/alert";
const CustomerEntry = () => {
  const { authState } = useContext(AuthContext);
  const TableRef = useRef<any>([]);
  const submitEventRef = useRef(null);
  const FormRef = useRef<any>(null);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const [footerTotals, setFooterTotals] = useState<any>({});
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const {
    data: MainData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery<any, any>(["getCashDeno"], () =>
    API.getCashDeno({
      BRANCH_CD: authState?.user?.branchCode,
      COMP_CD: authState?.companyID,
      TRAN_DT: authState?.workingDate,
      USER_NAME: authState?.user?.id,
    })
  );
  const insertCashierEntry = useMutation(API.customerInsert, {
    onError: async (error: any) => {
      let errorMsg = "Unknown Error occurred";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
      CloseMessageBox();
    },
    onSuccess: async (data) => {
      CloseMessageBox();
      enqueueSnackbar(data, {
        variant: "success",
      });
    },
  });
  const updateFooterTotals = async (totals) => {
    setFooterTotals(totals);
    setIsButtonEnabled(totals.DENO_AMOUNT === 0);
  };
  const handleSaves = async (e) => {
    submitEventRef.current = e;
    const FormRefData = await FormRef?.current?.getFieldData();
    const TableData = TableRef?.current?.saveData();
    if (
      !TableData ||
      !TableData.tableData ||
      TableData.tableData.length === 0
    ) {
      await MessageBox({
        message:
          "Please enter data in the Cashier Exchange Table before saving.",
        messageTitle: "Data Required",
        buttonNames: ["Ok"],
      });
      return;
    }
    const TableDataMap = TableData?.tableData?.map((row) => ({
      DENO_TRAN_CD: row?.TRAN_CD,
      DENO_QTY: row?.DENO_QTY,
      DENO_VAL: row?.DENO_VAL,
    }));
    const Request = {
      ENTERED_COMP_CD: authState?.companyID,
      ENTERED_BRANCH_CD: authState?.user?.branchCode,
      REMARKS: FormRefData?.REMARKS,
      DENO_DTL: [...TableDataMap],
      SCREEN_REF: "TRN/043",
    };
    const Check = await MessageBox({
      message: "SaveData",
      messageTitle: "Confirmation",
      buttonNames: ["Yes", "No"],
      loadingBtnName: ["Yes"],
    });
    if (Check === "Yes") {
      insertCashierEntry.mutate(Request);
    }
  };
  return (
    <Fragment>
      {isError ? (
        <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
          <AppBar position="relative" color="primary">
            <Alert
              severity="error"
              errorMsg={error?.error_msg ?? "Unknow Error"}
              errorDetail={error?.error_detail ?? ""}
              color="error"
            />
          </AppBar>
        </div>
      ) : null}
      <FormWrapper
        key={"CustomerEntryForm"}
        metaData={CustomerFormMetadata as MetaDataType}
        ref={FormRef}
        formStyle={{
          height: "auto",
        }}
        initialValues={{}}
      >
        {isButtonEnabled ? (
          <GradientButton onClick={handleSaves}>Save</GradientButton>
        ) : null}
      </FormWrapper>
      {isLoading && <LinearProgress color="secondary" />}
      {MainData?.length > 0 && (
        <CashierExchangeTable
          data={MainData ?? []}
          metadata={CustomerEntryTableMetdata}
          TableLabel={"Cashier Exchange Table"}
          hideHeader={true}
          ignoreMinusValue={false}
          showFooter={true}
          ref={TableRef}
          tableState={{ MessageBox }}
          onFooterUpdate={updateFooterTotals}
        />
      )}
    </Fragment>
  );
};
export default CustomerEntry;
