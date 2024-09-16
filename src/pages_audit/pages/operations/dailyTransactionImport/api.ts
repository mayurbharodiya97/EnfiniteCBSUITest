import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getDailyImportConfigData = async (reqData: any) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDAILYIMPDDDW", { ...reqData });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ DESCRIPTION, ...other }) => {
        return {
          value: DESCRIPTION,
          label: DESCRIPTION,
          ...other,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getDailyTransactionImportData = async (apiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DODAILYTRNIMPORT", {
      ...apiReq,
    });
  if (status === "0") {
    // return data;
    let responseData = data;
    responseData.map((item, i) => {
      item.DEBIT_AC = [
        item.FROM_BRANCH_CD,
        item.FROM_ACCT_TYPE,
        item.FROM_ACCT_CD,
      ].filter(Boolean).join("-");
      item.CREDIT_AC = [
        item.TO_BRANCH_CD,
        item.TO_ACCT_TYPE,
        item.TO_ACCT_CD,
      ].filter(Boolean).join("-");

      return item;
    });
    return responseData;

  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getValidateToSelectFile = async (apiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("VALIDATETOSELECTFILE", {
      ...apiReq,
    });
  if (status === "0") {
    return data;

  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};