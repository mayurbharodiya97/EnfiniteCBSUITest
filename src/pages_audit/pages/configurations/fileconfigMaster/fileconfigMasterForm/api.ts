//import { LOSSDK } from "registry/fns/functions";
import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";
import { GeneralAPI } from "registry/fns/functions";
export const getUsecase = () => GeneralAPI.GetMiscValue("USECASES");

export const updFileconfigMasterFormData = async ({ data: formData }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("UPDFILECONFIGDATA", formData);
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
