import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";
import { GeneralAPI } from "registry/fns/functions";

export const securityDropDownListType = async (
  USER_NAME,
  BRANCH_CD,
  COMP_CD
) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLIMITDDWACCTTYPE", {
      USER_NAME: USER_NAME,
      BRANCH_CD: BRANCH_CD,
      COMP_CD: COMP_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ ACCT_TYPE, DESCRIPTION, ...other }) => {
          return {
            value: ACCT_TYPE,
            // value: PARENT_TYPE.trim(),
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

export const getSecurityListData = async (companyID, branchCode, ACCT_TYPE) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLIMITSECUMSTPARENT", {
      // ...newObj,
      A_PARENT_TYPE: ACCT_TYPE,
      BRANCH_CD: branchCode,
      COMP_CD: companyID,
    });
  if (status === "0") {
    let responseData = data;

    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ SECURITY_TYPE, DISPLAY_NM, ...other }) => {
          return {
            value: SECURITY_TYPE,
            label: DISPLAY_NM,
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

export const getLimitEntryData = async (apiReqPara) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLIMITACTNMBALDISP", {
      ...apiReqPara,
      // TRAN_CD: "1",
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const LimitSecurityData = async (apiReqPara) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLIMITSECFIELDDISP", {
      ...apiReqPara,
    });
  if (status === "0") {
    // return data;
    let transformedSecurityData: any = {};
    if (Array.isArray(data)) {
      transformedSecurityData = data?.map((val, index) => {
        return {
          render: {
            componentType: val?.COMPONENT_TYPE,
          },
          name: val?.FIELD_NAME,
          label: val?.FIELD_LABEL,
          sequence: val?.TAB_SEQ,
          // required: val?.FIELD_REQUIRED,
          // placeholder: val?.FIELD_NAME,
          GridProps: {
            xs: val?.XS,
            md: val?.MD,
            sm: val?.SM,
            lg: val?.LG,
            xl: val?.XL,
          },
        };
      });
    }
    return transformedSecurityData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getFDdetail = async (apiReqPara) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETFDBRDDETAIL", {
      ...apiReqPara,
      COMP_CD: "132 ",
      BRANCH_CD: "099 ",
      ACCT_TYPE: "305 ",
      ACCT_CD: "000648",
      FD_NO: "7694",
      SECURITY_TYPE: "BRD",
      SECURITY_CD: "19",
      DATE: "15-DEC-2023",
      SCREEN_REF: "ETRN/046",
      PANEL_FLAG: "Y",
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getLimitDTL = async (otherAPIRequestPara) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLIMITENTRY", {
      ...otherAPIRequestPara,
      // TRAN_CD: "1",
    });
  if (status === "0") {
    let newData = data;
    newData[0].CHEQUE_BOOK_ISSUE = "N";
    return newData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
