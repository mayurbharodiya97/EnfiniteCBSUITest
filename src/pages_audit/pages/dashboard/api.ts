import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getDashboardData = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDASHBOARDDATA", {});
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getDashboardDatas = () => {};

export const QuickAccessTableGridData = async () => {
  // const { data, status, message, messageDetails } =
  //   await AuthSDK.internalFetcher("GETPUSHNOTIFTEMPLATEGRID", {
  //     CONFIRMED: "ALL",/////////////
  //   });
  // if (status === "0") {
  //   return data;
  // } else {
  //   throw DefaultErrorObject(message, messageDetails);
  // }
  return [
    {
      SR_NO: "002",
      NAME: "N1",
      CUST_ID: "158",
      MOBILE_NO: "01212311454",
    },
    {
      SR_NO: "003",
      NAME: "N1",
      CUST_ID: "158",
      MOBILE_NO: "01212311454",
    },
    {
      SR_NO: "004",
      NAME: "N1",
      CUST_ID: "158",
      MOBILE_NO: "01212311454",
    },
    {
      SR_NO: "005",
      NAME: "N1",
      CUST_ID: "158",
      MOBILE_NO: "01212311454",
    },
    {
      SR_NO: "006",
      NAME: "N1",
      CUST_ID: "158",
      MOBILE_NO: "01212311454",
    },
    {
      SR_NO: "007",
      NAME: "N1",
      CUST_ID: "158",
      MOBILE_NO: "01212311454",
    },
    {
      SR_NO: "008",
      NAME: "N1",
      CUST_ID: "158",
      MOBILE_NO: "01212311454",
    },
    {
      SR_NO: "009",
      NAME: "N1",
      CUST_ID: "158",
      MOBILE_NO: "01212311454",
    },
    {
      SR_NO: "010",
      NAME: "N1",
      CUST_ID: "158",
      MOBILE_NO: "01212311454",
    },
    {
      SR_NO: "011",
      NAME: "N1",
      CUST_ID: "158",
      MOBILE_NO: "01212311454",
    },
    {
      SR_NO: "012",
      NAME: "N1",
      CUST_ID: "158",
      MOBILE_NO: "01212311454",
    },
    {
      SR_NO: "013",
      NAME: "N1",
      CUST_ID: "158",
      MOBILE_NO: "01212311454",
    },
  ];
};
