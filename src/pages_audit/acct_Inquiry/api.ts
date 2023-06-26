import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getAccountInquiry = async (inputdata) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTINQUIRY", {
      // ACCT_NO: "132005001007851",
      ACCT_NO: inputdata?.ACCOUNT,
      MOB_NO: inputdata?.MOBILE,
      PAN_NO: inputdata?.PAN,
      CUST_ID: inputdata?.CUSTOMER,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
