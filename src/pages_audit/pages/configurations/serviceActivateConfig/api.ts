import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";

export const getServiceActiveConfigGridData = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSERVICEACTVCONFIGGRID", {});
  if (status === "0") {
    return data.map((item) => {
      return {
        ...item,
        VIEW_USER_VIEW: item.VIEW_USER === "Y" ? "YES" : "NO",
        TRN_USER_VIEW: item.TRN_USER === "Y" ? "YES" : "NO",
        ACTIV_STATUS: item.ACTIVE === "Y" ? "Active" : "Deactive",
        TRN_USER: item.TRN_USER === "Y" ? true : false,
        VIEW_USER: item.VIEW_USER === "Y" ? true : false,
        MSG_ID: item.TRN_TYPE,
      };
    });
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const updateServiceActiveDeactiveConfig = async (reqdata) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("SERVICEACTIVEDEACTIVEMST", reqdata);
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
