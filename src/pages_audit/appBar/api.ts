import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getBankimgAndProfileimg = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETBANKIMAGEANDPROFILEPIC", {
      //   USERNAME: "parag",
      COMP_CD: "473 ",
      USER_ID: "parag",
    });
  console.log("<<<bankimage", data, status);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getQuickView = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETQUICKACCESSVIEW", {
      COMP_CD: "473 ",
      BRANCH_CD: "0002",
      USER_NAME: "ajayj",
    });
  console.log("<<<GETQUICKACCESSVIEW", data, status);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
