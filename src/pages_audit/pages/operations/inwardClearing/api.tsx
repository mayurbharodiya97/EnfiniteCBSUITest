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
    const dataStatus = data;
    dataStatus.map((item) => {
      //  rgb(255, 225, 225)    pink
      if (item?.POST_CONF === "C") {
        item._rowColor = "rgb(9 132 3 / 51%)"; // green
      }
      if (item?.DRAFT_DIV === "DRAFT") {
        item._rowColor = "rgb(255, 225, 225)"; // pink
      }
      if (item?.DRAFT_DIV === "DIVIDEND") {
        item._rowColor = "rgb(40 142 159 / 60%)"; // blue
      }
    });
    return dataStatus;
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
export const validateConfirm = async (apiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("CONFRIMBTNVALIDATE", {
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
export const returnConfigDML = async (apiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DOUPDATERETRUNDATA", {
      ...apiReq,
    });
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const confirmPostedConfigDML = async (apiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DOCONFRIMEDPOSTEDDATA", {
      ...apiReq,
    });
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getInwardAccountDetail = async (Apireq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETINWARDACCTDTL", { ...Apireq });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getDividendViewDetailGridData = async (formData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETINWDIVIDVIEWDTLGRIDTAB", { ...formData });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getDividendViewMasterData = async (formData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETINWDIVIDVEWMSTTAB", { ...formData });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getDividendPaidWarrantGridData = async (formData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETINWDIVIDPAIDWARNTGRID", { ...formData });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getDividendAccountDetail = async (Apireq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("VALIDATEDIVIDENDDATA", { ...Apireq });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
