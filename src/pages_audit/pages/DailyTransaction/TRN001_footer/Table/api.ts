import {
  AddIDinResponseData,
  DefaultErrorObject,
  utilFunction,
} from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getTRN001List = async (reqData) => {
  //for table
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDAILYTRNLIST", {
      COMP_CD: reqData?.COMP_CD,
      BRANCH_CD: reqData?.BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    responseData.map((a, i) => {
      a.index = i;
      a.account1 = a.ACCT_TYPE + a.TYPE_NM;
      a.trx1 = a.TYPE_CD + a.TYPE_CD_DESC;
      a.sdc1 = a.SDC + a.SDC_DESC;
      a.date1 = a.TRAN_DT?.substring(0, 10);
      if (
        a.TYPE_CD.includes("1") ||
        a.TYPE_CD.includes("2") ||
        a.TYPE_CD.includes("3")
      ) {
        a.credit1 = Number(a.AMOUNT).toFixed(2);
        a.debit1 = "0.00";
      }
      if (
        a.TYPE_CD.includes("4") ||
        a.TYPE_CD.includes("5") ||
        a.TYPE_CD.includes("6")
      ) {
        a.debit1 = Number(a.AMOUNT).toFixed(2);
        a.credit1 = "0.00";
      }
    });
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
