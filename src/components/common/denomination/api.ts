import { DefaultErrorObject } from "components/utils";

export const CashReceiptEntrysData = async () => {
  // const { data, status, message, messageDetails } =
  //   await AuthSDK.internalFetcher("GETTRANSACTIONDETAILS", {
  //     COMP_CD: COMP_CD,
  //     BRANCH_CD: BRANCH_CD,
  //   });.

  return [
    {
      NOTE: "2000",
      NOTE_CNT: "",
      AMOUNT: "0",
      AVAIL_NOTE: "01",
      TOTAL_AMNT: "4000",
      ID: 1,
    },
    {
      NOTE: "500",
      NOTE_CNT: "",
      AMOUNT: "0",
      AVAIL_NOTE: "04",
      TOTAL_AMNT: "5000",
      ID: 2,
    },
    {
      NOTE: "200",
      NOTE_CNT: "",
      AMOUNT: "0",
      AVAIL_NOTE: "10",
      TOTAL_AMNT: "10000",
      ID: 3,
    },
    {
      NOTE: "100",
      NOTE_CNT: "",
      AMOUNT: "0",
      AVAIL_NOTE: "21",
      TOTAL_AMNT: "12000",
      ID: 4,
    },
    {
      NOTE: "50",
      NOTE_CNT: "",
      AMOUNT: "0",
      AVAIL_NOTE: "11",
      TOTAL_AMNT: "4050",
      ID: 5,
    },
    {
      NOTE: "20",
      NOTE_CNT: "",
      AMOUNT: "0",
      AVAIL_NOTE: "45",
      TOTAL_AMNT: "18020",
      ID: 6,
    },
    {
      NOTE: "10",
      NOTE_CNT: "",
      AMOUNT: "0",
      AVAIL_NOTE: "50",
      TOTAL_AMNT: "1200",
      ID: 7,
    },
    {
      NOTE: "5",
      NOTE_CNT: "",
      AMOUNT: "0",
      AVAIL_NOTE: "3",
      TOTAL_AMNT: "1000",
      ID: 8,
    },
    {
      NOTE: "2",
      NOTE_CNT: "",
      AMOUNT: "0",
      AVAIL_NOTE: "8",
      TOTAL_AMNT: "16",
      ID: 9,
    },
    {
      NOTE: "1",
      NOTE_CNT: "",
      AMOUNT: "0",
      AVAIL_NOTE: "100",
      TOTAL_AMNT: "120",
      ID: 10,
    },
    {
      NOTE: "10000",
      NOTE_CNT: "",
      AMOUNT: "0",
      AVAIL_NOTE: "100",
      TOTAL_AMNT: "120",
      ID: 11,
    },
  ];
  // if (status === "0") {
  //   return data.map((items) => {
  //     return {
  //       NOTE: items.NOTE,
  //       NOTE_CNT: items.NOTE_CNT,
  //       AMOUNT: items.AMOUNT,
  //       AVAIL_NOTE: items.AVAIL_NOTE,
  //       TOTAL_AMNT: items.TOTAL_AMNT,
  //     };
  //   });
  // } else {
  //   throw DefaultErrorObject("you have occur error");
  // }
};
