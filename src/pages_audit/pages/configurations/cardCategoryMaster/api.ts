import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";
import { GeneralAPI } from "registry/fns/functions";

export const GetMiscValue = () => GeneralAPI.GetMiscValue("TRAN_TYPE");

export const GetParentTypeDD = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETPARENTTYPEDROPDOWN", {});
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ DISPLAY_VALUE, PARENT_TYPE, ...other }) => {
          return {
            value: PARENT_TYPE,
            label: DISPLAY_VALUE,
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

export const GetLeafTemplateDD = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLEAFTEMPLATEDROPDOWN", {});
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ TEMPLATE_DESC, TRAN_CD, ...other }) => {
          return {
            value: TRAN_CD,
            label: TEMPLATE_DESC,
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
export const insertMastersData = () => async (formData: any) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "DMLOPRATION_SERVICE_CHARGE_OPERATION0",
    formData
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getDetailsGridData = async (transactionID: number) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCARDCATEGORYDTLGRID", {
      TRAN_CD: transactionID + "",
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getMastersFormData = async (transactionID: number) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(
      `/adminPanelCommonServiceAPI/GETCHARGETEMPLATEMST`,
      {
        TRAN_CD: transactionID + "",
      }
    );
  if (status === "0") {
    return data[0];
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getMastersGridData = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(`GETCARDCATEGORYMSTGRID`, {});
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const updateMastersData = () => async (formData: any) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "DMLOPRATION_SERVICE_CHARGE_OPERATION0",
    formData
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const deleteBytransactionID = (data) => async () => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "DMLOPRATION_SERVICE_CHARGE_OPERATION0",
    data
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message);
  }
};
