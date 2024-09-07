import { DefaultErrorObject } from "@acuteinfo/common-base";
import { AuthSDK } from "registry/fns/auth";

export const CashReceiptEntrysData2 = async ({ a, b }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCASHDENO", {
      COMP_CD: a,
      BRANCH_CD: b,
    });

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
      PYNOTE: "500",
      NOTE_CNT: "0",
      AMOUNT: "0",
      AVAIL_NOTE: "10",
      TOTAL_AMNT: "5000",
      ID: 2,
    },
    {
      NOTE: "200",
      PYNOTE: "200",
      NOTE_CNT: "0",
      AMOUNT: "0",
      AVAIL_NOTE: "20",
      TOTAL_AMNT: "4000",
      ID: 3,
    },
    {
      NOTE: "100",
      PYNOTE: "100",
      NOTE_CNT: "0",
      AMOUNT: "0",
      AVAIL_NOTE: "40",
      TOTAL_AMNT: "4000",
      ID: 4,
    },
    {
      NOTE: "50",
      PYNOTE: "50",
      NOTE_CNT: "0",
      AMOUNT: "0",
      AVAIL_NOTE: "20",
      TOTAL_AMNT: "1000",
      ID: 5,
    },
    {
      NOTE: "20",
      PYNOTE: "20",
      NOTE_CNT: "0",
      AMOUNT: "0",
      AVAIL_NOTE: "80",
      TOTAL_AMNT: "1600",
      ID: 6,
    },
    {
      NOTE: "10",
      PYNOTE: "10",
      NOTE_CNT: "0",
      AMOUNT: "0",
      AVAIL_NOTE: "88",
      TOTAL_AMNT: "880",
      ID: 7,
    },
    {
      NOTE: "5",
      PYNOTE: "0",
      AMOUNT: "0",
      NOTE_CNT: "0",
      AVAIL_NOTE: "60",
      TOTAL_AMNT: "300",
      ID: 8,
    },

    {
      NOTE: "2",
      NOTE_CNT: 0,
      AMOUNT: "0",
      AVAIL_NOTE: "8",
      TOTAL_AMNT: "16",
      ID: 9,
    },
    {
      NOTE: "1",
      NOTE_CNT: 0,
      AMOUNT: "0",
      AVAIL_NOTE: "100",
      TOTAL_AMNT: "120",
      ID: 10,
    },
    {
      NOTE: "10000",
      NOTE_CNT: 0,
      AMOUNT: "0",
      AVAIL_NOTE: "10",
      TOTAL_AMNT: "100000",
      ID: 11,
    },
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
  ];
};

export const CashReceiptEntrysData = async ({
  COMP_CD,
  BRANCH_CD,
  USER_NAME,
  TRAN_DT,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCASHDENO", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      USER_NAME: USER_NAME,
      TRAN_DT: TRAN_DT,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getSDCList = async (...authDTL) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSDCLIST", {
      COMP_CD: authDTL[1]?.companyID
        ? authDTL[1]?.companyID
        : authDTL[3]?.companyID,
      BRANCH_CD: authDTL[1]?.user?.branchCode
        ? authDTL[1]?.user?.branchCode
        : authDTL[3]?.user?.branchCode,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ DISLAY_STANDARD, CODE, DESCRIPTION, ...other }) => {
          return {
            ...other,
            CODE: CODE,
            DISLAY_STANDARD: DISLAY_STANDARD,
            value: CODE,
            label: DISLAY_STANDARD,
          };
        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getAcctDTL = async ({
  ACCT_CD,
  ACCT_TYPE,
  BRANCH_CD,
  COMP_CD,
  FULL_ACCT_NO,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTDATA", {
      ACCT_CD: ACCT_CD,
      ACCT_TYPE: ACCT_TYPE,
      BRANCH_CD: BRANCH_CD,
      COMP_CD: COMP_CD,
      FULL_ACCT_NO: FULL_ACCT_NO,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getAccInfoTeller = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDAILYTRANMAKERDTL", {
      // COMP_CD: "132 ",
      // BRANCH_CD: "099 ",
      // ACCT_TYPE: "001 ",
      // ACCT_CD: "000026              ",
      // A_ASON_DT: "15/DEC/2023",
      COMP_CD: reqData.COMP_CD,
      BRANCH_CD: reqData.BRANCH_CD,
      ACCT_TYPE: reqData.ACCT_TYPE,
      ACCT_CD: reqData.ACCT_CD.padEnd(20, " "),
      A_ASON_DT: reqData.A_ASON_DT,
    });
  if (status === "0") {
    let responseData = data;
    return responseData[0];
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

// export const cashReportData = async (otherAPIRequestPara) => {
//   // console.log(COMP_CD, "COMP_CD,", BRANCH_CD, "BRANCH_CD,");
//   const { data, status, message, messageDetails } =
//     await AuthSDK.internalFetcher("GETTODAYTRANDATA", otherAPIRequestPara);
//   if (status === "0") {
//     const dataStatus = data;
//     dataStatus.map((item) => {
//       if (item?.CONFIRM === "Y") {
//         item._rowColor = "rgb(9 132 3 / 51%)";
//       }
//       if (item?.CONFIRM === "0") {
//         item._rowColor = "rgb(152 59 70 / 61%)";
//       }
//     });
//     return dataStatus;
//   } else {
//     throw DefaultErrorObject(message, messageDetails);
//   }
// };

export const cashReportData = async (reportID, filter, otherAPIRequestPara) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETTODAYTRANDATA", otherAPIRequestPara);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getChqValidation = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("CHEQUENOVALIDATION", {
      // COMP_CD: reqData?.branch?.info?.COMP_CD,
      BRANCH_CD: reqData?.BRANCH_CD,
      ACCT_TYPE: reqData?.ACCT_TYPE,
      ACCT_CD: reqData.ACCT_CD,
      CHEQUE_NO: reqData?.CHEQUE_NO,
      TYPE_CD: reqData?.TYPE_CD,
      SCREEN_REF: "TRN/039",
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const saveDenoData = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("SAVERECEIPTPAYMENTDTL", {
      SCREEN_REF: reqData?.SCREEN_REF ?? "",
      TRANSACTION_DTL: {
        isNewRow: [...reqData?.TRN_DTL],
        isUpdatedRow: [],
        isDeleteRow: [],
      },
      CASH_DENOMINATION_DTL: {
        isNewRow: [...reqData?.DENO_DTL],
        isUpdatedRow: [],
        isDeleteRow: [],
      },
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getTokenValidation = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("CHECKTOKENVALIDATE", {
      COMP_CD: reqData?.COMP_CD,
      BRANCH_CD: reqData?.BRANCH_CD,
      ACCT_TYPE: reqData?.ACCT_TYPE,
      ACCT_CD: reqData?.ACCT_CD,
      TOKEN_NO: reqData?.TOKEN_NO,
      SCREEN_REF: reqData?.SCREEN_REF,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
