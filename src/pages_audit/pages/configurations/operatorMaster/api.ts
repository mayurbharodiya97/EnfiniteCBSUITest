import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";

export const getOperatorMasterGridData = async (reqdata) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETOPERATORMASTERGRIDDATA", reqdata);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getOperatorDetailGridData = async (reqdata) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETOPERATORDTLGRIDDATA", reqdata);
  if (status === "0") {
    return data.map((item) => {
      return {
        ...item,
        ACTIVE: item.ACTIVE === "Y" ? true : false,
        CHARGE_ALLOW: item.CHARGE_ALLOW === "Y" ? true : false,
      };
    });
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const updateOperatorMasterDetailGridData = async (reqdata) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("OPERATOROPERATION", reqdata);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getOperatorSubDetailsGridData = async (reqdata) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETOPERATORSDTGRIDDATA", reqdata);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const updateOperatorMasterSubDetailGridData = async ({
  data: reqdata,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("OPERATORSUBDETAILOPERATION", reqdata);
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
