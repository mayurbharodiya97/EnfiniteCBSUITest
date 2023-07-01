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
    const dataStatus = data;
    dataStatus.map((item) => {
      if (item?.DISPLAY_STATUS === "CLOSE") {
        item._rowColor = "rgb(152 59 70 / 61%)";
      }
      if (item?.DISPLAY_STATUS === "FREEZE") {
        item._rowColor = "rgb(40 142 159 / 60%)";
      }
      if (item?.DISPLAY_STATUS === "UNCLAIMED") {
        item._rowColor = "rgb(9 132 3 / 51%)";
      }
    });
    return dataStatus;
    // return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};