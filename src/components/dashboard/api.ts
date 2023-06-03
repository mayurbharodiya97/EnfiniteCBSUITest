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

export const getTrafficChartData = async () => {
  // const { data, status, message, messageDetails } =
  //   await AuthSDK.internalFetcher("GETTRAFFICCHARTDASH", {});
  // if (status === "0") {
  //   return data;
  // } else {
  //   throw DefaultErrorObject(message, messageDetails);
  // }
};

export const getTransactionChartData = async (type) => {
  // const { data, status, message, messageDetails } =
  //   await AuthSDK.internalFetcher("GETTRANCHARTDATADASH", {
  //     TYPE: type,
  //     ASON_DATE: format(new Date(), "dd-MMM-yyyy"),
  //   });
  // if (status === "0") {
  //   return data;
  // } else {
  //   throw DefaultErrorObject(message, messageDetails);
  // }
};
export const getDashboardMessageBoxData = async ({
  screenFlag,
  BRANCH_CD,
  userID,
}) => {
  let apiURL;
  let apiReq = {};
  if (screenFlag === "Announcement") {
    apiURL = "GETANNOUNCEMENT";
    apiReq = {
      // USER_NAME: userID
      USER_NAME: "ajayj",
    };
  } else if (screenFlag === "Tips") {
    apiURL = "GETTIPSDETAILS";
    apiReq = {
      // USER_NAME: userID,
      USER_NAME: "anilt",
    };
  } else if (screenFlag === "Notes") {
    apiReq = {
      // USER_NAME: userID,
      USER_NAME: "sudhanshus",
    };
    apiURL = "GETNOTESDETAILSELECT";
  } else if (screenFlag === "Alert") {
    apiURL = "GETALERTDTL";
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
