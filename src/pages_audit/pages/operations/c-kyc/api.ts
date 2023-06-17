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