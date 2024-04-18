import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const stockConfirmGrid = async (apiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSTOCKCNFDATADISP", { ...apiReq });
  if (status === "0") {
    // return data;

    const dataStatus = data;
    dataStatus.map((item) => {
      item.STOCK_VALUE = item.STOCK_VALUE
        ? parseFloat(item.STOCK_VALUE).toFixed(2)
        : "0.00";
      item.MARGIN = item.MARGIN ? parseFloat(item.MARGIN).toFixed(2) : "0.00";
      item.DRAWING_POWER = item.DRAWING_POWER
        ? parseFloat(item.DRAWING_POWER).toFixed(2)
        : "0.00";

      item.FULL_ACCT_NO =
        item.BRANCH_CD + " " + item.ACCT_TYPE + " " + item.ACCT_CD;
      return item;
    });
    return dataStatus;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
