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

// export const getTRN001List = async (reqData) => {
//   //for table viewAll
//   const { data, status, message, messageDetails } =
//     await AuthSDK.internalFetcher("GETDAILYTRNLIST", {
//       COMP_CD: reqData?.COMP_CD,
//       BRANCH_CD: reqData?.BRANCH_CD,
//     });
//   if (status === "0") {
//     let responseData = data;

//     return responseData;
//   } else {
//     throw DefaultErrorObject(message, messageDetails);
//   }
// };
export const getTRN001List = async (reqData) => {
  //for table
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDAILYTRNLIST", {
      COMP_CD: reqData?.COMP_CD,
      BRANCH_CD: reqData?.BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    responseData &&
      responseData.map((a, i) => {
        a.index = i;
        a.account1 = a.ACCT_TYPE + a.TYPE_NM;
        a.trx1 = a.TYPE_CD + a.TYPE_CD_DESC;
        a.sdc1 = a.SDC + a.SDC_DESC;
        a.date1 = a.TRAN_DT?.substring(0, 10);
        if (
          a.TYPE_CD.includes("1") ||
          a.TYPE_CD.includes("2") ||
          a.TYPE_CD.includes("3")
        ) {
          a.credit1 = Number(a.AMOUNT).toFixed(2);
          a.debit1 = "0.00";
        }
        if (
          a.TYPE_CD.includes("4") ||
          a.TYPE_CD.includes("5") ||
          a.TYPE_CD.includes("6")
        ) {
          a.debit1 = Number(a.AMOUNT).toFixed(2);
          a.credit1 = "0.00";
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

export const addDailyTrxScroll = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DODAILYTRNDML", {
      DETAILS_DATA: { isDeleteRow: [], isUpdatedRow: [], isNewRow: reqData },
    });
  if (status === "0") {
    let responseData = data;

    return responseData[0];
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
