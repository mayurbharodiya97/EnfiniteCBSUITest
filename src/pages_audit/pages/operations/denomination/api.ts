import { format } from "date-fns";
import { DefaultErrorObject } from "@acuteinfo/common-base";
import { AuthSDK } from "registry/fns/auth";

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
      COMP_CD: reqData?.COMP_CD,
      BRANCH_CD: reqData?.BRANCH_CD,
      ACCT_TYPE: reqData?.ACCT_TYPE,
      ACCT_CD: reqData.ACCT_CD,
      CHEQUE_NO: reqData?.CHEQUE_NO,
      TYPE_CD: reqData?.TYPE_CD,
      SCREEN_REF: reqData?.SCREEN_REF,
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
      ENTRY_TYPE: reqData?.ENTRY_TYPE ?? "",
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
// export const saveDenoData = async (reqData) => {
//   const { data, status, message, messageDetails } =
//     await AuthSDK.internalFetcher("CHEQUENOVALIDATION", {
//       SCREEN_REF: reqData?.SCREEN_REF ?? "",
//       TRANSACTION_DTL: {
//         isNewRow: [
//           {
//             BRANCH_CD: "099 ",
//             ACCT_TYPE: "0002",
//             ACCT_CD: "000005              ",
//             TYPE_CD: "1",
//             COMP_CD: "132 ",
//             CHEQUE_NO: "",
//             SDC: "1",
//             SCROLL1: "",
//             CHEQUE_DT: "",
//             REMARKS: "1 BY CASH -",
//             AMOUNT: "1000.00",
//           },
//         ],
//         isUpdatedRow: [],
//         isDeleteRow: [],
//       },
//       CASH_DENOMINATION_DTL: {
//         isNewRow: [
//           {
//             TYPE_CD: "1",
//             DENO_QTY: "1",
//             DENO_TRAN_CD: "1",
//             DENO_VAL: "2000",
//             AMOUNT: "2000",
//           },
//           {
//             TYPE_CD: "1",
//             DENO_QTY: "-1",
//             DENO_TRAN_CD: "1",
//             DENO_VAL: "2000",
//             AMOUNT: "2000",
//           },
//           {
//             TYPE_CD: "1",
//             DENO_QTY: "3",
//             DENO_TRAN_CD: "3",
//             DENO_VAL: "200",
//             AMOUNT: "600",
//           },
//           {
//             TYPE_CD: "1",
//             DENO_QTY: "-2",
//             DENO_TRAN_CD: "5",
//             DENO_VAL: "50",
//             AMOUNT: "100",
//           },
//           {
//             TYPE_CD: "1",
//             DENO_QTY: "20",
//             DENO_TRAN_CD: "6",
//             DENO_VAL: "20",
//             AMOUNT: "400",
//           },
//           {
//             TYPE_CD: "1",
//             DENO_QTY: "1",
//             DENO_TRAN_CD: "4",
//             DENO_VAL: "100",
//             AMOUNT: "100",
//           },
//         ],
//         isUpdatedRow: [],
//         isDeleteRow: [],
//       },
//     });
//   if (status === "0") {
//     return data;
//   } else {
//     throw DefaultErrorObject(message, messageDetails);
//   }
// };

export const getAmountValidation = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("VALIDATECREDITDEBITAMT", {
      ...reqData,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const checkTokenValidate = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("CHECKTOKENVALIDATE", reqData);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getChqDateValidation = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("VALIDATECHQDATE", {
      BRANCH_CD: reqData?.BRANCH_CD ?? "", //099
      TYPE_CD: reqData?.TYPE_CD ?? "", //5
      CHEQUE_NO: reqData?.CHEQUE_NO ?? "", //33
      CHEQUE_DT: format(new Date(reqData?.CHEQUE_DT), "dd/MMM/yyyy"), //06/Mar/2024
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

interface reqObjTypes {
  reqData: any;
  controllerFinal?: any;
}

export const getTabsByParentType = async (reqObj: reqObjTypes) => {
  const { reqData, controllerFinal } = reqObj;
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(
      "GETDLYTRNTABFIELDDISP",
      {
        COMP_CD: reqData?.COMP_CD,
        ACCT_TYPE: reqData?.ACCT_TYPE,
        BRANCH_CD: reqData?.BRANCH_CD,
      },
      {},
      null,
      controllerFinal
    );

  if (status === "0") {
    data?.map((a, i) => {
      a.index1 = i;
    });

    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getCarousalCards = async (reqObj: reqObjTypes) => {
  const { reqData, controllerFinal } = reqObj;
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(
      "DAILYTRNCARDDTL",
      {
        PARENT_TYPE: reqData?.PARENT_TYPE,
        COMP_CD: reqData?.COMP_CD,
        ACCT_TYPE: reqData?.ACCT_TYPE,
        ACCT_CD: reqData?.ACCT_CD,
        BRANCH_CD: reqData?.BRANCH_CD,
      },
      {},
      null,
      controllerFinal
    );
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
