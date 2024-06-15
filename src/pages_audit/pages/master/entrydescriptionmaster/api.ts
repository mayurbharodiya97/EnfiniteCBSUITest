import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getEntryDescMasterGridData = async (reqData: any) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETENTDESCMSTDATADISP", {
      COMP_CD: reqData?.companyID,
      BRANCH_CD: reqData?.branchCode,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
