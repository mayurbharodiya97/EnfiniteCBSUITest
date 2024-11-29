import { DefaultErrorObject } from "@acuteinfo/common-base";
import { AuthSDK } from "registry/fns/auth";

export const getSIDetailList = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDLYTRNSIDTLTAB", {
      BRANCH_CD: reqData?.BRANCH_CD ?? "",
      COMP_CD: reqData?.COMP_CD ?? "",
      ACCT_TYPE: reqData?.ACCT_TYPE ?? "",
      ACCT_CD: reqData?.ACCT_CD ?? "",
    });
  if (status === "0") {
    let responseData = data;
    responseData.map((item, index) => {
      item.index = index;
      item.sr = index + 1;
      item.FEQ_TYPE =
        item.FEQ_TYPE === "M"
          ? "Month (s)"
          : item.FEQ_TYPE === "Y"
          ? "Year (s)"
          : item.FEQ_TYPE === "Q"
          ? "Quartely"
          : item.FEQ_TYPE === "D"
          ? "Day (s)"
          : item.FEQ_TYPE === "H"
          ? "Half Yearly"
          : "";
      item.DEBIT_ACCOUNT = `${item?.BRANCH_CD?.trim()}${item?.DR_ACCT_TYPE?.trim()}${item?.DR_ACCT_CD?.trim()}`;
      item.CREDIT_ACCOUNT = `${item?.CR_BRANCH_CD?.trim()}${item?.CR_ACCT_TYPE?.trim()}${item?.CR_ACCT_CD?.trim()}`;
    });
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
