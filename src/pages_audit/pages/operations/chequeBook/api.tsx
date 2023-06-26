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
  callfrom,
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
    if (callfrom === "C") {
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
    } else {
      const { data, status, message, messageDetails } =
        await AuthSDK.internalFetcher("GETACCTVIEWMKR", {
          COMP_CD: companyID,
          BRANCH_CD: branchCD,
          ACCT_TYPE: acctType,
          ACCT_CD: accountNo,
        });
      /*if (status === "0") {
        console.log(">>data", data);
        return {
          CUST_NAME: { value: data?.[0]?.CUST_NAME },
          MAIL_ID: { value: data?.[0]?.MAIL_ID },
          MOTHERS_NAME: { value: data?.[0]?.MOTHERS_NAME },
          MOBILE_NO: { value: data?.[0]?.MOBILE_NO },
          LAST_LOGIN_DT: { value: data?.[0]?.LAST_LOGIN_DT },
          CUSTOMER_ID: { value: data?.[0]?.CUSTOMER_ID },
          BIRTH_DATE: { value: data?.[0]?.BIRTH_DATE },
          PASSWORD_CHANGE_DT: { value: data?.[0]?.PASSWORD_CHANGE_DT },
          GENDER: { value: data?.[0]?.GENDER },
          USER_NAME: { value: data?.[0]?.USER_NAME },
          FATHERS_NAME: { value: data?.[0]?.FATHERS_NAME },
        };
      } else {
        return {
          MAIL_ID: { value: "" },
          MOTHERS_NAME: { value: "" },
          MOBILE_NO: { value: "" },
          LAST_LOGIN_DT: { value: "" },
          CUSTOMER_ID: { value: "" },
          BIRTH_DATE: { value: "" },
          PASSWORD_CHANGE_DT: { value: "" },
          GENDER: { value: "" },
          USER_NAME: { value: "" },
          FATHERS_NAME: { value: "" },
          CUST_NAME: { value: "" },
        };
      } */
      if (status === "0") {
        let responsedata = data;
        return responsedata;
      } else {
        throw DefaultErrorObject(message, messageDetails);
      }
    }
  }
};

// export const getCustomerCardDetailThroughCB = async ({ clientID }) => {
//   const { data, status, message, messageDetails } =
//     await AuthSDK.internalFetcher("GETUSERDTL360", {
//       CUSTOMER_DTL_LIST: { CBNUMBER: clientID, APP_INDICATOR: "TRANZWARE" },
//     });
//   if (status === "0") {
//     return data;
//   } else {
//     throw DefaultErrorObject(message, messageDetails);
//   }
// };

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
