import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getBankimgAndProfileimg = async ({ userID }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETBANKIMAGEANDPROFILEPIC", {
      //   USERNAME: "parag",
      COMP_CD: "473 ",
      USER_ID: userID,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getQuickView = async ({ userName }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETQUICKACCESSVIEW", {
      COMP_CD: "473 ",
      BRANCH_CD: "0002",
      USER_NAME: userName,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
