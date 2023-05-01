import { UserLimitConfirmGridMetaData } from "./metaData/userLimitMetaData";
import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";
import { useContext } from "react";
import { AuthContext } from "pages_audit/auth";

export const getGridFormMetaData =
  ({ gridCode }) =>
  async () => {
    switch (gridCode) {
      case "CCC/001":
        return UserLimitConfirmGridMetaData;
      default:
        /* eslint-disable no-throw-literal */
        throw { error_msg: "Invalid Product type" };
    }
  };

export const getConfirmationGridData = async ({ screenFlag, compCode }) => {
  let APIURL;
  let parameters = {};
  if (screenFlag === "userLimit") {
    APIURL = "USERSLIMITCONFGRID";
  } else if (screenFlag === "passReset") {
    APIURL = "GETCUSTACTIVEPENDINGGRID";
    parameters = { FLAG: "PWDRESET" };
  } else if (screenFlag === "custActivation") {
    APIURL = "GETCUSTACTIVEPENDINGGRID";
    parameters = { FLAG: "PEND" };
  } else if (screenFlag === "serviceConfig") {
    APIURL = "GETSERVICECONFIRMGRID";
  } else if (screenFlag === "operatorMaster") {
    APIURL = "GETOPERATORMSTCONFIRMGRID";
    parameters = { COMP_CD: compCode };
  }
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(APIURL, parameters);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const updateOperatorMSTConfirm = async ({
  confirmed,
  companyCode,
  tranCode,
}) => {
  if (!Boolean(confirmed)) {
    throw DefaultErrorObject(
      "Required value missing for confirmed.",
      "warning"
    );
  } else if (!Boolean(companyCode)) {
    throw DefaultErrorObject(
      "Required value missing for Company Code.",
      "warning"
    );
  } else if (!Boolean(tranCode)) {
    throw DefaultErrorObject(
      "Required value missing for Transaction Code.",
      "warning"
    );
  } else {
    const { status, message, messageDetails } = await AuthSDK.internalFetcher(
      "OPERATORMSTCONFIRM",
      {
        CONFIRMED: confirmed,
        COMP_CD: companyCode,
        TRAN_CD: tranCode,
      }
    );
    if (status === "0") {
      return message;
    } else {
      throw DefaultErrorObject(message, "error", messageDetails);
    }
  }
};
