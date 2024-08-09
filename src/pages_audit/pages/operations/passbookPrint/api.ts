import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const passbookPrintingCompleted = async (reqData: any) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DOPASSBOOKDUPDATAINSERT", reqData);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
