import { DefaultErrorObject } from "@acuteinfo/common-base";
import { AuthSDK } from "registry/fns/auth";

export const getFDtype = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETFDTYPEDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ DISPLAY_VALUE, DATA_VALUE, ...others }) => {
          return {
            value: DATA_VALUE,
            label: DISPLAY_VALUE,
            ...others,
          };
        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const gettypeDDWdata = async ({ COMP_CD, BRANCH_CD, USER_NAME }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDDDWACCTTYPE", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      USER_NAME: USER_NAME,
      DOC_CD: "RPT/405",
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ TYPE_NM, ACCT_TYPE, ...others }) => {
        return {
          value: ACCT_TYPE,
          label: TYPE_NM,
          ...others,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getCategoryDDWdata = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTMSTCATEGORYDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ CATEG_NM, CATEG_CD, ...others }) => {
        return {
          value: CATEG_CD,
          label: CATEG_NM,
          ...others,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getFdinterest = async ({
  COMP_CD,
  BRANCH_CD,
  ACCT_TYPE,
  CATEG_CD,
  MATURITY_DT,
  TRAN_DT,
  PERIOD_CD,
  PERIOD_NO,
  PRE_INT_FLAG,
  PRINCIPAL_AMT,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETFDINTRATE", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      ACCT_TYPE: ACCT_TYPE,
      CATEG_CD: CATEG_CD,
      MATURITY_DT: MATURITY_DT,
      TRAN_DT: TRAN_DT,
      PERIOD_CD: PERIOD_CD,
      PERIOD_NO: PERIOD_NO,
      PRE_INT_FLAG: PRE_INT_FLAG,
      PRINCIPAL_AMT: PRINCIPAL_AMT,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getFdMaturityAmount = async ({
  COMP_CD,
  BRANCH_CD,
  ACCT_TYPE,
  CATEG_CD,
  MATURITY_DT,
  TRAN_DT,
  PERIOD_CD,
  PERIOD_NO,
  PRE_INT_FLAG,
  PRINCIPAL_AMT,
  INT_RATE,
  TERM_CD,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETFDMATURITYAMT", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      ACCT_TYPE: ACCT_TYPE,
      CATEG_CD: CATEG_CD,
      MATURITY_DT: MATURITY_DT,
      TRAN_DT: TRAN_DT,
      PERIOD_CD: PERIOD_CD,
      PERIOD_NO: PERIOD_NO,
      PRE_INT_FLAG: PRE_INT_FLAG,
      PRINCIPAL_AMT: PRINCIPAL_AMT,
      INT_RATE: INT_RATE,
      TERM_CD: TERM_CD,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getFdRateDefination = async ({
  COMP_CD,
  BRANCH_CD,
  BASE_BRANCH,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETFDRATEDEFINITION", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      BASE_BRANCH: BASE_BRANCH,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ DESCRIPTION, TRAN_CD, ...others }) => {
        return {
          value: TRAN_CD,
          label: DESCRIPTION,
          ...others,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
