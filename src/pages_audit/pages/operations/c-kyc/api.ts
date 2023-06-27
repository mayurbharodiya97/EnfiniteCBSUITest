import { DefaultErrorObject } from "components/utils";
import { format } from "date-fns";
import { AuthSDK } from "registry/fns/auth";

export const TodaysTransactionTableGrid = async ({ COMP_CD, BRANCH_CD }) => {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETTRANSACTIONDETAILS", {
        COMP_CD: COMP_CD,
        // BASE_BRANCH_CD: BASE_BRANCH_CD,
        BRANCH_CD: BRANCH_CD,
        // ENTERED_DATE: format(new Date(), "dd/MMM/yyyy"),
      });
    if (status === "0") {
      return data;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };


export const GetCategoryOptions = async () => {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("CATEGORYNAME", {
        // COMP_CD: COMP_CD,
        // BASE_BRANCH_CD: BASE_BRANCH_CD,
        // BRANCH_CD: BRANCH_CD,
        // ENTERED_DATE: format(new Date(), "dd/MMM/yyyy"),
        // CUST_TYPE: CUST_TYPE
      });
    if (status === "0") {
      return data;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };
export const GetAreaOptions = async () => {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETAREA", {
        // COMP_CD: COMP_CD,
        // BASE_BRANCH_CD: BASE_BRANCH_CD,
        // BRANCH_CD: BRANCH_CD,
        // ENTERED_DATE: format(new Date(), "dd/MMM/yyyy"),
        // CUST_TYPE: CUST_TYPE
      });
    if (status === "0") {
      return data;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };

export const getCustomerDetails = async ({COMP_CD, CUST_ID, CONTACT_NO, PAN_NO, ACCT_NM, UNIQ_ID, E_MAIL_ID }) => {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETCUSTOMERDTL", {
        COMP_CD: "132",
        CUST_ID: "211562",
        CONTACT_NO: " ",
        PAN_NO: " ",
        ACCT_NM: " ",
        UNIQ_ID: " ",
        E_MAIL_ID: " "
        // BASE_BRANCH_CD: BASE_BRANCH_CD,
        // BRANCH_CD: BRANCH_CD,
        // ENTERED_DATE: format(new Date(), "dd/MMM/yyyy"),
        // CUST_TYPE: CUST_TYPE
      });
    if (status === "0") {
      return data;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };
