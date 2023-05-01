import { DynamicBillerGridMetaData } from "./gridMetadata";
import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";
import { GeneralAPI } from "registry/fns/functions";

export const getChargeAllow = () => GeneralAPI.GetMiscValue("CHARGE_ALLOW");
export const GetChargeTemplates = () => GeneralAPI.GetChargeTemplates();

export const getGridFormMetaData =
  ({ gridCode }) =>
  async () => {
    switch (gridCode) {
      case "CCC/001":
        return DynamicBillerGridMetaData;
      default:
        /* eslint-disable no-throw-literal */
        throw { error_msg: "Invalid Product type" };
    }
  };

export const getBillerGridData = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETBILLERLIST", {});
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getBillerConfirmGridData = async ({ isDelete }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETBILLERCONFIRMDATA", {
      IS_DELETE: isDelete,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getBillerChargeConfirmGridData = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETBILLERCHARGECONFIRMDATA", {});
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const updateBillerConfigConfirm = async ({ confirmed, trancd }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DYNAMICBILLERCONFIRM", {
      CONFIRMED: confirmed,
      TRAN_CD: trancd,
    });
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const deleteBillerConfigConfirm = async ({
  categoryID,
  subCategoryID,
  billerID,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("", {
      CATEGORY_ID: categoryID,
      SUB_CATEGORY_ID: subCategoryID,
      BILLER_ID: billerID,
    });
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const updBillerChargeConfigConfirm = async ({
  categoryID,
  subCategoryID,
  billerID,
  confirmed,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DYNBILLERCHARGEMSTCONFIRM", {
      CATEGORY_ID: categoryID,
      SUB_CATEGORY_ID: subCategoryID,
      BILLER_ID: billerID,
      CONFIRMED: confirmed,
    });
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getBillerChargeData = async ({
  categoryID,
  subCategoryID,
  billerID,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETBILLERCHARGEDATA", {
      CATEGORY_ID: categoryID,
      SUB_CATEGORY_ID: subCategoryID,
      BILLER_ID: billerID,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const updateBillerChargeConfig = async (formData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("BILLERCHARGECONFIGDML", {
      formData,
    });
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
