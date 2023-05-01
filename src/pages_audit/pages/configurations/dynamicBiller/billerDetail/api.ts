import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";
import { BillerParametersGridMetaData } from "./parameterGridMetadata";

export const updateParameterData =
  ({ moduleType, productType, refID }) =>
  async (formData: any, ParameterRefCode?: any) => {
    return [];
  };

export const deleteParameterData =
  ({ moduleType, productType, refID }) =>
  async (ParameterRefCode: any) => {
    return [];
  };

export const insertParameterData =
  ({ moduleType, productType, refID }) =>
  async (formData: any) => {
    return [];
  };

export const getGridParameterData =
  ({ flag, categoryID, subCategoryID, billerID }) =>
  async () => {
    let apiUrl = "GETBILLERFIELDLIST";
    let parametersFlag = "";
    if (flag === "infoPara") {
      apiUrl = "GETBILLERURLPARALIST";
      parametersFlag = "I";
    } else if (flag === "payPara") {
      apiUrl = "GETBILLERURLPARALIST";
      parametersFlag = "P";
    }

    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher(apiUrl, {
        CATEGORY_ID: categoryID,
        SUB_CATEGORY_ID: subCategoryID,
        BILLER_ID: billerID,
        PARAMETER_FLAG: parametersFlag,
      });
    if (status === "0") {
      return data;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };

export const getParameterData =
  ({ moduleType, productType }) =>
  async (serialNo?: string) => {
    return [];
  };

export const getFormMetaData =
  ({ flag }) =>
  async (metadataType: any) => {
    switch (flag) {
      case "fields":
        return;
      default:
        /* eslint-disable no-throw-literal */
        throw { error_msg: "Invalid Product type" };
    }
  };

export const getGridFormMetaData =
  ({ flag }) =>
  async () => {
    switch (flag) {
      case "infoPara":
        return BillerParametersGridMetaData;
      case "payPara":
        return BillerParametersGridMetaData;
      default:
        /* eslint-disable no-throw-literal */
        throw { error_msg: "Invalid Product type" };
    }
  };
