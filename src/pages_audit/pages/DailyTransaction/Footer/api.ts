import {
  AddIDinResponseData,
  DefaultErrorObject,
  utilFunction,
} from "components/utils";
import { AuthSDK } from "registry/fns/auth";

const arr = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEp",
  "OCT",
  "NOV",
  "DEC",
];

let today = new Date();
let day = today.getDate();
let month = today.getMonth();
let year = today.getFullYear();

let date = day + "/" + arr[month] + "/" + year;
let date2 = day + "-" + arr[month] + "-" + year;

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

export const getAccInfo = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDAILYTRANMAKERDTL", {
      // COMP_CD: "132 ",
      // BRANCH_CD: "099 ",
      // ACCT_TYPE: "001 ",
      // ACCT_CD: "000026              ",
      // A_ASON_DT: "15/DEC/2023",
      COMP_CD: reqData.COMP_CD,
      BRANCH_CD: reqData.BRANCH_CD,
      ACCT_TYPE: reqData.ACCT_TYPE,
      ACCT_CD: reqData.ACCT_CD.padEnd(20, " "),
      A_ASON_DT: date,
    });
  if (status === "0") {
    let responseData = data;
    return responseData[0];
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

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
    let responseData = data;

    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const addDailyTrxScroll = async (reqData) => {
  const localInfo = localStorage.getItem("authDetails");
  let localInfo1 = localInfo && JSON.parse(localInfo);
  let arr = reqData.map((a) => {
    return {
      BRANCH_CD: localInfo1?.user?.branchCode,
      COMP_CD: localInfo1?.companyID,
      ACCT_TYPE: a.accType?.value,
      ACCT_CD: a.accNo.padStart(6, "0").padEnd(20, " "),
      REMARKS: a.remark,
      CHEQUE_NO: a.cNo, //!a.isCredit ? a.cNo?.toString() : "0"
      TYPE_CD: a.trx.code + "   ",
      TRAN_DT: date2,
      VALUE_DT: date2,
      ENTERED_BRANCH_CD: a.branch?.value,
      ENTERED_COMP_CD: a.branch?.info.COMP_CD,
      SDC: a.sdc.value,
      AMOUNT: a.isCredit ? a.credit : a.debit,
      SCROLL1: a.scroll ? a.scroll : "",
      CURRENCY_CD: "00  ",
      CONFIRMED: "0",
    };
  });
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DODAILYTRNDML", {
      DETAILS_DATA: { isDeleteRow: [], isUpdatedRow: [], isNewRow: arr },
    });
  if (status === "0") {
    let responseData = data;

    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getScrollListF2 = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDAILYTRNCNFF2", {
      COMP_CD: reqData?.branch?.info.COMP_CD,
      BRANCH_CD: reqData?.branch?.value,
    });
  if (status === "0") {
    let responseData = data;

    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

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
