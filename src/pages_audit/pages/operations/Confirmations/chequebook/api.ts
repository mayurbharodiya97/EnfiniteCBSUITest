import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getChequeBookFlag = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETRETRIVECHQBKFLAG", {});
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const chequeBkConfirmGrid = async (apiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCHQCNFDATADISP", { ...apiReq });
  if (status === "0") {
    // return data;

    const dataStatus = data;
    dataStatus.map((item) => {
      item.SERVICE_TAX = item.SERVICE_TAX
        ? parseFloat(item.SERVICE_TAX).toFixed(2)
        : "0.00";
      item.FULL_ACCT_NO =
        item.BRANCH_CD + " " + item.ACCT_TYPE + " " + item.ACCT_CD;
      item.CHEQUE_SERIES = item.CHEQUE_FROM + " - " + item.CHEQUE_TO;
      return item;
    });
    return dataStatus;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
