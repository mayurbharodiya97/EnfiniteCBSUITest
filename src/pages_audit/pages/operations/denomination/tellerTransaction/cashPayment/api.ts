import { DefaultErrorObject } from "@acuteinfo/common-base";
import { AuthSDK } from "registry/fns/auth";

export const getCashPaymentData = async (reqData) => {
  console.log(reqData);

  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCASHPAYMENT", {
      ...reqData,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
