import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";

export const getFromSourceConfigGridData = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETFROMSOURCECONFIGGRID", {});
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getFromSourceConfigDetailGridData = async (reqdata) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETFROMSOURCECONFIGDTLDATA", reqdata);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getFromSourceConfigSubDtlGridData = async (reqdata) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETFROMSOURCECONFIGSDTDATA", reqdata);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const updateFromSourceConfigMasterDetailData = async (reqdata) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("FROMACCOUNTCONFIGDML", reqdata);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const updateFromSourceConfigSubDetailData = async ({
  data: reqdata,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("FROMACCOUNTSDTCONFIGDML", reqdata);
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
