import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getDashboardData = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDASHBOARDDATA", {});
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
