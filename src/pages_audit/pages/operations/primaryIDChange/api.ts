import {
  AddIDinResponseData,
  DefaultErrorObject,
  utilFunction,
} from "components/utils";
import { AuthSDK } from "registry/fns/auth";
import { GeneralAPI } from "registry/fns/functions";

export const getSearchParameter = () => GeneralAPI.GetMiscValue("SEARCH");

export const getPrimaryIDChangeData = async ({ regWith, accountCardNo }) => {
  if (!Boolean(regWith)) {
    throw DefaultErrorObject(
      "Required value missing for Activation Using.",
      "",
      "warning"
    );
  } else if (!Boolean(accountCardNo)) {
    throw DefaultErrorObject(
      "Required value missing for Account/Card Number.",
      "",
      "warning"
    );
  } else {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher(
        "GETPRIMARYIDCHANGEDATA",
        {
          COMP_CD: "001 ",
          DATA: accountCardNo,
          FLAG: regWith,
        },
        {
          UNIQUE_REQ_ID: "32627636893400",
          APITOKEN: "MzI2Mjc2MzY4OTM0MDA=",
        }
      );
    if (status === "0") {
      let responsedata = data;
      if (Array.isArray(responsedata)) {
        let allKeyData = responsedata?.[0]?.CUSTDATA;
        if (Array.isArray(allKeyData)) {
          allKeyData = AddIDinResponseData(allKeyData);
          let repdat = { gender: { F: "Female", M: "Male" } };
          allKeyData = utilFunction.ChangeJsonValue(allKeyData, repdat);
          responsedata[0]["CUSTDATA"] = allKeyData;
        }
      }
      return responsedata;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  }
};

export const sentNewPrimaryIDRequest = async (rows) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "INSPRIMARYSOURCE",
    {
      CUSTOMER_ID: rows?.CUSTOMER_ID ?? "",
      USER_NAME: rows?.USER_NAME ?? "",
      PRIMARY_APP_SOURCE: rows?.[0]?.data?.source ?? "",
      PRIMARY_CBNUMBER: rows?.[0]?.data?.customerId ?? "",
      REG_CARD_ACCT_NO: rows?.[0]?.data?.accountOrCardNo ?? "",
      OLD_PRIMARY_SOURCE: rows?.PRIMARY_APP_SOURCE ?? "",
      OLD_PRIMARY_CBNUMBER: rows?.PRIMARY_CBNUMBER ?? "",
      OLD_REG_CARD_ACCT_NO: rows?.REG_CARD_ACCT_NO ?? "",
      CUSTOM_USER_NM: rows?.CUSTOM_USER_NM ?? "",
      PRODUCT_TYPE: rows?.[0]?.data?.productType ?? "",
      CARD_PRODUCT_BIN: rows?.[0]?.data?.cardProductBin ?? "",
      CONSTITUTION: rows?.[0]?.data?.constitution ?? "",
      PRODUCT_CODE: rows?.[0]?.data?.productCode ?? "",
      MOBILE_NO: rows?.[0]?.data?.phone ?? "",
    },
    {
      UNIQUE_REQ_ID: "32627636893400",
      APITOKEN: "MzI2Mjc2MzY4OTM0MDA=",
    }
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
