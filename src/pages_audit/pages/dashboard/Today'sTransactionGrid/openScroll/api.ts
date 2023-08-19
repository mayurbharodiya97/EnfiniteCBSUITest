import { format } from "date-fns";
import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";

export const ScrollDetailData = async (
  reportID,
  filter,
  otherAPIRequestPara
) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETTRANSCROLLDETAIL", otherAPIRequestPara);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
  // return [
  //   {
  //     CREDIT: "6100",
  //     COMP_CD: "473 ",
  //     TRAN_CD: "1463",
  //     SCROLL1: "",
  //     TABLE_FLAG: "DAILY_TRN",
  //     PAID: "N",
  //     REMARKS: "BY CASH -",
  //     PENDING: "0",
  //     ACCT_CD: "00016989            ",
  //     CHEQUE_NO: "",
  //     ACCT_TYPE: "1001",
  //     DEBIT: "",
  //     SDC: "1   ",
  //     TYPE_CD: "1   ",
  //     TRAN_DT: "2023-02-08 00:00:00.0",
  //     AMOUNT: "6100",
  //     CONFIRMED: "Y",
  //     ENTERED_BRANCH_CD: "0003",
  //     BRANCH_CD: "0002",
  //     ENTERED_COMP_CD: "473 ",
  //     ENTERED_DATE: "2023-02-08 12:09:35.0",
  //     MAKER: "bhaveshp",
  //     CHECKER: "",
  //     // DEBIT_CURR_CD: "BDT",
  //     // CREDIT_CURR_CD: "BDT",
  //   },
  //   {
  //     CREDIT: "",
  //     COMP_CD: "473 ",
  //     TRAN_CD: "2163",
  //     SCROLL1: "0",
  //     TABLE_FLAG: "DAILY_TRN",
  //     PAID: "N",
  //     REMARKS: "TO CASH -",
  //     PENDING: "0",
  //     ACCT_CD: "00003068            ",
  //     CHEQUE_NO: "625436",
  //     ACCT_TYPE: "1507",
  //     DEBIT: "50000",
  //     SDC: "4   ",
  //     TYPE_CD: "4   ",
  //     TRAN_DT: "2023-02-08 00:00:00.0",
  //     AMOUNT: "50000",
  //     CONFIRMED: "Y",
  //     ENTERED_BRANCH_CD: "0003",
  //     BRANCH_CD: "0003",
  //     ENTERED_COMP_CD: "473 ",
  //     ENTERED_DATE: "2023-02-08 14:28:28.0",
  //     MAKER: "bhaveshp",
  //     CHECKER: "",
  //     // DEBIT_CURR_CD: "INR",
  //     // CREDIT_CURR_CD: "BDT",
  //   },
  //   {
  //     CREDIT: "5500",
  //     COMP_CD: "473 ",
  //     TRAN_CD: "2207",
  //     SCROLL1: "",
  //     TABLE_FLAG: "DAILY_TRN",
  //     PAID: "N",
  //     REMARKS: "BY CASH -",
  //     PENDING: "0",
  //     ACCT_CD: "00008789            ",
  //     CHEQUE_NO: "",
  //     ACCT_TYPE: "1001",
  //     DEBIT: "",
  //     SDC: "1   ",
  //     TYPE_CD: "1   ",
  //     TRAN_DT: "2023-02-08 00:00:00.0",
  //     AMOUNT: "5500",
  //     CONFIRMED: "Y",
  //     ENTERED_BRANCH_CD: "0003",
  //     BRANCH_CD: "0003",
  //     ENTERED_COMP_CD: "473 ",
  //     ENTERED_DATE: "2023-02-08 14:38:33.0",
  //     MAKER: "bhaveshp",
  //     CHECKER: "",
  //     // DEBIT_CURR_CD: "USD",
  //     // CREDIT_CURR_CD: "USD",
  //   },
  // ];
};
