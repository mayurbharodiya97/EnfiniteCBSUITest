import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";

export const getServiceConfigDetailGridData = async ({
  trnType,
  configType,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSERVICEACTVCONFIGDTLGRID", {
      TRN_TYPE: trnType,
      CONFIG_TYPE: configType,
    });
  if (status === "0") {
    return data.map((item) => {
      return {
        ...item,
        ACTIVE: item.ACTIVE === "Y" ? true : false,
      };
    });
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const updateServiceActiveDeactiveConfigDetails = async (reqdata) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("SERVICEACTIVEDEACTIVEDTL", reqdata);
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
