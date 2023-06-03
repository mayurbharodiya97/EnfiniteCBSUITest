import { DefaultErrorObject } from "components/utils";
import { format } from "date-fns";
import { useEffect } from "react";
import { AuthSDK } from "registry/fns/auth";

export const getDashboardQuickCardData = async () => {
  // const { data, status, message, messageDetails } =
  //   await AuthSDK.internalFetcher("GETDASHBOARDDATA", {});
  // if (status === "0") {
  //   return data;
  // } else {
  //   throw DefaultErrorObject(message, messageDetails);
  // }
  return [
    {
      BOXES: [
        {
          TITLE: "Follow Up done",
          ICON: "users",
          DEFAULT: "4",
          APINAME: "GETDYNAMICDATA/GETTOTALCUSTOMERDASH",
          BACKGROUND: "",
          DISPLAY_SEQ: "7",
        },
        {
          TITLE: "Follow Up",
          ICON: "user-clock",
          DEFAULT: "4",
          APINAME: "GETDYNAMICDATA/GETLOGINCUSTOMERDASH",
          BACKGROUND: "",
          DISPLAY_SEQ: "5",
        },
        {
          TITLE: "Reject Transactions",
          ICON: "user-lock",
          DEFAULT: "1",
          APINAME: "GETDYNAMICDATA/GETBLOCKCUSTOMERDASH",
          BACKGROUND: "",
          DISPLAY_SEQ: "4",
        },
        {
          TITLE: "Reject Request",
          ICON: "users",
          DEFAULT: "1",
          APINAME: "GETDYNAMICDATA/GETLOGINADMINUSERDASH",
          BACKGROUND: "",
          DISPLAY_SEQ: "6",
        },
        {
          TITLE: "Pending Request",
          ICON: "users",
          DEFAULT: "1",
          APINAME: "GETDYNAMICDATA/GETLOGINADMINUSERDASH",
          BACKGROUND: "",
          DISPLAY_SEQ: "2",
        },
        {
          TITLE: "Confirm Requet",
          ICON: "users",
          DEFAULT: "286518",
          APINAME: "GETDYNAMICDATA/GETLOGINADMINUSERDASH",
          BACKGROUND: "",
          DISPLAY_SEQ: "3",
        },
        {
          TITLE: "Confirmed Transactions",
          ICON: "users",
          DEFAULT: "3699",
          APINAME: "GETDYNAMICDATA/GETLOGINADMINUSERDASH",
          BACKGROUND: "",
          DISPLAY_SEQ: "1",
        },
      ],
      ANNOUNCEMENT: {
        ISVISIBLE: true,
      },
      QUICK_ACCESS: {
        ISVISIBLE: true,
      },
      CHART1: {
        ISVISIBLE: true,
      },
      CHART2: {
        ISVISIBLE: true,
      },
      TODAY_TRN: {
        ISVISIBLE: true,
      },
    },
  ];
};

export const QuickAccessTableGridData = async ({
  COMP_CD,
  BASE_BRANCH_CD,
  GROUP_NAME,
  APP_TRAN_CD,
  FLAG,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETQUICKACCESS", {
      COMP_CD: COMP_CD,
      BASE_BRANCH_CD: BASE_BRANCH_CD,
      ASON_DT: format(new Date(), "dd/MMM/yyyy"),
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

export const TodaysTransactionTableGrid = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETTRANSACTIONDETAILS", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
