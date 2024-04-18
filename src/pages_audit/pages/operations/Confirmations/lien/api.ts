import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const lienConfirmGrid = async (apiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLIENCNFDATADISP", { ...apiReq });
  if (status === "0") {
    // return data;

    const dataStatus = data;
    dataStatus.map((item) => {
      item.FULL_ACCT_NO =
        item.BRANCH_CD + " " + item.ACCT_TYPE + " " + item.ACCT_CD;
      item.PARENT_CD_NM = item.PARENT_CD + " - " + item.LEAN_NM;
      item.LIEN_STATUS =
        item.LIEN_STATUS === "A"
          ? "Active"
          : item.LIEN_STATUS === "E"
          ? "Expired"
          : null;
      return item;
    });
    return dataStatus;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
