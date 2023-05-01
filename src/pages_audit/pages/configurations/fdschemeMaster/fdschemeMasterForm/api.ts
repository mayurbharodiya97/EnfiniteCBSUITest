import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const updFdschemeMasterFormData = async ({ data: formData }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("UPDFDSCHEMEDATA", formData);
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
