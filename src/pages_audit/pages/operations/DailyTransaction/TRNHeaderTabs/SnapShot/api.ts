import {
  AddIDinResponseData,
  DefaultErrorObject,
  utilFunction,
} from "@acuteinfo/common-base";
import { AuthSDK } from "registry/fns/auth";

export const getSnapShotList = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSNAPSHOTDTLF1", { ...reqData });
  if (status === "0") {
    let responseData = data;
    responseData.map((a, i) => {
      a.index = i;
      a.debit1 = "0.00";
      a.credit1 = "0.00";
    });
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getDailyScrollRegister = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDLYSCROLLREGF1", {
      ...reqData,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
