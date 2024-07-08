import {
  AddIDinResponseData,
  DefaultErrorObject,
  utilFunction,
} from "components/utils";
import { format } from "date-fns";
import { AuthSDK } from "registry/fns/auth";

export const getRetrievalClearingData = async (Apireq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(`GETCLGDTTRANSBANKGRID`, { ...Apireq });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const slipGetRetrievalClearingData = async (Apireq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(`GETCLGDTTRANSSLIPGRID`, { ...Apireq });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const transferDateClearingData = async (Apireq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(`DOCLGDTTRNF`, { ...Apireq });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
