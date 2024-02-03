import {
  AddIDinResponseData,
  DefaultErrorObject,
  utilFunction,
} from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getPMBYList = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDLYTRNPMBYTAB", {
      BRANCH_CD: reqData.BRANCH_CD,
      A_BRANCH_CD: reqData.BRANCH_CD,
      COMP_CD: reqData.COMP_CD,
      A_COMP_CD: reqData.COMP_CD,
      ACCT_TYPE: reqData.ACCT_TYPE,
      ACCT_CD: reqData.ACCT_CD,
    });
  if (status === "0") {
    let responseData = data;
    responseData.map((a, i) => {
      a.index = i;
      a.sr = i + 1;
    });
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
