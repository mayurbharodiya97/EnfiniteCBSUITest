import {
  AddIDinResponseData,
  DefaultErrorObject,
  utilFunction,
} from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getInstructionList = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDLYTRNSPINSTRUCTTAB", {
      BRANCH_CD: reqData.BRANCH_CD,
      COMP_CD: reqData.COMP_CD,
      ACCT_TYPE: reqData.ACCT_TYPE,
      ACCT_CD: reqData.ACCT_CD,

      OTH_COMP_CD: reqData.COMP_CD,
      OTH_BRANCH_CD: reqData.BRANCH_CD,
      OTH_ACCT_TYPE: reqData.ACCT_TYPE,
      OTH_ACCT_CD: reqData.ACCT_CD,
    });
  if (status === "0") {
    let responseData = data;
    responseData.map((a, i) => {
      a.index = i;
      a.sr = i + 1;
      if (a?.TYPE_CD == "1" || a?.TYPE_CD == "2" || a?.TYPE_CD == "3") {
        a.type1 = "credit";
      } else {
        a.type1 = "debit";
      }
    });
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
