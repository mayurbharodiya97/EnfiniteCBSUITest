import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";

export const getUserPushnotifGridData = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETUSERPUSHGRIDDATA", {});
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getUserPushnotifDetailGridData = async ({ reqdata }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETUSERPUSHDTLDATA", reqdata);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const updateUserPushnotifMasterDetailData = async (reqdata) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("UPDUSERNOTIFTMPL", reqdata);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const updateUserPushnotifSubDetailData = async ({ data: reqdata }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("", reqdata);
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
