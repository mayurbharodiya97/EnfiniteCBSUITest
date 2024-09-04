import { DefaultErrorObject } from "@acuteinfo/common-base";
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
        SECURE_PROV_PERC:
          item?.SECURE_PROV_PERC === "0" ? ".00" : item?.SECURE_PROV_PERC,
        UNSECURE_PROV_PERC:
          item?.UNSECURE_PROV_PERC === "0" ? ".00" : item?.UNSECURE_PROV_PERC,
      };
    });
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const updateNpaCategoryMasterData = async ({ data: reqdata }) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "DONPACATEGDML",
    {
      ...reqdata,
    }
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
