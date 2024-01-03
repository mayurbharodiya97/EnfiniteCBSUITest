import {
  AddIDinResponseData,
  DefaultErrorObject,
  utilFunction,
} from "components/utils";
import { AuthSDK } from "registry/fns/auth";
import { format } from "date-fns"; //format(new Date(), "dd/MMM/yyyy")

export const getSnapShotList = async (reqData) => {
  console.log(reqData, "reqData");
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSANPSHOTDTL", {
      COMP_CD: reqData.COMP_CD,
      BRANCH_CD: reqData.BRANCH_CD,
      ACCT_TYPE: reqData.ACCT_TYPE,

      FROM_ACCT: reqData.ACCT_CD,
      TO_ACCT: reqData.ACCT_CD,
      FROM_DATE: format(new Date(), "dd-MMM-yyyy"),
      TO_DATE: format(new Date(), "dd-MMM-yyyy"),
    });
  if (status === "0") {
    let responseData = data;
    responseData.map((a, i) => {
      a.index = i;
    });
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
