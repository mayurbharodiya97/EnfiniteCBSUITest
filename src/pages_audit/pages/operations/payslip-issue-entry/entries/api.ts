import { DefaultErrorObject } from "@acuteinfo/common-base";
import { AuthSDK } from "registry/fns/auth";

export const retRiveGridData = async ({
  A_COMP_CD,
  A_ENT_BRANCH_CD,
  A_BRANCH_CD,
  A_PAYSLIP_NO,
  A_DEF_TRAN_CD,
  A_ENTRY_MODE,
  ALL_BRANCH,
  A_TRAN_TYPE,
  A_GD_DATE,
  A_USER,
  A_USER_LEVEL,
  A_SCREEN_REF,
  A_LANG,
}) => {
  const { data, status, message } = await AuthSDK.internalFetcher(
    "GETPAYSLIPREALIZERETRIVEGRID",
    {
      A_COMP_CD,
      A_ENT_BRANCH_CD,
      A_BRANCH_CD,
      A_PAYSLIP_NO,
      A_DEF_TRAN_CD,
      A_ENTRY_MODE,
      ALL_BRANCH,
      A_TRAN_TYPE,
      A_GD_DATE,
      A_USER,
      A_USER_LEVEL,
      A_SCREEN_REF,
      A_LANG,
    }
  );
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      const totals = responseData.reduce<Record<string, number>>((acc, obj) => {
        const amount = parseFloat(obj.AMOUNT || "0");
        acc[obj.TRAN_CD] = (acc[obj.TRAN_CD] || 0) + amount;
        return acc;
      }, {} as Record<string, number>);

      responseData = responseData.map((items, index) => ({
        ...items,
        INDEX: `${index}`,
        PENDING_FLAG: items.PENDING_FLAG === "Y" ? "Confirmed" : "Pending",
        PENDING_FLAG_DISP: items.PENDING_FLAG,
        REALIZE_FLAG: items.REALIZE_FLAG === "Y" ? "Confirmed" : "Pending",
        TOTAL_AMT: `${totals[items.TRAN_CD]}`,
      }));
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message);
  }
};
export const getRealizedHeaderData = async ({
  COMP_CD,
  BRANCH_CD,
  TRAN_CD,
  SR_CD,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETPAYSLIPREALIZEHDR", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      TRAN_CD: TRAN_CD,
      SR_CD: SR_CD,
    });

  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map((items) => ({
        ...items,
      }));
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getGstCalcAmount = async ({
  COMP_CD,
  BRANCH_CD,
  ACCT_TYPE,
  ACCT_CD,
  AMOUNT,
  ENT_BRANCH_CD,
  MODULE,
  ASON_DT,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCALCGSTAMT", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      ACCT_TYPE: ACCT_TYPE,
      ACCT_CD: ACCT_CD,
      AMOUNT: AMOUNT,
      ENT_BRANCH_CD: ENT_BRANCH_CD,
      MODULE: MODULE,
      ASON_DT: ASON_DT,
    });

  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getStopPaymentReasonData = async ({
  COMP_CD: COMP_CD,
  BRANCH_CD: BRANCH_CD,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSTPREASONDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      RETURN_TYPE: "CLG",
    });

  if (status === "0") {
    if (status === "0") {
      let responseData = data;
      if (Array.isArray(responseData)) {
        responseData = responseData.map(
          ({ DISLAY_REASON, REASON_CD, ...items }) => {
            return {
              ...items,
              value: REASON_CD,
              label: DISLAY_REASON,
            };
          }
        );
      }
      return responseData;
    }
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const ddTransactionSave = async ({ ...reqPara }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCALCGSTAMT", {
      ...reqPara,
    });

  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const payslipRealizeEntrySave = async ({ ...reqPara }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DOPAYSLIPREALIZEENTRY", {
      ...reqPara,
    });

  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const DoddTransactionConfirmation = async ({ ...reqPara }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DOPAYSLIPDDTRANSACTIONENTRY", {
      ...reqPara,
    });

  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};