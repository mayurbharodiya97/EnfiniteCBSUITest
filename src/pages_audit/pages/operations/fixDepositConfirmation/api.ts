import { DefaultErrorObject } from "@acuteinfo/common-base";
import { AuthSDK } from "registry/fns/auth";

export const getFdConfirmationData = async ({ BRANCH_CD, COMP_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETFDCONFIRMATIONGRID", {
      BRANCH_CD: BRANCH_CD,
      COMP_CD: COMP_CD,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getFdConfPaymentDepositGridData = async ({
  BRANCH_CD,
  COMP_CD,
  REMARKS,
  TRN_FLAG,
  FD_NO,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETFDCONFTRNDTL", {
      BRANCH_CD: BRANCH_CD,
      COMP_CD: COMP_CD,
      REMARKS: REMARKS,
      TRN_FLAG: TRN_FLAG,
      FD_NO: FD_NO,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getFdConfPaymentData = async ({
  BRANCH_CD,
  COMP_CD,
  ACCT_TYPE,
  ACCT_CD,
  FD_NO,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETFDPAYMENTADVICE", {
      BRANCH_CD: BRANCH_CD,
      COMP_CD: COMP_CD,
      ACCT_TYPE: ACCT_TYPE,
      ACCT_CD: ACCT_CD,
      FD_NO: FD_NO,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getFdConfUpdateGridData = async ({
  BRANCH_CD,
  COMP_CD,
  ACCT_TYPE,
  ACCT_CD,
  FD_NO,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETFDAUDITDETAILS", {
      BRANCH_CD: BRANCH_CD,
      COMP_CD: COMP_CD,
      ACCT_TYPE: ACCT_TYPE,
      ACCT_CD: ACCT_CD,
      FD_NO: FD_NO,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const ValidateFDDelete = async (formData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("VALIDATEFDDELETE", formData);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
