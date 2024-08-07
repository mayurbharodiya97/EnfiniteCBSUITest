import {
  AddIDinResponseData,
  DefaultErrorObject,
  utilFunction,
} from "@acuteinfo/common-base";
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
  //for table
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDAILYTRNLIST", {
      COMP_CD: reqData?.COMP_CD,
      BRANCH_CD: reqData?.BRANCH_CD,
      USER_NAME: reqData?.USER_NAME ?? "",
    });
  if (status === "0") {
    let responseData = data;
    responseData &&
      responseData.map((a, i) => {
        let modDate = format(new Date(a?.ENTERED_DATE), "dd/MMM/yyyy");
        a.index = i;
        a.account1 = a.ACCT_TYPE + a.TYPE_NM;
        a.trx1 = a.TYPE_CD + a.TYPE_CD_DESC;
        a.sdc1 = a.SDC + a.SDC_DESC;
        a.date1 = modDate + "" + a?.ENTERED_DATE.split(" ")[1].substring(0, 5);
        a.time = a?.ENTERED_DATE.split(" ")[1].substring(0, 5);
        if (
          a.TYPE_CD.includes("1") ||
          a.TYPE_CD.includes("2") ||
          a.TYPE_CD.includes("3")
        ) {
          a.credit1 = Number(a.AMOUNT).toFixed(2);
          a.debit1 = "-";
        }
        if (
          a.TYPE_CD.includes("4") ||
          a.TYPE_CD.includes("5") ||
          a.TYPE_CD.includes("6")
        ) {
          a.debit1 = Number(a.AMOUNT).toFixed(2);
          a.credit1 = "-";
        }
      });
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
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

export const saveScroll = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DODAILYTRNDML", {
      DETAILS_DATA: { isDeleteRow: [], isUpdatedRow: [], isNewRow: reqData },
    });
  if (status === "0") {
    let obj = {
      data,
      status,
      messageDetails,
    };
    return obj;
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
export const getChqDateValidation = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("VALIDATECHQDATE", {
      BRANCH_CD: reqData?.branch?.value, //099
      TYPE_CD: reqData?.trx?.value, //5
      CHEQUE_NO: reqData?.cNo, //33
      CHEQUE_DT: format(new Date(reqData?.date), "dd/MMM/yyyy"), //06/Mar/2024
    });
  if (status === "0") {
    let responseData = data;

    return responseData[0];
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getAmountValidation = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("VALIDATECREDITDEBITAMT", {
      BRANCH_CD: reqData?.branch?.value, //099
      TYPE_CD: reqData?.trx?.value, //5
      CHEQUE_NO: reqData?.cNo, //33
      CHEQUE_DT: format(new Date(reqData?.date), "dd/MMM/yyyy"), //06/Mar/2024

      ACCT_TYPE: reqData?.accType?.value,
      ACCT_CD: reqData.accNo.padEnd(20, " "),

      COMP_CD: reqData?.branch?.info?.COMP_CD,
      OP_DATE: format(new Date(reqData?.date), "dd/MMM/yyyy"),

      AMOUNT: reqData?.isCredit ? reqData?.credit : reqData?.debit,
      AVALIABLE_BAL: reqData?.withdraw,
      TRAN_CD: "157505",
      SHADOW_CL: "10",
      HOLD_BAL: "10",
      LEAN_AMT: "10",
      AGAINST_CLEARING: "",
      MIN_BALANCE: "1000",
      CONF_BAL: "1000",
      TRAN_BAL: "100",
      UNCL_BAL: "10",
      LIMIT_AMOUNT: "100",
      DRAWING_POWER: "",
      OD_APPLICABLE: "",
      INST_NO: "",
      INST_RS: "",
      PENDING_AMOUNT: "10",
      STATUS: "",
      TYPE: "C",
      SCREEN_REF: "TRN/001",
    });
  if (status === "0") {
    let responseData = data;

    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

//others
