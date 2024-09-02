import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getDailyImportConfigData = async (reqData: any) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDAILYIMPDDDW", { ...reqData });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ DESCRIPTION, TABLE_NM, ...other }) => {
        return {
          value: TABLE_NM,
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
    return data;

  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};