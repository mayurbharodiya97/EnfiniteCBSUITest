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
      responseData = responseData.map((items) => ({
        ...items,
        PENDING_FLAG: items.PENDING_FLAG === "Y" ? "Confirmed" : "Pending",
        REALIZE_FLAG: items.PENDING_FLAG === "Y" ? "Confirmed" : "Pending",
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
