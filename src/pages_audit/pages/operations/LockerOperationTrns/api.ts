import { DefaultErrorObject } from "@acuteinfo/common-base";
import { AuthSDK } from "registry/fns/auth";

export const getLockerOperationTrnsData = async ({
  COMP_CD,
  BRANCH_CD,
  ACCT_CD,
  ACCT_TYPE,
  WORKING_DATE,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLOCKEROPERATIONTRN", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      ACCT_CD: ACCT_CD,
      ACCT_TYPE: ACCT_TYPE,
      WORKING_DATE: WORKING_DATE,
    });

  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map((items, index) => ({
        ...items,
        INDEX: index,
        OPER_STATUS_DISPLAY:
          items?.OPER_STATUS === "I" ? "In Time" : "Exit Time",
      }));
    }

    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getLockerSizeDDWdata = async ({
  LOCKER_NO,
  ACCT_TYPE,
  BRANCH_CD,
  COMP_CD,
  ALLOTED,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLOCKERSIZEDDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      LOCKER_NO: LOCKER_NO,
      ACCT_TYPE: ACCT_TYPE,
      ALLOTED: ALLOTED,
    });

  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ LOC_SIZE_CD, SIZE_NM, ...items }) => {
        return {
          ...items,
          value: LOC_SIZE_CD,
          label: SIZE_NM,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getLockerViewMst = async ({
  COMP_CD,
  BRANCH_CD,
  ACCT_CD,
  ACCT_TYPE,
  WORKING_DATE,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLOCKERVIEWMST", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      ACCT_CD: ACCT_CD,
      ACCT_TYPE: ACCT_TYPE,
      WORKING_DATE: WORKING_DATE,
    });

  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getLockerOperationDDWdata = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLOCKEROPERATIONDDDW", {});

  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ DATA_VAL, DISL_VAL, ...items }) => {
        return {
          ...items,
          value: DATA_VAL,
          label: DISL_VAL,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getLockerTrxDDWdata = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLOCKERTRXDDDW", {});

  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ DISP_VAL, DATA_VAL, ...items }) => {
        return {
          ...items,
          label: DISP_VAL,
          value: DATA_VAL,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
