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
  FLAG,
}) => {
  console.log("~~~~~~~~", FLAG.toUpperCase());
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETQUICKACCESS", {
      COMP_CD: COMP_CD,
      BASE_BRANCH_CD: BASE_BRANCH_CD,
      BRANCH_CD: BRANCH_CD,
      USER_NM: "ajayj",
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

// export const TodaysTransactionTableGrid = async () => {
//   return [
//     {
//       TYPE_CD: "3   ",
//       TRAN_CD: "1392",
//       AMOUNT: "4",
//       "TO_CHAR(TRAN_DT,'HH24:MI￼S')": "00:00:00",
//       REMARKS: "INT ON CLOSING DEC-22-FEB-23",
//       ACCT_CD: "00018194            ",
//       ACCT_TYPE: "1001",
//     },
//     {
//       TYPE_CD: "6   ",
//       TRAN_CD: "1393",
//       AMOUNT: "4",
//       "TO_CHAR(TRAN_DT,'HH24:MI￼S')": "00:00:00",
//       REMARKS: "INT 02/23 OF A/C 0002100100018194",
//       ACCT_CD: "00009136            ",
//       ACCT_TYPE: "PL  ",
//     },
//     {
//       TYPE_CD: "5   ",
//       TRAN_CD: "1489",
//       AMOUNT: "50000",
//       "TO_CHAR(TRAN_DT,'HH24:MI￼S')": "00:00:00",
//       REMARKS: "INW.RET.:-4730002110100004049CHQ NO:- 851511",
//       ACCT_CD: "00000001            ",
//       ACCT_TYPE: "8887",
//     },
//     {
//       TYPE_CD: "2   ",
//       TRAN_CD: "1490",
//       AMOUNT: "50000",
//       "TO_CHAR(TRAN_DT,'HH24:MI￼S')": "00:00:00",
//       REMARKS: "INW.RET.:-4730002110100004049CHQ NO:- 851511",
//       ACCT_CD: "00004049            ",
//       ACCT_TYPE: "1101",
//     },
//     {
//       TYPE_CD: "5   ",
//       TRAN_CD: "1491",
//       AMOUNT: "50000",
//       "TO_CHAR(TRAN_DT,'HH24:MI￼S')": "00:00:00",
//       REMARKS: "INW.RET.:-4730002110100004049CHQ NO:- 851511",
//       ACCT_CD: "00004049            ",
//       ACCT_TYPE: "1101",
//     },
//     {
//       TYPE_CD: "4   ",
//       TRAN_CD: "933",
//       AMOUNT: "2500",
//       "TO_CHAR(TRAN_DT,'HH24:MI￼S')": "00:00:00",
//       REMARKS: "TO CASH -SELF",
//       ACCT_CD: "00000035            ",
//       ACCT_TYPE: "1508",
//     },
//     {
//       TYPE_CD: "5   ",
//       TRAN_CD: "1209",
//       AMOUNT: "123528",
//       "TO_CHAR(TRAN_DT,'HH24:MI￼S')": "00:00:00",
//       REMARKS: "CTS_CLG:-Mrs YASMIN AMIR NATHANI",
//       ACCT_CD: "00003931            ",
//       ACCT_TYPE: "1101",
//     },
//     {
//       TYPE_CD: "5   ",
//       TRAN_CD: "1417",
//       AMOUNT: "498797",
//       "TO_CHAR(TRAN_DT,'HH24:MI￼S')": "00:00:00",
//       REMARKS: "CTS_CLG:-J T CO",
//       ACCT_CD: "00004226            ",
//       ACCT_TYPE: "1101",
//     },
//     {
//       TYPE_CD: "5   ",
//       TRAN_CD: "1328",
//       AMOUNT: "89832",
//       "TO_CHAR(TRAN_DT,'HH24:MI￼S')": "00:00:00",
//       REMARKS: "CTS_CLG:-VAIBHAV TOOLS AND HARDWA",
//       ACCT_CD: "00000535            ",
//       ACCT_TYPE: "1101",
//     },
//     {
//       TYPE_CD: "4   ",
//       TRAN_CD: "1394",
//       AMOUNT: "3963",
//       "TO_CHAR(TRAN_DT,'HH24:MI￼S')": "00:00:00",
//       REMARKS: "AC CLOSE SELF",
//       ACCT_CD: "00018194            ",
//       ACCT_TYPE: "1001",
//     },
//   ];
// };
export const TodaysTransactionTableGrid = async ({
  COMP_CD,
  BRANCH_CD,
  userID,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETTRANSACTIONDETAILS", {
      COMP_CD: COMP_CD,
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
