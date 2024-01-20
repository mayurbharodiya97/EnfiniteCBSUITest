import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const stockAcctTypeList = async (ApiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSTKACCTTYPEDDW", {
      ...ApiReq,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ ACCT_TYPE, DESCRIPTION, ...other }) => {
          return {
            value: ACCT_TYPE,
            label: ACCT_TYPE + " - " + DESCRIPTION + " - " + other.PARENT_TYPE,
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

export const securityListDD = async (ApiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSTKSECURITYDDW", {
      ...ApiReq,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ SECURITY_CD, SECURITY_TYPE, DESCRIPTION, ...other }) => {
          return {
            value: SECURITY_CD,
            label: DESCRIPTION + " " + SECURITY_TYPE,
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
export const scriptListDD = async (ApiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSTKSCRIPTDDW", {
      ...ApiReq,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ SCRIPT_CD, SCRIPT_NM, ...other }) => {
        return {
          value: SCRIPT_CD,
          label: SCRIPT_NM,
          ...other,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const securityFieldDTL = async (apiReqPara) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSTKSECFIELDDISP", {
      ...apiReqPara,
      // TRAN_CD: "1",
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const stockGridData = async (apiReqPara) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSTOCKDATA", {
      //   ...apiReqPara,
      COMP_CD: "132 ",
      BRANCH_CD: "099 ",
      ACCT_TYPE: "301 ",
      ACCT_CD: "000041              ",
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const viewUploadDOC = async (apiReqPara) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSTKUPVEWBTNDOCDTLDISP", {
      // ...apiReqPara,
      COMP_CD: "132 ",
      BRANCH_CD: "099 ",
      REF_TRAN_CD: "000003",
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
