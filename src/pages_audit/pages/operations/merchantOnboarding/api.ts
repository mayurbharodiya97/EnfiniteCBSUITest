import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getMerchantOnboardinggridData = async (compCode) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETMERCHONBOARDGRID", {
      COMP_CD: compCode,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
