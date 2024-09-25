import {
  AddIDinResponseData,
  DefaultErrorObject,
  utilFunction,
} from "@acuteinfo/common-base";
import { AuthSDK } from "registry/fns/auth";

export const getLimitList = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDLYTRNLIMITTAB", {
      COMP_CD: reqData.COMP_CD,
      BRANCH_CD: reqData.BRANCH_CD,
      ACCT_TYPE: reqData.ACCT_TYPE,
      ACCT_CD: reqData.ACCT_CD,
    });
  if (status === "0") {
    let responseData = data;
    responseData.map((a, i) => {
      a.index = i;
      a.sr = i + 1;
      a.INT_RATE = a.INT_RATE ? parseFloat(a.INT_RATE).toFixed(2) : "0.00";
      a.MARGIN = a.MARGIN ? parseFloat(a.MARGIN).toFixed(2) : "0.00";
      a.PENAL_RATE = a.PENAL_RATE
        ? parseFloat(a.PENAL_RATE).toFixed(2)
        : "0.00";
    });
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
