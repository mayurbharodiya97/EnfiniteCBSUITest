import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";

export const getAdvocateMstData = async ({ companyID, branchCode }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETADVOCATEMSTDATADISP", {
      COMP_CD: companyID,
      BRANCH_CD: branchCode,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const advocateMstDataDML = async (formData) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "DOADVOCATEMSTDML",
    formData
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
