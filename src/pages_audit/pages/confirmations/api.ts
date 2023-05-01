import { UserLimitConfirmGridMetaData } from "./metaData/userLimitMetaData";
import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";

export const getGridFormMetaData =
  ({ gridCode }) =>
  async () => {
    switch (gridCode) {
      case "CCC/001":
        return UserLimitConfirmGridMetaData;
      default:
        /* eslint-disable no-throw-literal */
        throw { error_msg: "Invalid Product type" };
    }
  };

export const getConfirmationGridData = async (screenFlag) => {
  let APIURL;
  let parameters = {};
  if (screenFlag === "userLimit") {
    APIURL = "USERSLIMITCONFGRID";
  } else if (screenFlag === "passReset") {
    APIURL = "GETCUSTACTIVEPENDINGGRID";
    parameters = { FLAG: "PWDRESET" };
  } else if (screenFlag === "custActivation") {
    APIURL = "GETCUSTACTIVEPENDINGGRID";
    parameters = { FLAG: "PEND" };
  } else if (screenFlag === "serviceConfig") {
    APIURL = "GETSERVICECONFIRMGRID";
  }
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(APIURL, parameters);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
