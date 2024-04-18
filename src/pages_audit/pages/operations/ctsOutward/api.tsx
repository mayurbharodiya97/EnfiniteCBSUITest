import {
  AddIDinResponseData,
  DefaultErrorObject,
  utilFunction,
} from "components/utils";
import { format } from "date-fns";
import { AuthSDK } from "registry/fns/auth";

export const getBussinessDate = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETBUSINESSDATE", {});
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getAccountSlipJoinDetail = async (Apireq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCOUNTNM", { ...Apireq });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const clearingBankMasterConfigDML = async (formData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DOBANKDETAIL", formData);
  if (status === "0") {
    return {
      data,
      status,
    };
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getBankChequeAlert = async (formData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("BANKCHEQUEALERT", formData);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const outwardClearingConfigDML = async (formData) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "DOOWCLEARINGDML",
    formData
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getRetrievalClearingData = async (Apireq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(`GETCTSCNFRETRIEV`, { ...Apireq });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getOutwardClearingConfigData = async (formData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETOWCLEARINGDETAILS", formData);
  if (status === "0") {
    return data.map((item) => {
      return {
        ...item,
        CONFIRMED: item.CONFIRMED === "Y" ? "Confirm" : "Pending",
      };
    });
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getInwardReasonTypeList = async (ApiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETINWREASONMSTDDW", {
      ...ApiReq,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ DISLAY_REASON, REASON_CD, ...other }) => {
          return {
            value: REASON_CD,
            label: DISLAY_REASON,
            ...other,
          };
        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
