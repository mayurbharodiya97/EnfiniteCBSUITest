//import { LOSSDK } from "registry/fns/functions";
import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const updEmiscMasterFormData = async ({ data: formData }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("UPDMISCDATA", formData);
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
