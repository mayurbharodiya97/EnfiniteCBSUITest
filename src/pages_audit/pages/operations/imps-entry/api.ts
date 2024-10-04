import { DefaultErrorObject } from "@acuteinfo/common-base";
import { AuthSDK } from "registry/fns/auth";

export const validateCustId = async (apiReqPara) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("IMPSCUSTIDVALIDATION", {
      ...apiReqPara,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getAcctList = async (apiReqPara) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETIMPSACCTLIST", {
      ...apiReqPara,
    });
  if (status === "0") {
    let newResp = data.map((item) => {
      return {
        ...item,
        FULL_ACCT_NO_NM: `Account Number :-  ${(
          item?.COMP_CD +
          item?.BRANCH_CD +
          item?.ACCT_TYPE +
          item?.ACCT_CD
        ).replace(/\s/g, "")} \u00A0\u00A0\u00A0 Account Name :-  ${
          item?.ACCT_NM
        }`,
      };
    });
    return newResp;
    // return [
    //   {
    //     MESSAGE: "SUCCESS",
    //     COMP_CD: "132 ",
    //     STATUS: "0",
    //     CONFIRMED: "Y",
    //     BRANCH_CD: "099 ",
    //     ACCT_CD: "99999              ",
    //     ACCT_TYPE: "001 ",
    //   },
    //   {
    //     MESSAGE: "SUCCESS",
    //     COMP_CD: "132 ",
    //     STATUS: "0",
    //     CONFIRMED: "Y",
    //     BRANCH_CD: "002 ",
    //     ACCT_CD: "100110              ",
    //     ACCT_TYPE: "001 ",
    //   },
    //   {
    //     MESSAGE: "wrong data !..",
    //     COMP_CD: "132 ",
    //     STATUS: "999",
    //     CONFIRMED: "Y",
    //     BRANCH_CD: "012 ",
    //     ACCT_CD: "333333              ",
    //     ACCT_TYPE: "001 ",
    //   },
    //   {
    //     MESSAGE: "very wrong data !..",
    //     COMP_CD: "132 ",
    //     STATUS: "99",
    //     CONFIRMED: "Y",
    //     BRANCH_CD: "012 ",
    //     ACCT_CD: "22222              ",
    //     ACCT_TYPE: "001 ",
    //   },
    //   {
    //     MESSAGE: "SUCCESS",
    //     COMP_CD: "132 ",
    //     STATUS: "0",
    //     CONFIRMED: "Y",
    //     BRANCH_CD: "002 ",
    //     ACCT_CD: "44444              ",
    //     ACCT_TYPE: "001 ",
    //   },
    //   {
    //     MESSAGE: "very bad wrong data !..",
    //     COMP_CD: "132 ",
    //     STATUS: "9",
    //     CONFIRMED: "Y",
    //     BRANCH_CD: "012 ",
    //     ACCT_CD: "11111              ",
    //     ACCT_TYPE: "001 ",
    //   },
    // ];
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const retrieveData = async (apiReqPara) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETIMPSHDRDATA", {
      ...apiReqPara,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getImpsDetails = async (apiReqPara) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETIMPSDTLDATA", {
      ...apiReqPara,
    });
  if (status === "0") {
    // return data;
    let newResp = data.map((item) => {
      return {
        ...item,
        FULL_ACCT_NO_NM: `Account Number :-  ${(
          item?.COMP_CD +
          item?.BRANCH_CD +
          item?.ACCT_TYPE +
          item?.ACCT_CD
        ).replace(/\s/g, "")} \u00A0\u00A0\u00A0 Account Name :-  ${
          item?.ACCT_NM
        }`,
        IFT: item?.IFT === "Y" ? true : false,
        RTGS: item?.RTGS === "Y" ? true : false,
        NEFT: item?.NEFT === "Y" ? true : false,
        OWN_ACT: item?.OWN_ACT === "Y" ? true : false,
        BBPS: item?.BBPS === "Y" ? true : false,
        PG_TRN: item?.PG_TRN === "Y" ? true : false,
        IMPS: item?.IMPS === "Y" ? true : false,
      };
    });
    return newResp;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const dayLimitData = async (apiReqPara) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("IMPSDAILYSPENDLIMIT", {
      ...apiReqPara,
    });
  if (status === "0") {
    // return data;
    let newResp = data.map((item) => {
      return {
        ...item,
        IFT: item?.IFT === "Y" ? true : false,
        RTGS: item?.RTGS === "Y" ? true : false,
        UPI: item?.UPI === "Y" ? true : false,
        NEFT: item?.NEFT === "Y" ? true : false,
        OWN_ACT: item?.OWN_ACT === "Y" ? true : false,
        PG_TRN: item?.PG_TRN === "Y" ? true : false,
        POS: item?.POS === "Y" ? true : false,
        ECOM: item?.ECOM === "Y" ? true : false,
        ATM: item?.ATM === "Y" ? true : false,
        IMPS: item?.IMPS === "Y" ? true : false,
        BBPS: item?.BBPS === "Y" ? true : false,
      };
    });
    return newResp;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
