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
export const acctTypeList = async (apiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETATMACCTTYPEDDDW", { ...apiReq });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ ACCT_TYPE, ...other }) => {
        return {
          value: ACCT_TYPE,
          label: ACCT_TYPE + " - " + other.DESCRIPTION,
          ...other,
        };
      });
    }

    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getATMcardDetails = async (apiReqPara) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETATMDTLDATA", {
      ...apiReqPara,
    });
  if (status === "0") {
    // return data;
    let newData;
    if (Array.isArray(data) && data?.length > 0) {
      newData = data.map((item) => ({
        ...item,
        DISPLAY_CARD_ISSUE_TYPE:
          item?.CARD_ISSUE_TYPE === "A"
            ? "Account"
            : item?.CARD_ISSUE_TYPE === "J"
            ? "Join A/C"
            : "",
        DISPLAY_STATUS:
          item?.STATUS === "B"
            ? "Block"
            : item?.STATUS === "D"
            ? "Destroy"
            : item?.STATUS === "A"
            ? "Issued"
            : item?.STATUS === "L"
            ? "Lost"
            : item?.STATUS === "N"
            ? "OFF"
            : item?.STATUS === "P"
            ? "Pending Issue"
            : item?.STATUS === "R"
            ? "Reject (OFF)"
            : item?.STATUS === "C"
            ? "Replace"
            : "",
      }));
    }
    return newData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const retrieveData = async (apiReqPara) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETATMCARDSTATUSDDDW", {
      ...apiReqPara,
    });
  if (status === "0") {
    // return [];
    return [
      {
        SUR_NAME: "GUPTA",
        ORGINAL_NM: "SHIVAMRAJ RAJ GUPTA",
        CA_BRANCH_CD: "099 ",
        PINCODE: "802221",
        LAST_ENTERED_BY: "ADMIN",
        CONFIRMED: "Y",
        CC_COMP_CD: "132 ",
        CC_ACCT_STATUS: "U",
        EDIT_STATUS: "Y",
        LAST_MACHINE_NM: "ADMIN",
        VERIFIED_BY: "ADMIN",
        CA_ACCT_STATUS: "",
        CC_ACCT_TYPE: "099 ",
        CUSTOMER_ID: "22",
        LAST_MODIFIED_DATE: "2019-06-03 12:42:47.0",
        LAST_ENT_BRANCH_CD: "",
        CA_COMP_CD: "132 ",
        ACCT_CD: "000004              ",
        SB_ACCT_STATUS: "",
        ACCT_TYPE: "099 ",
        MOBILE_NO: "7277818293",
        VERIFIED_DATE: "2019-06-03 12:42:47.0",
        ENTERED_BRANCH_CD: "099 ",
        SB_ACCT_CD: "",
        BRANCH_CD: "099 ",
        ENTERED_DATE: "2019-06-03 12:42:47.0",
        CC_BRANCH_CD: "099 ",
        TOT_AC: "1",
        CC_PROTECT: "Y",
        CA_ACCT_NM: "",
        TRAN_CD: "229",
        CA_PROTECT: "N",
        STATE: "GUJARAT",
        ACCT_NM: "AMIT KUMAR GUPTA",
        FIRST_NAME: "SHIVAMRAJ",
        ENTERED_BY: "ADMIN",
        OLD_CONFIRMED: "Y",
        SMS_ALERT: "N",
        SB_COMP_CD: "132 ",
        SB_BRANCH_CD: "099 ",
        MIDDLE_NAME: "RAJ",
        SB_PROTECT: "N",
        ADDRESS1: "ALIGANJ",
        SB_ACCT_NM: "",
        CC_ACCT_NM: "SHIVAMRAJ RAJ GUPTA",
        ADDRESS3: "",
        CA_ACCT_TYPE: "",
        ADDRESS2: "NEW DELHI",
        COMP_CD: "132 ",
        CA_ACCT_CD: "",
        SB_ACCT_TYPE: "",
        MACHINE_NM: "ADMIN",
        CITY: "DEESA",
        ENTERED_COMP_CD: "132 ",
        CC_ACCT_CD: "000004              ",
        BRANCH_NAME: "NARODA ROAD",
        VERIFIED_MACHINE_NM: "ADMIN",
      },
      {
        SUR_NAME: "GUPTA",
        ORGINAL_NM: "SHIVAMRAJ RAJ GUPTA",
        CA_BRANCH_CD: "099 ",
        PINCODE: "802221",
        LAST_ENTERED_BY: "sys",
        CONFIRMED: "Y",
        CC_COMP_CD: "132 ",
        CC_ACCT_STATUS: "O",
        EDIT_STATUS: "Y",
        LAST_MACHINE_NM: "DESKTOP-A8CURDH",
        VERIFIED_BY: "sys",
        CA_ACCT_STATUS: "",
        CC_ACCT_TYPE: "301 ",
        CUSTOMER_ID: "22",
        LAST_MODIFIED_DATE: "2018-09-21 10:34:14.0",
        LAST_ENT_BRANCH_CD: "",
        CA_COMP_CD: "132 ",
        ACCT_CD: "001214              ",
        SB_ACCT_STATUS: "",
        ACCT_TYPE: "301 ",
        MOBILE_NO: "7277818293",
        VERIFIED_DATE: "2018-09-21 10:34:14.0",
        ENTERED_BRANCH_CD: "099 ",
        SB_ACCT_CD: "",
        BRANCH_CD: "099 ",
        ENTERED_DATE: "2018-09-21 00:00:00.0",
        CC_BRANCH_CD: "099 ",
        TOT_AC: "1",
        CC_PROTECT: "Y",
        CA_ACCT_NM: "",
        TRAN_CD: "150",
        CA_PROTECT: "N",
        STATE: "GUJARAT",
        ACCT_NM: "AMIT KUMAR GUPTA",
        FIRST_NAME: "SHIVAMRAJ",
        ENTERED_BY: "sys",
        OLD_CONFIRMED: "Y",
        SMS_ALERT: "N",
        SB_COMP_CD: "132 ",
        SB_BRANCH_CD: "099 ",
        MIDDLE_NAME: "RAJ",
        SB_PROTECT: "N",
        ADDRESS1: "ALIGANJ",
        SB_ACCT_NM: "",
        CC_ACCT_NM: "SHIVAMRAJ RAJ GUPTA",
        ADDRESS3: "",
        CA_ACCT_TYPE: "",
        ADDRESS2: "NEW DELHI",
        COMP_CD: "132 ",
        CA_ACCT_CD: "",
        SB_ACCT_TYPE: "",
        MACHINE_NM: "DESKTOP-A8CURDH",
        CITY: "DEESA",
        ENTERED_COMP_CD: "132 ",
        CC_ACCT_CD: "001214              ",
        BRANCH_NAME: "NARODA ROAD",
        VERIFIED_MACHINE_NM: "DESKTOP-A8CURDH",
      },
      {
        SUR_NAME: "GUPTA",
        ORGINAL_NM: "SHIVAMRAJ RAJ GUPTA",
        CA_BRANCH_CD: "099 ",
        PINCODE: "802221",
        LAST_ENTERED_BY: "adi",
        CONFIRMED: "N",
        CC_COMP_CD: "132 ",
        CC_ACCT_STATUS: "O",
        EDIT_STATUS: "Y",
        LAST_MACHINE_NM: "DESKTOP-FOOB6TH",
        VERIFIED_BY: "",
        CA_ACCT_STATUS: "",
        CC_ACCT_TYPE: "301 ",
        CUSTOMER_ID: "22",
        LAST_MODIFIED_DATE: "2024-07-22 00:00:00.0",
        LAST_ENT_BRANCH_CD: "099 ",
        CA_COMP_CD: "132 ",
        ACCT_CD: "000002              ",
        SB_ACCT_STATUS: "",
        ACCT_TYPE: "301 ",
        MOBILE_NO: "7277818293",
        VERIFIED_DATE: "",
        ENTERED_BRANCH_CD: "099 ",
        SB_ACCT_CD: "",
        BRANCH_CD: "099 ",
        ENTERED_DATE: "2024-07-22 00:00:00.0",
        CC_BRANCH_CD: "099 ",
        TOT_AC: "1",
        CC_PROTECT: "Y",
        CA_ACCT_NM: "",
        TRAN_CD: "520",
        CA_PROTECT: "N",
        STATE: "GUJARAT",
        ACCT_NM: "SHIVAMRAJ RAJ GUPT",
        FIRST_NAME: "SHIVAMRAJ",
        ENTERED_BY: "adi",
        OLD_CONFIRMED: "N",
        SMS_ALERT: "Y",
        SB_COMP_CD: "132 ",
        SB_BRANCH_CD: "099 ",
        MIDDLE_NAME: "RAJ",
        SB_PROTECT: "N",
        ADDRESS1: "ALIGANJ",
        SB_ACCT_NM: "",
        CC_ACCT_NM: "SHIVAMRAJ RAJ GUPTA",
        ADDRESS3: "",
        CA_ACCT_TYPE: "",
        ADDRESS2: "NEW DELHI",
        COMP_CD: "132 ",
        CA_ACCT_CD: "",
        SB_ACCT_TYPE: "",
        MACHINE_NM: "DESKTOP-FOOB6TH",
        CITY: "DEESA",
        ENTERED_COMP_CD: "132 ",
        CC_ACCT_CD: "000002              ",
        BRANCH_NAME: "NARODA ROAD",
        VERIFIED_MACHINE_NM: "",
      },
    ];
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
