export const StatementDetailsData = async () => {
  // const { data, status, message, messageDetails } =
  //   await AuthSDK.internalFetcher("GETQUICKACCESS", {
  //     COMP_CD: COMP_CD,
  //     BASE_BRANCH_CD: BASE_BRANCH_CD,
  //     ASON_DT: format(new Date(), "dd/MMM/yyyy"),
  //     GROUP_NAME: GROUP_NAME,
  //     IMG_PATH: "",
  //     FLAG: FLAG.toUpperCase(),
  //     APP_TRAN_CD: APP_TRAN_CD,
  //   });
  // if (status === "0") {
  //   return data;
  // } else {
  //   throw DefaultErrorObject(message, messageDetails);
  // }
  return [
    {
      DATE: "17/06/2022",
      NARRATION: "SHARE TRN BY CASH",
      CHEQUE_NO: "466465456",
      DEBIT: "10000.00",
      CREDIT: "",
      BALANCE: "50000.00",
      TR_BR: "",
      ID: "1",
      VALUE_DATE: "01/03/2022",
    },
    {
      DATE: "17/06/2022",
      NARRATION: "SHARE TRN BY CASH",
      CHEQUE_NO: "0",
      DEBIT: "",
      CREDIT: "50000",
      BALANCE: "5000",
      TR_BR: "099",
      ID: "2",
      VALUE_DATE: "15/12/2022",
    },
    {
      DATE: "19/06/2022",
      NARRATION: "SHARE TRN BY ABC",
      CHEQUE_NO: "5",
      DEBIT: "",
      CREDIT: "100000",
      BALANCE: "100000",
      TR_BR: "077",
      ID: "3",
      VALUE_DATE: "01/04/2022",
    },
    {
      DATE: "19/06/2022",
      NARRATION: "SHARE TRN BY DEF",
      CHEQUE_NO: "5",
      DEBIT: "",
      CREDIT: "1000000",
      BALANCE: "1000000",
      TR_BR: "088",
      ID: "4",
      VALUE_DATE: "01/08/2022",
    },
  ];
};
