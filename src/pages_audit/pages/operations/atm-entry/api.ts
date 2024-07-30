import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getParameter = async (apiReqPara) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETATMREGPARA", {
      ...apiReqPara,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const validateAcctAndCustId = async (apiReqPara) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("VALIDATEACCOUNTANDCUSTID", {
      ...apiReqPara,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const cardStatusList = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETATMCARDSTATUSDDDW", {});
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ DIS_VALUE, DATA_VALUE, ...other }) => {
        return {
          value: DATA_VALUE,
          label: DIS_VALUE,
          ...other,
        };
      });
    }

    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const cardTypeList = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETATMCARDTYPEDDDW", {});
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ DESCRIPTION, CARD_TYPE, ...other }) => {
          return {
            value: CARD_TYPE,
            label: CARD_TYPE + " - " + DESCRIPTION,
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
