import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const stopPayConfirmGrid = async (apiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSTOPCNFDATADISP", { ...apiReq });
  if (status === "0") {
    // return data;

    const dataStatus = data;
    dataStatus.map((item) => {
      item.CHEQUE_FROM_TO = item.CHEQUE_FROM + " - " + item.CHEQUE_TO;

      item.FULL_ACCT_NO =
        item.BRANCH_CD + " " + item.ACCT_TYPE + " " + item.ACCT_CD;
      return item;
    });
    return dataStatus;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
