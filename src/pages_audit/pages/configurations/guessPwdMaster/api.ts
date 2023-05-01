import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";
// import { GeneralAPI } from "registry/fns/functions";

// export const GetMiscValue = () => GeneralAPI.GetMiscValue("BEN_RESTRICT");

export const getGuessPwdMasterGridData = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETGUESSPWDDATA", {});
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
