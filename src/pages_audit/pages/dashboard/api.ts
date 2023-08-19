import { DefaultErrorObject } from "components/utils";
import { format } from "date-fns";
import { AuthSDK } from "registry/fns/auth";

export const getDashboardData = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDASHBOARDDATA", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const QuickAccessTableGridData = async ({
  COMP_CD,
  BASE_BRANCH_CD,
  GROUP_NAME,
  APP_TRAN_CD,
  FLAG,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETQUICKACCESS", {
      COMP_CD: COMP_CD,
      BASE_BRANCH_CD: BASE_BRANCH_CD,
      ASON_DT: format(new Date(), "dd/MMM/yyyy"),
      GROUP_NAME: GROUP_NAME,
      FLAG: FLAG.toUpperCase(),
      APP_TRAN_CD: APP_TRAN_CD,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const TodaysTransactionTableGrid = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETTRANSACTIONDETAILS", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }

  // return [
  //   {
  //     CREDIT: "",
  //     COMP_CD: "132 ",
  //     TRAN_CD: "199474",
  //     SCROLL1: "182101",
  //     TABLE_FLAG: "DAILY_TRN",
  //     PAID: "N",
  //     REMARKS: "TO TRF-",
  //     ACCT_CD: "000009              ",
  //     CHEQUE_NO: "0",
  //     ACCT_TYPE: "0002",
  //     DEBIT: "1000",
  //     SDC: "6",
  //     TYPE_CD: "6",
  //     TRAN_DT: "2023-08-18 00:00:00.0",
  //     AMOUNT: "1000",
  //     CONFIRMED: "Confirmed",
  //     ENTERED_BRANCH_CD: "099 ",
  //     BRANCH_CD: "099 ",
  //     ENTERED_COMP_CD: "132 ",
  //     ENTERED_DATE: "2023-08-18 10:54:56.0",
  //     CONFIRM: "Y",
  //     MAKER: "adi",
  //     CHECKER: "adi",
  //     // CREDIT_CURR_CD: "BDT",
  //     // DEBIT_CURR_CD: "USD",
  //   },
  //   {
  //     CREDIT: "1000",
  //     COMP_CD: "132 ",
  //     TRAN_CD: "199475",
  //     SCROLL1: "182101",
  //     TABLE_FLAG: "DAILY_TRN",
  //     PAID: "N",
  //     REMARKS: "ABC",
  //     ACCT_CD: "000099              ",
  //     CHEQUE_NO: "",
  //     ACCT_TYPE: "0002",
  //     DEBIT: "",
  //     SDC: "3",
  //     TYPE_CD: "3",
  //     TRAN_DT: "2023-08-18 00:00:00.0",
  //     AMOUNT: "1000",
  //     CONFIRMED: "Confirmed",
  //     ENTERED_BRANCH_CD: "099 ",
  //     BRANCH_CD: "099 ",
  //     ENTERED_COMP_CD: "132 ",
  //     ENTERED_DATE: "2023-08-18 10:54:56.0",
  //     CONFIRM: "Y",
  //     MAKER: "adi",
  //     CHECKER: "adi",
  //     // CREDIT_CURR_CD: "BDT",
  //     // DEBIT_CURR_CD: "USD",
  //   },
  // ];
};
