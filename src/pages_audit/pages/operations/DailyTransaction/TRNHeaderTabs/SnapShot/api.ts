import {
  AddIDinResponseData,
  DefaultErrorObject,
  utilFunction,
} from "@acuteinfo/common-base";
import { AuthSDK } from "registry/fns/auth";
import { format } from "date-fns"; //format(new Date(), "dd/MMM/yyyy")

export const getSnapShotList = async (reqData) => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSNAPSHOTDTLF1", { ...reqData });
  if (status === "0") {
    let responseData = data;
    responseData.map((a, i) => {
      a.index = i;
      a.sr = i + 1;
      a.debit1 = "0.00";
      a.credit1 = "0.00";

      if (
        a.TYPE_CD.includes("1") ||
        a.TYPE_CD.includes("2") ||
        a.TYPE_CD.includes("3")
      ) {
        if (a.COL_TYPE == "A" || a.COL_TYPE == "Z") {
          a.credit1 = Number(a.AMOUNT).toFixed(2);
          a.debit1 = "0.00";
        } else {
          a.credit1 = "0.00";
          a.debit1 = "0.00";
        }
      }
      if (
        a.TYPE_CD.includes("4") ||
        a.TYPE_CD.includes("5") ||
        a.TYPE_CD.includes("6")
      ) {
        if (a.COL_TYPE == "A" || a.COL_TYPE == "Z") {
          a.debit1 = Number(a.AMOUNT).toFixed(2);
          a.credit1 = "0.00";
        } else {
          a.debit1 = "0.00";
          a.credit1 = "0.00";
        }
      }
    });
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
