import {
  AddIDinResponseData,
  DefaultErrorObject,
  utilFunction,
} from "components/utils";
import { AuthSDK } from "registry/fns/auth";
import { format } from "date-fns"; //format(new Date(), "dd/MMM/yyyy")

//lists

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

export const getTRN001List = async (reqData) => {
  //for table viewAll
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDAILYTRNLIST", {
      COMP_CD: reqData?.COMP_CD,
      BRANCH_CD: reqData?.BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;

    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getAccDetails = async (reqData) => {
  //apurva
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCOUNTDTL", {
      // ACCT_CD: "000026              ",
      // A_ASON_DT: "15/DEC/2023",
      COMP_CD: reqData.COMP_CD,
      BRANCH_CD: reqData.BRANCH_CD,
      ACCT_TYPE: reqData.ACCT_TYPE,
      ACCT_CD: reqData.ACCT_CD.padEnd(20, " "),
      A_ASON_DT: format(new Date(), "dd/MMM/yyyy"),
    });
  if (status === "0") {
    let responseData = data;
    if (responseData.length > 0) {
      return responseData[0];
    } else {
      return responseData;
    }
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

// export const getAccInfo = async (reqData) => {
//   //jimit
//   const { data, status, message, messageDetails } =
//     await AuthSDK.internalFetcher("GETDAILYTRANMAKERDTL", {
//       // ACCT_CD: "000026              ",
//       // A_ASON_DT: "15/DEC/2023",
//       COMP_CD: reqData.COMP_CD,
//       BRANCH_CD: reqData.BRANCH_CD,
//       ACCT_TYPE: reqData.ACCT_TYPE,
//       ACCT_CD: reqData.ACCT_CD.padEnd(20, " "),
//       A_ASON_DT: format(new Date(), "dd/MMM/yyyy"),
//     });
//   if (status === "0") {
//     let responseData = data;
//     if (responseData.length > 0) {
//       return responseData[0];
//     } else {
//       return responseData;
//     }
//   } else {
//     throw DefaultErrorObject(message, messageDetails);
//   }
// };

//operations

export const getAccInquiry = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTINQUIRY", {
      // ACCT_NO: "132005001007851",
      ACCT_NO: "",
      MOB_NO: "",
      PAN_NO: "",
      CUST_ID: "12",
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const addDailyTrxScroll = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DODAILYTRNDML", {
      DETAILS_DATA: { isDeleteRow: [], isUpdatedRow: [], isNewRow: reqData },
    });
  if (status === "0") {
    let responseData = data;

    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

//validations
export const getChqValidation = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("CHEQUENOVALIDATION", {
      COMP_CD: reqData?.branch?.info?.COMP_CD,
      BRANCH_CD: reqData?.branch?.value,
      ACCT_TYPE: reqData?.accType?.value,
      ACCT_CD: reqData.accNo.padEnd(20, " "),
      CHEQUE_NO: reqData?.cNo,
    });
  if (status === "0") {
    let responseData = data;

    return responseData[0];
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
