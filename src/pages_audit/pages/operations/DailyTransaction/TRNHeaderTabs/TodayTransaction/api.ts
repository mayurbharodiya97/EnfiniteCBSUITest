import {
  AddIDinResponseData,
  DefaultErrorObject,
  utilFunction,
} from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getTodayTransList = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDLYTRNTODAYTAB", {
      COMP_CD: reqData?.COMP_CD,
      ACCT_TYPE: reqData?.ACCT_TYPE,
      ACCT_CD: reqData?.ACCT_CD,
      BRANCH_CD: reqData?.BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    responseData.map((a, i) => {
      a.index = i;
      a.sr = i + 1;
      a.DEBIT = a.DEBIT == "" ? "0.00" : a.DEBIT;
      a.CREDIT = a.CREDIT == "" ? "0.00" : a.CREDIT;
      a.time = a.ENTERED_DATE.split(" ")[1]?.substring(0, 5);
    });
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getChequeBookEntryData = async ({
  companyID,
  branchCD,
  acctType,
  accountNo,
}) => {
  if (!Boolean(branchCD)) {
    throw DefaultErrorObject(
      "Required value missing for Branch.",
      "",
      "warning"
    );
  } else if (!Boolean(acctType)) {
    throw DefaultErrorObject(
      "Required value missing for Account Type.",
      "",
      "warning"
    );
  } else if (!Boolean(accountNo)) {
    throw DefaultErrorObject(
      "Required value missing for Account Number.",
      "",
      "warning"
    );
  } else {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETCHEQUEBOOK", {
        COMP_CD: companyID,
        BRANCH_CD: branchCD,
        ACCT_TYPE: acctType,
        ACCT_CD: accountNo,
      });

    if (status === "0") {
      let responsedata = data;
      return responsedata;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  }
};

export const getChequeLeavesList88888 = async ({ NO_OF_CHEQUE }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCHQLEAVESLIST", { COMP_CD: "132 " });
  if (status === "0") {
    return [
      {
        // CHEQUE_FROM: "8080808",
        // CHEQUE_TO: "9090909",
        SERVICE_CHARGE: "757754",
        GST: "4564564 ",
        FROM_CHEQUE_NO: "8080808",
        TO_CHEQUE_NO: "9090909",
        NO_OF_CHEQUE: NO_OF_CHEQUE,
        // SERVICE_CHARGE: "757754",
        // GST: "4564564 ",
      },
    ];
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getCustomerCardDetailThroughCB = async ({ clientID }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETUSERDTL360", {
      CUSTOMER_DTL_LIST: { CBNUMBER: clientID, APP_INDICATOR: "TRANZWARE" },
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const saveCustomerRegisterRequest = async ({ inputData }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("INSCUSTREGREQ", {
      INPUT_DATA: inputData,
    });
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getAcctDtlList = async (reqParaMeters) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSEARCHCOMPONENT", {
      COMP_CD: reqParaMeters?.COMP_CD,
      A_FLAG: reqParaMeters?.CUSTOMER_ID ? "" : "A",
      BRANCH_CD: reqParaMeters?.CUSTOMER_ID ? "" : reqParaMeters?.BRANCH_CD,
      ACCT_TYPE: reqParaMeters?.CUSTOMER_ID ? "" : reqParaMeters?.ACCT_TYPE,
      ACCT_CD: reqParaMeters?.CUSTOMER_ID ? "" : reqParaMeters?.ACCT_CD,
      CUST_ID: reqParaMeters?.CUSTOMER_ID ? reqParaMeters?.CUSTOMER_ID : "",
    });
  if (status === "0") {
    // const dataStatus = data;
    // dataStatus.map((item) => {
    //   if (item?.ORG_STATUS === "Close") {
    //     item._rowColor = "rgb(152 59 70 / 61%)";
    //   }
    //   if (item?.ORG_STATUS === "Freezed") {
    //     item._rowColor = "rgb(40 142 159 / 60%)";
    //   }
    //   if (item?.ORG_STATUS === "Un-Claimed") {
    //     item._rowColor = "rgb(9 132 3 / 51%)";
    //   }
    // });
    // // return dataStatus;
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
