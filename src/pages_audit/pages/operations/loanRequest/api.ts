import { LoanReqGridMetaData } from "./gridMetadata";
import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";

export const getGridFormMetaData =
  ({ gridCode }) =>
  async () => {
    switch (gridCode) {
      case "CCC/001":
        return LoanReqGridMetaData;
      default:
        /* eslint-disable no-throw-literal */
        throw { error_msg: "Invalid Product type" };
    }
  };

export const getLoanReqGridData = async ({ fromDate, toDate, screenID }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("LOANAPPLYREQ", {
      FROM_DATE: fromDate,
      TO_DATE: toDate,
      SCREEN_ID: screenID,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
