import {
  AddIDinResponseData,
  DefaultErrorObject,
  utilFunction,
} from "components/utils";
import { AuthSDK } from "registry/fns/auth";
import { format } from "date-fns"; //format(new Date(), "dd/MMM/yyyy")

export const deleteScrollByScrollNo = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DELETESCROLLDATA", reqData);
  if (status === "0") {
    let obj = {
      data,
      status,
      message,
      messageDetails,
    };
    return obj;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const deleteScrollByVoucherNo = async (reqData) => {
  console.log(reqData, "deleteScrollByVoucherNo");
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DODAILYTRNDML", {
      DETAILS_DATA: { isDeleteRow: [reqData], isUpdatedRow: [], isNewRow: [] },
    });
  if (status === "0") {
    let obj = {
      data,
      status,
      message,
      messageDetails,
    };
    return obj;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getAccDetails = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCOUNTDTL", {
      // COMP_CD: reqData.COMP_CD,
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
  console.log(reqData, "reqData");
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DAILYTRNCARDDTL", {
      PARENT_TYPE: reqData?.PARENT_TYPE,
      COMP_CD: reqData?.COMP_CD,
      ACCT_TYPE: reqData?.ACCT_TYPE,
      ACCT_CD: reqData?.ACCT_CD,
      BRANCH_CD: reqData?.BRANCH_CD,
    });
  if (status === "0") {
    data.map((a) => {
      if (a?.COMPONENT_TYPE == "amountField" && !a?.COL_VALUE.includes(".")) {
        a.COL_VALUE = a.COL_VALUE + ".00";
      }
    });
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getTabsByParentType = async (reqData) => {
  console.log(reqData, "reqData");
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDLYTRNTABFIELDDISP", {
      PARENT_TYPE: reqData,
    });
  if (status === "0") {
    let responseData = data;
    console.log(data, "res data");
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
