import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getDashboardData = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDASHBOARDDATA", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const QuickAccessTableGridData = async ({
  userID,
  COMP_CD,
  BRANCH_CD,
  BASE_BRANCH_CD,
  GROUP_NAME,
  APP_TRAN_CD,
  FLAG,
}) => {
  // console.log("~~~~~~~~", FLAG.toUpperCase());
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETQUICKACCESS", {
      COMP_CD: COMP_CD,
      BASE_BRANCH_CD: BASE_BRANCH_CD,
      BRANCH_CD: BRANCH_CD,
      ASON_DT: "12/may/2023",
      GROUP_NAME: GROUP_NAME,
      IMG_PATH: "",
      FLAG: FLAG.toUpperCase(),
      APP_TRAN_CD: APP_TRAN_CD,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const TodaysTransactionTableGrid = async ({
  COMP_CD,
  BRANCH_CD,
  userID,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETTRANSACTIONDETAILS", {
      COMP_CD: COMP_CD,
      // BASE_BRANCH_CD: BASE_BRANCH_CD,
      ENTERED_BY: userID,
      BRANCH_CD: BRANCH_CD,
      FROM_DT: "08/FEB/2023",
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
