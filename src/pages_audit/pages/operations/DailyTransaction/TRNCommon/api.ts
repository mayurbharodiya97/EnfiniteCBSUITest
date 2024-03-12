import {
  AddIDinResponseData,
  DefaultErrorObject,
  utilFunction,
} from "components/utils";
import { AuthSDK } from "registry/fns/auth";
import { format } from "date-fns"; //format(new Date(), "dd/MMM/yyyy")

export const getQueryDataF1 = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETTRANDYNQUERYDATAF1", reqData);
  if (status === "0") {
    let responseData = data;
    responseData &&
      responseData.map((a, i) => {
        a.index = i;
        a.account1 = a.ACCT_TYPE + a.TYPE_NM;
        a.trx1 = a.TYPE_CD + a.TYPE_CD_DESC;
        a.sdc1 = a.SDC + a.SDC_DESC;
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
export const getQueryDataF2 = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETTRANDYNQUERYDATAF2", reqData);
  if (status === "0") {
    let responseData = data;

    responseData &&
      responseData.map((a, i) => {
        a.index = i;
        a.account1 = a.ACCT_TYPE + a.TYPE_NM;
        a.trx1 = a.TYPE_CD + a.TYPE_CD_DESC;
        a.sdc1 = a.SDC + a.SDC_DESC;
        a.time = a?.ENTERED_DATE.split(" ")[1].substring(0, 5);
      });

    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const deleteScrollByScrollNo = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DELETESCROLLDATA", {
      COMP_CD: reqData?.COMP_CD,
      SCROLL_NO: reqData?.SCROLL_NO,

      // BRANCH_CD: "099 ",
      // ACCT_TYPE: "0011",
      // ACCT_CD: "000001              ",
      // TRAN_AMOUNT: "7000",
      // ENT_COMP_CD: "132 ",
      // ENT_BRANCH_CD: "099 ",
      // ACTIVITY_TYPE: "DAILY TRANSACTION",
      // TRANSACTION_DATE: "01-FEB-24",
      // CONFIRM_FLAG: "N",
      // USER_DEF_REMARKS: "SUCCESSFULLY DELETE",
    });
  if (status === "0") {
    let responseData = data;

    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const deleteScrollByVoucherNo = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DODAILYTRNDML", {
      DETAILS_DATA: { isDeleteRow: [reqData], isUpdatedRow: [], isNewRow: [] },
    });
  if (status === "0") {
    let responseData = data;

    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getAccDetails = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCOUNTDTL", {
      COMP_CD: reqData.COMP_CD,
      BRANCH_CD: reqData.BRANCH_CD,
      ACCT_TYPE: reqData.ACCT_TYPE,
      ACCT_CD: reqData.ACCT_CD.padEnd(20, " "),
      A_ASON_DT: format(new Date(), "dd/MMM/yyyy"), //"15/DEC/2023"
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

export const getCarousalCards = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DAILYTRNCARDDTL", {
      PARENT_TYPE: reqData?.PARENT_TYPE,
      COMP_CD: reqData?.COMP_CD,
      ACCT_TYPE: reqData?.ACCT_TYPE,
      ACCT_CD: reqData?.ACCT_CD,
      BRANCH_CD: reqData?.BRANCH_CD,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getTabsByParentType = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDLYTRNTABFIELDDISP", {
      COMP_CD: reqData?.COMP_CD,
      ACCT_TYPE: reqData?.ACCT_TYPE,
      BRANCH_CD: reqData?.BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
