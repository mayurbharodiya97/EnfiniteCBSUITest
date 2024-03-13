import {
  AddIDinResponseData,
  DefaultErrorObject,
  utilFunction,
} from "components/utils";
import { format } from "date-fns";
import { AuthSDK } from "registry/fns/auth";

export const BranchSelectionGridData = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("BRANCHLIST", {});
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ BRANCH_CD, BASE_COMP_CD, BRANCH_NM, DISP_STATUS, ...other }) => {
          return {
            value: BRANCH_CD,
            label:
              BASE_COMP_CD +
              "|" +
              BRANCH_CD +
              "|" +
              BRANCH_NM +
              "|" +
              DISP_STATUS,
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

export const getInwardClearingData = async ({ data: formData }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("INWARDRETRIVEDATA", formData);
  if (status === "0") {
    return data.map((item) => {
      return {
        ...item,
        POST_CONF: item.POST_CONF === "C" ? "Confirm" : "Post",
      };
    });
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getInwardChequeSignFormData = async ({
  COMP_CD,
  ENTERED_COMP_CD,
  ENTERED_BRANCH_CD,
  BRANCH_CD,
  ACCT_TYPE,
  ACCT_CD,
  DAILY_TRN_CD,
  TRAN_CD,
  TRAN_DT,
  TRAN_FLAG,
  WITH_SIGN,
  ENTERED_BY,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("CHEQUESIGNIMG", {
      COMP_CD: COMP_CD,
      ENTERED_COMP_CD: ENTERED_COMP_CD,
      ENTERED_BRANCH_CD: ENTERED_BRANCH_CD,
      BRANCH_CD: BRANCH_CD,
      ACCT_TYPE: ACCT_TYPE,
      ACCT_CD: ACCT_CD,
      DAILY_TRN_CD: DAILY_TRN_CD,
      TRAN_CD: TRAN_CD,
      TRAN_DT: TRAN_DT,
      TRAN_FLAG: TRAN_FLAG,
      WITH_SIGN: WITH_SIGN,
      ENTERED_BY: ENTERED_BY,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getBussinessDate = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETBUSINESSDATE", {});
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const validatePost = async (apiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("POSTBTNVALIDATE", {
      ...apiReq,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const validateReturn = async (apiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("RETURNBTNVALIDATE", {
      ...apiReq,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getInwardZoneTypeList = async (ApiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETINWZONEDDW", {
      ...ApiReq,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ ZONE_CD, DISPLAY_NM, ...other }) => {
        return {
          value: ZONE_CD,
          label: DISPLAY_NM,
          ...other,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getInwardReasonTypeList = async (ApiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETINWREASONMSTDDW", {
      ...ApiReq,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ DISLAY_REASON, REASON_CD, ...other }) => {
          return {
            value: REASON_CD,
            label: DISLAY_REASON,
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
export const getPositivePayData = async (apiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETPOSITIVEPAYDTL", {
      ...apiReq,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const postConfigDML = async (apiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DOPOSTDML", {
      ...apiReq,
    });
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
