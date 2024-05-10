import {
  AddIDinResponseData,
  DefaultErrorObject,
  utilFunction,
} from "components/utils";
import { format } from "date-fns";
import { AuthSDK } from "registry/fns/auth";

export const getAccountDetail = async (Apireq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCOUNTDETAIL", { ...Apireq });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getJointDetailsList = async (Apireq?) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDLYTRNJOINTTAB", { ...Apireq });
  if (status === "0") {
    // return data;
    let responseData = data;
    responseData.map((a, i) => {
      console.log("ai", a, i);
      a.index = i;
      a.phone1 = [a.MOBILE_NO, a.PHONE].filter(Boolean).join(", ");
      a.MEM_DISP_ACCT_TYPE = [a.MEM_ACCT_TYPE, a.MEM_ACCT_CD]
        .filter(Boolean)
        .join("-");
      a.REF_ACCT = [
        a.REF_BRANCH_CD,
        a.REF_COMP_CD,
        a.REF_ACCT_TYPE,
        a.MEM_ACCT_CD,
      ]
        .filter(Boolean)
        .join("-");

      return a;
    });
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getRtgsTransactionTypeList = async (ApiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETRTGSTRANTYPEDDW", {
      ...ApiReq,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ DESCRIPTION, MSG_TYPE, ...other }) => {
        return {
          value: MSG_TYPE,
          label: DESCRIPTION,
          ...other,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getCommTypeList = async (ApiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCOMMTYPEDDDW", {
      ...ApiReq,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ DESCRIPTION, TRAN_CD, ...other }) => {
        return {
          value: TRAN_CD,
          label: DESCRIPTION,
          ...other,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getIfscCodeList = async (ApiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETBRANCHIFSCCODE", {
      ...ApiReq,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ DISPLAY_VALUE, DEFAULT_VALUE, DATA_VALUE, ...other }) => {
          return {
            DEFAULT_VALUE: DEFAULT_VALUE,
            value: DATA_VALUE,
            label: DISPLAY_VALUE,
            ...other,
          };
        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
