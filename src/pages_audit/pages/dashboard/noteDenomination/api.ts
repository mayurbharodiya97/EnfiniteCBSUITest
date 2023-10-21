import { DefaultErrorObject } from "components/utils";
import { AddIDinResponseData, utilFunction } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const CashReceiptEntrysData = async ({ a, b }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETTRANSACTIONDETAILS", {
      COMP_CD: a,
      BRANCH_CD: b,
    });

  // const status = "0";
  return [
    {
      NOTE: "2000",
      NOTE_CNT: 0,
      AMOUNT: "0",
      AVAIL_NOTE: "04",
      TOTAL_AMNT: "8000",
      ID: 1,
    },
    {
      NOTE: "500",
      NOTE_CNT: 0,
      AMOUNT: "0",
      AVAIL_NOTE: "10",
      TOTAL_AMNT: "5000",
      ID: 2,
    },
    {
      NOTE: "200",
      NOTE_CNT: 0,
      AMOUNT: "0",
      AVAIL_NOTE: "20",
      TOTAL_AMNT: "4000",
      ID: 3,
    },
    {
      NOTE: "100",
      NOTE_CNT: 0,
      AMOUNT: "0",
      AVAIL_NOTE: "40",
      TOTAL_AMNT: "4000",
      ID: 4,
    },
    {
      NOTE: "50",
      NOTE_CNT: 0,
      AMOUNT: "0",
      AVAIL_NOTE: "20",
      TOTAL_AMNT: "1000",
      ID: 5,
    },
    {
      NOTE: "20",
      NOTE_CNT: 0,
      AMOUNT: "0",
      AVAIL_NOTE: "80",
      TOTAL_AMNT: "1600",
      ID: 6,
    },
    {
      NOTE: "10",
      NOTE_CNT: 0,
      AMOUNT: "0",
      AVAIL_NOTE: "88",
      TOTAL_AMNT: "880",
      ID: 7,
    },
    {
      NOTE: "5",
      NOTE_CNT: 0,
      AMOUNT: "0",
      AVAIL_NOTE: "60",
      TOTAL_AMNT: "300",
      ID: 8,
    },
  ];
  // {
  //   NOTE: "2",
  //   NOTE_CNT: 0,
  //   AMOUNT: "0",
  //   AVAIL_NOTE: "8",
  //   TOTAL_AMNT: "16",
  //   ID: 9,
  // },
  // {
  //   NOTE: "1",
  //   NOTE_CNT: 0,
  //   AMOUNT: "0",
  //   AVAIL_NOTE: "100",
  //   TOTAL_AMNT: "120",
  //   ID: 10,
  // },
  // {
  //   NOTE: "10000",
  //   NOTE_CNT: 0,
  //   AMOUNT: "0",
  //   AVAIL_NOTE: "10",
  //   TOTAL_AMNT: "100000",
  //   ID: 11,
  // },
  // if (status === "0") {
  //   return data.map((items) => {
  //     return {
  //       NOTE: items.NOTE,
  //       NOTE_CNT: 0ems.NOTE_CNT,0//       AMOUNT: items.AMOUNT,
  //       AVAIL_NOTE: items.AVAIL_NOTE,
  //       TOTAL_AMNT: items.TOTAL_AMNT,
  //     };
  //   });
  // } else {
  //   throw DefaultErrorObject("you have occur error");
  // }
};

export const getCustomerActivationData = async ({ regWith, accountCardNo }) => {
  if (!Boolean(regWith)) {
    throw DefaultErrorObject(
      "Required value missing for Activation Using.",
      "",
      "warning"
    );
  } else if (!Boolean(accountCardNo)) {
    throw DefaultErrorObject(
      "Required value missing for Account/Card Number.",
      "",
      "warning"
    );
  } else {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETCUSTOMERACTIVATIONDATA", {
        ACCT_NO: accountCardNo,
        REG_WITH: regWith,
      });
    if (status === "0") {
      let responsedata = data;
      if (Array.isArray(responsedata)) {
        let allKeyData = responsedata?.[0]?.ALL_ACCOUNT_DETAIL;
        if (Array.isArray(allKeyData)) {
          allKeyData = AddIDinResponseData(allKeyData);
          let repdat = { gender: { F: "Female", M: "Male" } };
          allKeyData = utilFunction.ChangeJsonValue(allKeyData, repdat);
          responsedata[0]["ALL_ACCOUNT_DETAIL"] = allKeyData;
        }
      }
      return responsedata;
      //return data;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  }
};
