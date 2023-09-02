import {
  AddIDinResponseData,
  DefaultErrorObject,
  utilFunction,
} from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getChequeBookEntryData = async ({
  companyID,
  branchCD,
  acctType,
  accountNo,
}) => {
  if (!Boolean(branchCD)) {
    throw DefaultErrorObject(
      "Required value missing for Branch.",
      "",
      "warning"
    );
  } else if (!Boolean(acctType)) {
    throw DefaultErrorObject(
      "Required value missing for Account Type.",
      "",
      "warning"
    );
  } else if (!Boolean(accountNo)) {
    throw DefaultErrorObject(
      "Required value missing for Account Number.",
      "",
      "warning"
    );
  } else {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETCHEQUEBOOK", {
        COMP_CD: companyID,
        BRANCH_CD: branchCD,
        ACCT_TYPE: acctType,
        ACCT_CD: accountNo,
      });

    if (status === "0") {
      let responsedata = data;
      return responsedata;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  }
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
