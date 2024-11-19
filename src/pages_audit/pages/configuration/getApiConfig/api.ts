import { DefaultErrorObject } from "@acuteinfo/common-base";
import { AuthSDK } from "registry/fns/auth";

export const getDynamicApiList = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDYNAPILIST", {});
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const savedynamicAPIconfig = async ({ ...reqData }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DOAPICONFIGDATA", { ...reqData });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
