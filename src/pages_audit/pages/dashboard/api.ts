import { DefaultErrorObject } from "components/utils";
import { format } from "date-fns";
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
          APINAME: "",
          BACKGROUND: "",
          DISPLAY_SEQ: "7",
        },
        {
          TITLE: "Follow Up",
          ICON: "user-clock",
          DEFAULT: "4",
          APINAME: "",
          BACKGROUND: "",
          DISPLAY_SEQ: "5",
        },
        {
          TITLE: "Reject Transactions",
          ICON: "user-lock",
          DEFAULT: "1",
          APINAME: "",
          BACKGROUND: "",
          DISPLAY_SEQ: "4",
        },
        {
          TITLE: "Reject Request",
          ICON: "users",
          DEFAULT: "1",
          APINAME: "",
          BACKGROUND: "",
          DISPLAY_SEQ: "6",
        },
        {
          TITLE: "Pending Request",
          ICON: "users",
          DEFAULT: "1",
          APINAME: "",
          BACKGROUND: "",
          DISPLAY_SEQ: "2",
        },
        {
          TITLE: "Confirm Requet",
          ICON: "users",
          DEFAULT: "286518",
          APINAME: "",
          BACKGROUND: "",
          DISPLAY_SEQ: "3",
        },
        {
          TITLE: "Confirmed Transactions",
          ICON: "users",
          DEFAULT: "3699",
          APINAME: "",
          BACKGROUND: "",
          DISPLAY_SEQ: "1",
        },
      ],
      MESSAGE_BOX: {
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
// export const getDashboardDatas = () => {};

export const QuickAccessTableGridData = async ({
  userID,
  COMP_CD,
  BRANCH_CD,
  BASE_BRANCH_CD,
  GROUP_NAME,
  APP_TRAN_CD,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETQUICKACCESS", {
      USER_NM: userID,
      MACHINE_IP: "",
      COMP_CD: COMP_CD,
      BASE_BRANCH_CD: BASE_BRANCH_CD,
      BRANCH_CD: BRANCH_CD,
      ENTERED_DATE: format(new Date(), "dd/MMM/yyyy"),
      GROUP_NAME: GROUP_NAME,
      IMG_PATH: "",
      FLAG: "FAVORITE",
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
      FROM_DT: format(new Date(), "dd/MMM/yyyy"),
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
