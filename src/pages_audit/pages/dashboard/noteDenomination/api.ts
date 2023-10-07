import { DefaultErrorObject } from "components/utils";

export const CashReceiptEntrysData = async () => {
  // const { data, status, message, messageDetails } =
  //   await AuthSDK.internalFetcher("GETTRANSACTIONDETAILS", {
  //     COMP_CD: COMP_CD,
  //     BRANCH_CD: BRANCH_CD,
  //   });.

  const status = "0";
  return [
    {
      NOTE: "2000",
      NOTE_CNT: 0,
      AMOUNT: "0",
      AVAIL_NOTE: "02",
      TOTAL_AMNT: "4000",
      ID: 1,
    },
    {
      NOTE: "500",
      NOTE_CNT: 0,
      AMOUNT: "0",
      AVAIL_NOTE: "04",
      TOTAL_AMNT: "2000",
      ID: 2,
    },
    {
      NOTE: "200",
      NOTE_CNT: 0,
      AMOUNT: "0",
      AVAIL_NOTE: "10",
      TOTAL_AMNT: "2000",
      ID: 3,
    },
    {
      NOTE: "100",
      NOTE_CNT: 0,
      AMOUNT: "0",
      AVAIL_NOTE: "20",
      TOTAL_AMNT: "2000",
      ID: 4,
    },
    {
      NOTE: "50",
      NOTE_CNT: 0,
      AMOUNT: "0",
      AVAIL_NOTE: "10",
      TOTAL_AMNT: "500",
      ID: 5,
    },
    {
      NOTE: "20",
      NOTE_CNT: 0,
      AMOUNT: "0",
      AVAIL_NOTE: "40",
      TOTAL_AMNT: "800",
      ID: 6,
    },
    {
      NOTE: "10",
      NOTE_CNT: 0,
      AMOUNT: "0",
      AVAIL_NOTE: "44",
      TOTAL_AMNT: "440",
      ID: 7,
    },
    {
      NOTE: "5",
      NOTE_CNT: 0,
      AMOUNT: "0",
      AVAIL_NOTE: "30",
      TOTAL_AMNT: "150",
      ID: 8,
    },
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
  ];
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
