import { DefaultErrorObject } from "components/utils";
import { format } from "date-fns";
import { AuthSDK } from "registry/fns/auth";

export const getDynamicBoxData = async (apiName, { COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(`/enfinityCommonServiceAPI/${apiName}`, {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getAccountStatusData = async ({ COMP_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCOUNTSTATUS", { COMP_CD: COMP_CD });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getDashboardMessageBoxData = async ({ screenFlag, userID }) => {
  let apiURL;
  let apiReq = {};
  if (screenFlag === "Announcement") {
    apiURL = "GETANNOUNCEMENT";
    apiReq = {
      USER_NAME: userID,
      // USER_NAME: "ajayj",
      USER_NAME: userID,
      // USER_NAME: "ajayj",
    };
  } else if (screenFlag === "Tips") {
    apiURL = "GETTIPSDETAILS";
    apiReq = {
      USER_NAME: userID,
      // USER_NAME: "brij001",
    };
  } else if (screenFlag === "Notes") {
    apiReq = {
      USER_NAME: userID,
      // USER_NAME: "brij001",
    };
    apiURL = "GETNOTESDETAILSELECT";
  } else if (screenFlag === "Alert") {
    apiURL = "GETALERTDTL";
    apiReq = {
      USER_NAME: userID,
      // APP_TRAN_CD: "1",
    };
  }
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(apiURL, apiReq);
  if (status === "0") {
    // return data;
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ TRAN_CD, DESCRIPTION }) => {
        return {
          value: TRAN_CD,
          label: DESCRIPTION,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getMessageBoxListData = async ({ transactionID, userID }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETECIRCULARDETAIL", {
      USER_NAME: userID,
      TRAN_CD: transactionID,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
