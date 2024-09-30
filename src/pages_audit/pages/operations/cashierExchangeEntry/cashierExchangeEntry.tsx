import { Fragment, useContext, useRef, useState } from "react";
import { cashierEntryFormMetaData } from "./cashierEntryMetadata";
import {
  usePopupContext,
  GradientButton,
  MetaDataType,
  FormWrapper,
  Alert,
} from "@acuteinfo/common-base";
import { useMutation } from "react-query";
import { AuthContext } from "pages_audit/auth";
import * as API from "./api";
import { AppBar, LinearProgress } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { format, parse } from "date-fns";
import CashierExchangeTable from "./tableComponent/tableComponent";
import { CashierMetaData } from "./CashierTableMetadata";
const CashierExchangeEntry = () => {
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const submitEventRef = useRef(null);
  const FormRef = useRef<any>(null);
  const TableRef = useRef<any>([]);
  const { authState } = useContext(AuthContext);
  const [tableData, setTableData] = useState([]);
  const getData = useMutation(API.getCashDeno, {
    onSuccess: (data) => {
      setTableData(data);
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
    },
  });
  const insertCashierEntry = useMutation(API.insertCashierEntry, {
    onError: async (error: any) => {
      let errorMsg = "Unknown Error occurred";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
    },
    onSuccess: async (data) => {
      setTableData([]);
      CloseMessageBox();
      enqueueSnackbar(data?.[0]?.O_MESSAGE, {
        variant: "success",
      });
    },
  });
  const handleSaves = async (e) => {
    submitEventRef.current = e;
    const FormRefData = await FormRef?.current?.getFieldData();
    const TableData = TableRef?.current?.saveData();
    const TableDataMap = TableData?.tableData?.map((row) => ({
      DENO_TRAN_CD: row?.TRAN_CD,
      DENO_QTY: row?.DENO_QTY,
      DENO_AMOUNT: row?.DENO_AMOUNT,
    }));
    const Request = {
      DENO_DTL: [...TableDataMap],
      TOTAL_TO_AMT: TableData?.tablefooter?.DENO_AMOUNT?.toString(),
      ENTERED_COMP_CD: authState?.companyID,
      ENTERED_BRANCH_CD: authState?.user?.branchCode,
      TO_USER: FormRefData?.To,
      FROM_USER: FormRefData?.From_User,
      SCREEN_REF: "TRN/044",
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
      {getData?.isError ? (
        <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
          <AppBar position="relative" color="primary">
            <Alert
              severity="error"
              errorMsg={getData?.error?.error_msg ?? "Unknow Error"}
              errorDetail={getData?.error?.error_detail ?? ""}
              color="error"
            />
          </AppBar>
        </div>
      ) : null}
      <FormWrapper
        key={"CashierExchangeEntryForm"}
        metaData={cashierEntryFormMetaData as MetaDataType}
        ref={FormRef}
        formStyle={{
          height: "auto",
        }}
        formState={{
          MessageBox: MessageBox,
        }}
        setDataOnFieldChange={async (action, payload) => {
          if (action === "FROM_USER" && payload?.value?.length > 0) {
            const formattedDate = format(
              parse(authState?.workingDate, "dd/MMM/yyyy", new Date()),
              "dd/MMM/yyyy"
            ).toUpperCase();
            getData.mutate({
              BRANCH_CD: authState?.user?.branchCode,
              COMP_CD: authState?.companyID,
              TRAN_DT: formattedDate,
              USER_NAME: payload?.value,
            });
          }
        }}
        initialValues={{}}
        onSubmitHandler={() => {}}
      >
        <GradientButton onClick={handleSaves}>Save</GradientButton>
      </FormWrapper>
      {getData?.isLoading && <LinearProgress color="secondary" />}
      {tableData.length > 0 && (
        <CashierExchangeTable
          data={tableData ?? []}
          metadata={CashierMetaData}
          TableLabel={"Cashier Exchange Table"}
          hideHeader={true}
          showFooter={true}
          tableState={{ MessageBox, auth: authState }}
          ref={TableRef}
        />
      )}
    </Fragment>
  );
};
export default CashierExchangeEntry;
