import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getLangMessageHDR = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLANGMSGHDR", {});
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getLangMessageDTL = async (transactionID) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLANGMSGDTL", {
      TRAN_CD: transactionID + "",
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const editLanguage = () => async (formData: any) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "DOLANGUAGECONFIG",
    { formData, TRAN_CD: "48" }
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
