import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject, utilFunction } from "components/utils";

export const getCustomerActivationDetail = async (transactionCode) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCUSTREGISTERREQ", {
      TRAN_CD: transactionCode,
      DATA_FOR: "DTL",
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

export const upadteCustomerActivationConfirm = async ({
  confirmed,
  tranList,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("CUSTREGISTERUPDATE", {
      STATUS: confirmed,
      TRAN_LIST: tranList,
      VERIFIED_MACHINE_NM: "test",
      VERIFIED_BY: "test",
    });
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
