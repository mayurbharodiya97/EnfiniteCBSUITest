import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const insertMastersData = () => async (formData: any) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "SERVICECHARGEDML",
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
    await AuthSDK.internalFetcher(`GETCHARGETEMPLATEDTL`, {
      TRAN_CD: transactionID + "",
    });
  if (status === "0") {
    return data.map((item) => {
      return {
        SR_CD: item.serialNo,
        MIN_AMT: item.minAmount,
        MAX_AMT: item.maxAmount,
        FROM_LIMIT: item.fromLimitAmount,
        TO_LIMIT: item.toLimitAmount,
        CHARGE_AMT: item.chargeAmount,
        CHARGE_PERC: item.chargePercentage,
        COMPARE_OR_ADD: item.compareOrAdd,
        ...item,
      };
    });
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getMastersFormData = async (transactionID: number) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(
      `GETCHARGETEMPLATEMST`,
      {
        TRAN_CD: transactionID + "",
      },
      {
        UNIQUE_REQ_ID: "32627636893400",
        APITOKEN: "MzI2Mjc2MzY4OTM0MDA=",
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
    await AuthSDK.internalFetcher(`GETCHARGETEMPLATEGRID`, {
      COMP_CD: "001 ",
      BRANCH_CD: "001 ",
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getChargeConfirmationGridData = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(`GETCONFCHARGETEMPLATEGRID`, {
      COMP_CD: "001 ",
      BRANCH_CD: "001 ",
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const updateMastersData = () => async (formData: any) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "SERVICECHARGEDML",
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
    "SERVICECHARGEDML" /*`/adminPanelCommonServiceAPI/UPDCHARGETEMPLATEMST`*/,
    data
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message);
  }
};
