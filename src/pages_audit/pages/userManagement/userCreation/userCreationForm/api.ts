//import { LOSSDK } from "registry/fns/functions";
import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getDistMasterFormData = async ({ formView, distCode }) => {
  if (formView === "add") {
    return {};
  } else {
    const { status, message, messageDetails } = await AuthSDK.internalFetcher(
      "UPDDISTMSTFORMDATA",
      {
        DIST_CD: distCode,
      },
      {
        UNIQUE_REQ_ID: "32627636893400",
        APITOKEN: "MzI2Mjc2MzY4OTM0MDA=",
      }
    );
    if (status === "0") {
      return message;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  }
};

export const updateUserMasterDetails = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("SECURITYUSERDML", reqData);
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
