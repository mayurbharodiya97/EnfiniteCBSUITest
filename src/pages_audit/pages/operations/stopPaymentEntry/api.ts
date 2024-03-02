import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const accountValidate = async (apiReqPara) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSTPGENDISP", {
      ...apiReqPara,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const stopPayDetail = async (apiReqPara) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSTPGRIDDATADISP", {
      ...apiReqPara,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
