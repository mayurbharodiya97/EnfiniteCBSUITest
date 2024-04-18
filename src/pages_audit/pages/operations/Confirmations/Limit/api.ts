import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const limitConfirmGrid = async (apiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLMTCNFDATADISP", { ...apiReq });
  if (status === "0") {
    // return data;

    const dataStatus = data;
    dataStatus.map((item) => {
      item.INT_RATE = item.INT_RATE
        ? parseFloat(item.INT_RATE).toFixed(2)
        : "0.00";
      item.PENAL_RATE = item.PENAL_RATE
        ? parseFloat(item.PENAL_RATE).toFixed(2)
        : "0.00";
      item.AD_HOC_LIMIT_FLG =
        item.AD_HOC_LIMIT_FLG === "N"
          ? "Normal Limit"
          : item.AD_HOC_LIMIT_FLG === "A"
          ? "Ad-Hoc Limit"
          : null;
      item.STATUS_FLAG =
        item.STATUS_FLAG === "A"
          ? "Active"
          : item.STATUS_FLAG === "E"
          ? "Expired"
          : null;
      item.FULL_ACCT_NO =
        item.BRANCH_CD + " " + item.ACCT_TYPE + " " + item.ACCT_CD;
      return item;
    });
    return dataStatus;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
