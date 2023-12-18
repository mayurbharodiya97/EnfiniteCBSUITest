import {
  AddIDinResponseData,
  DefaultErrorObject,
  utilFunction,
} from "components/utils";
import { format } from "date-fns";
import { AuthSDK } from "registry/fns/auth";

export const getBussinessDate = async ({ companyID, branchID }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETBUSINESSDATE", {
      TRAN_DATE: format(new Date(), "dd/MMM/yyyy"),
      COMP_CD: companyID,
      BRANCH_CD: branchID,
    });

  if (status === "0") {
    let responseData = data;
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getAccountName = async ({ Apireq }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCOUNTNM", { ...Apireq });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getSlipNumber = async (Apireq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(`GETSLIPNO`, { ...Apireq });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const clearingBankMasterConfigDML = async ({ data: formData }) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "DOBANKDETAIL",
    formData
  );
  if (status === "0") {
    return message;
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
export const TemporaryData = () => {
  return [
    {
      CHEQUE_NO: "",
      BANK_CD: "",
      BANK_NAME: "",
      PAYEE_AC_NO: "",
      CHEQUE_DATE: "",
      DESCRIPTION: "",
      CHQ_MICR_CD: "",
      NAME: "",
      AMOUNT: "",
      id: 1,
    },
  ];
};
