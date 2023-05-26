import { DefaultErrorObject } from "components/utils";
import { format } from "date-fns";
import { AuthSDK } from "registry/fns/auth";

export const getDynamicBoxData = async (apiName) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(`/adminPanelCommonServiceAPI/${apiName}`, {});
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getTrafficChartData = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETTRAFFICCHARTDASH", {});
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getTransactionChartData = async (type) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETTRANCHARTDATADASH", {
      TYPE: type,
      ASON_DATE: format(new Date(), "dd-MMM-yyyy"),
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getDashboardMessageBoxData = async (screenFlag) => {
  let apiURL;
  let apiReq = {};
  if (screenFlag === "Announcement") {
    apiURL = "GETANNOUNCEMENT";
  } else if (screenFlag === "Tips") {
    apiURL = "GETTIPSDETAILS";
  } else if (screenFlag === "Notes") {
    apiURL = "GETNOTESDETAILSELECT";
  } else if (screenFlag === "Alert") {
    apiURL = "GETALERTDTL";
  }
  // const { data, status, message, messageDetails } =
  //   await AuthSDK.internalFetcher(apiURL);
  // if (status === "0") {
  //   return data;
  // let responseData = data;
  //   if (Array.isArray(responseData)) {
  //     responseData = responseData.map(({ FULL_DTL, USER_NAME }) => {
  //       return {
  //         value: USER_NAME,
  //         label: FULL_DTL,
  //       };
  //     });
  //   }

  //   return responseData;
  // } else {
  //   throw DefaultErrorObject(message, messageDetails);
  // }
  return [
    {
      TRAN_CD: "54",
      DESCRIPTION: "use lightss and fans",
      ALT_EXPIRY_DATE: "2023-05-25 00:00:00.0",
      NAME: "",
    },
    {
      TRAN_CD: "23",
      DESCRIPTION: "TEST _NEW QUERY BOTH TABLE DATA INSERT ONLY ONE USER",
      ALT_EXPIRY_DATE: "2023-05-25 00:00:00.0",
      NAME: "anilt",
    },
    {
      TRAN_CD: "27",
      DESCRIPTION: "TEST",
      ALT_EXPIRY_DATE: "2023-05-23 00:00:00.0",
      NAME: "bhaveshs",
    },
    {
      TRAN_CD: "29",
      DESCRIPTION: "TEST",
      ALT_EXPIRY_DATE: "2023-05-24 00:00:00.0",
      NAME: "",
    },
    {
      TRAN_CD: "26",
      DESCRIPTION: "TEST 3",
      ALT_EXPIRY_DATE: "2023-05-25 15:35:00.0",
      NAME: "anilt",
    },
  ];
};
