import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject, utilFunction } from "components/utils";

export const getPasswordResetDetail = async (customerID) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCUSTACCTDTL", {
      CUSTOMER_ID: customerID,
    });
  if (status === "0") {
    let responsedata = data;
    if (Array.isArray(responsedata)) {
      let allKeyData = responsedata;
      if (Array.isArray(allKeyData)) {
        let repdat = { GENDER: { F: "Female", M: "Male" } };
        allKeyData = utilFunction.ChangeJsonValue(allKeyData, repdat);
        responsedata = allKeyData;
      }
    }
    return responsedata;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const upadtePasswordResetConfirm = async ({
  confirmed,
  remarks,
  trancd,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("UPDATEPASSRESET", {
      VERIFIED_BY: "test",
      VERIFIED_MACHINE_NM: "test",
      CONFIRMED: confirmed,
      REMARKS: remarks,
      TRAN_CD: trancd,
    });
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
