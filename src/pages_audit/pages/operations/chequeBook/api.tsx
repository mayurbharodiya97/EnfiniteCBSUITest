import {
  AddIDinResponseData,
  DefaultErrorObject,
  utilFunction,
} from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getChequeBookEntryData = async ({
  branchCD,
  acctType,
  accountNo,
}) => {
  // if (!Boolean(regWith)) {
  //   throw DefaultErrorObject(
  //     "Required value missing for Activation Using.",
  //     "",
  //     "warning"
  //   );
  // } else if (!Boolean(accountCardNo)) {
  //   throw DefaultErrorObject(
  //     "Required value missing for Account/Card Number.",
  //     "",
  //     "warning"
  //   );
  // } else {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCHEQUEBOOK", {
      // ACCT_NO: accountCardNo,
      // REG_WITH: regWith,
      COMP_CD: "473 ",
      BRANCH_CD: branchCD,
      ACCT_TYPE: acctType,
      ACCT_CD: accountNo,
    });
  if (status === "0") {
    let responsedata = data;
    // if (Array.isArray(responsedata)) {
    //   let allKeyData = responsedata?.[0]?.ALL_ACCOUNT_DETAIL;
    //   if (Array.isArray(allKeyData)) {
    //     allKeyData = AddIDinResponseData(allKeyData);
    //     let repdat = { gender: { F: "Female", M: "Male" } };
    //     allKeyData = utilFunction.ChangeJsonValue(allKeyData, repdat);
    //     responsedata[0]["ALL_ACCOUNT_DETAIL"] = allKeyData;
    //   }
    // }
    return responsedata;
    //return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
  // }
};

export const getCustomerCardDetailThroughCB = async ({ clientID }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETUSERDTL360", {
      CUSTOMER_DTL_LIST: { CBNUMBER: clientID, APP_INDICATOR: "TRANZWARE" },
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const saveCustomerRegisterRequest = async ({ inputData }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("INSCUSTREGREQ", {
      INPUT_DATA: inputData,
    });
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
