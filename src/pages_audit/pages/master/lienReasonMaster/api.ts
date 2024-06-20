import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";

export const getLienReasonMstData = async ({ companyID, branchCode }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLIENRSNMSTDATADISP", {
      COMP_CD: companyID,
      BRANCH_CD: branchCode,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const LienReasonMstDataDML = async (formData) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "DOLIENREASONMSTDATA",
    formData
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
