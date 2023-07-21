import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getMasterDetailsgridData = async ({
  screenFlag,
  COMP_CD,
  BRANCH_CD,
}) => {
  let APIURL;
  let parameters = {};
  if (screenFlag === "TradeMaster") {
    APIURL = "GETTRADEMST";
    parameters = {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    };
  } else if (screenFlag === "") {
    APIURL = "";
  } else if (screenFlag === "") {
    APIURL = "";
  } else if (screenFlag === "") {
    APIURL = "";
  } else if (screenFlag === "") {
    APIURL = "";
  } else if (screenFlag === "") {
    APIURL = "";
  }
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(APIURL, parameters);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
