import {
  AddIDinResponseData,
  DefaultErrorObject,
  utilFunction,
} from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getCheckDetailsList = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDLYTRNCHEQUETAB", {
      COMP_CD: reqData?.COMP_CD,
      ACCT_TYPE: reqData?.ACCT_TYPE,
      ACCT_CD: reqData?.ACCT_CD,
      BRANCH_CD: reqData?.BRANCH_CD,
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

export const getTodayClearing = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDLYTRNTODAYCLEARBTN", {
      COMP_CD: reqData?.COMP_CD,
      ACCT_TYPE: reqData?.ACCT_TYPE,
      ACCT_CD: reqData?.ACCT_CD,
      BRANCH_CD: reqData?.BRANCH_CD,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getReturnHistory = async (reqData) => {
  console.log(reqData, "reqData");
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDLYTRNCHQRTNBTN", {
      COMP_CD: reqData?.COMP_CD,
      ACCT_TYPE: reqData?.ACCT_TYPE,
      ACCT_CD: reqData?.ACCT_CD,
      BRANCH_CD: reqData?.BRANCH_CD,

      FROM_ACCT_CD: reqData?.ACCT_CD,
      TO_ACCT_CD: reqData?.ACCT_CD,
      FROM_DATE: reqData?.authState?.workingDate,
      TO_DATE: reqData?.authState?.workingDate,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
