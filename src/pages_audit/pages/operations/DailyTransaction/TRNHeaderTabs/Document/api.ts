import {
  AddIDinResponseData,
  DefaultErrorObject,
  utilFunction,
} from "@acuteinfo/common-base";
import { AuthSDK } from "registry/fns/auth";

export const getDocTemplateList = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDLYTRNDOCUMENTTAB", {
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
export const getDocView = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDOCUMENTIMG", {
      TRAN_CD: reqData?.TRAN_CD,
      SR_CD: reqData?.SR_CD,
      // TRAN_CD: "189081",
      // SR_CD: "1",
    });
  if (status === "0") {
    return data[0];
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
