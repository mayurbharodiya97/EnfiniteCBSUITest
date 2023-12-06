import {
  AddIDinResponseData,
  DefaultErrorObject,
  utilFunction,
} from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getSDCList = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSDCLIST", {
      USER_NAME: reqData?.user.id ?? "",
      BRANCH_CD: reqData?.user?.branchCode,
      COMP_CD: reqData?.companyID,
    });

  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map((row) => {
        return {
          value: row.CODE,
          label: row.DISLAY_STANDARD,
          info: row,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getBranchList = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETBRACCESSLST", {
      USER_NAME: reqData?.user.id ?? "",
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map((row) => {
        return {
          value: row.BRANCH_CD,
          label: row.BRANCH_CD + "-" + row.BRANCH_NM,
          info: row,
        };
      });

      // responseData = responseData.map(({ BRANCH_CD, BRANCH_NM }) => {
      //   return {
      //     value: BRANCH_CD,
      //     label: BRANCH_CD + " - " + BRANCH_NM,
      //   };
      // });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getAccTypeList = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETUSERACCTTYPE", {
      USER_NAME: reqData?.user.id ?? "",
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map((row) => {
        return {
          value: row.ACCT_TYPE,
          label: row.ACCT_TYPE + "-" + row.TYPE_NM,
          info: row,
        };
      });

      // responseData = responseData.map(({ ACCT_TYPE, TYPE_NM, ...others }) => {
      //   return {
      //     ...others,
      //     value: ACCT_TYPE,
      //     label: ACCT_TYPE + " - " + TYPE_NM,
      //   };
      // });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getTRXList = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETTRXLIST", {
      USER_NAME: reqData?.user.id ?? "",
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map((row) => {
        return {
          value: row.CODE,
          code: row.CODE,
          label: row.CODE + "-" + row.DESCRIPTION,
          info: row,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getAccInfo = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDAILYTRANMAKERDTL", {
      COMP_CD: "132 ",
      BRANCH_CD: "099 ",
      ACCT_TYPE: "405 ",
      ACCT_CD: "017825              ",
      // COMP_CD: reqData.COMP_CD,
      // BRANCH_CD: reqData.BRANCH_CD,
      // ACCT_TYPE: reqData.ACCT_TYPE,
      // ACCT_CD: reqData.ACCT_CD,
    });
  if (status === "0") {
    let responseData = data;
    // if (Array.isArray(responseData)) {
    //   responseData = responseData.map((row) => {
    //     return {
    //       value: row.CODE,
    //       code: row.CODE,
    //       label: row.CODE + "-" + row.DESCRIPTION,
    //       info: row,
    //     };
    //   });
    // }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
