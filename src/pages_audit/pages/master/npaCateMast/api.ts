import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getNpaCategoryMasterGridData = async (reqData: any) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETNPACATMSTDATADISP", {
      COMP_CD: reqData?.companyID,
      BRANCH_CD: reqData?.branchCode,
    });
  if (status === "0") {
    return data?.map((item: any) => {
      return {
        ...item,
        SECURE_PROV_PERC: item?.SECURE_PROV_PERC === "0" ? ".00" : "",
        UNSECURE_PROV_PERC: item?.UNSECURE_PROV_PERC === "0" ? ".00" : "",
      };
    });
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
