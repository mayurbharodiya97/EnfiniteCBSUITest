import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getChequebookData = async ({ otherAPIRequestPara }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("CHEQUEBKDATA", {
      ...otherAPIRequestPara,
      // TRAN_CD: "1",
    });
  if (status === "0") {
    let newData = data;
    newData[0].CHEQUE_BOOK_ISSUE = "N";
    return newData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getChequebookDTL = async ({ chequeDTLRequestPara }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCHEQUEBOOK", {
      ...chequeDTLRequestPara,
      // TRAN_CD: "1",
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const saveChequebookData = async ({ otherAPIRequestPara2 }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DOCHEQUEBKISSUE", {
      ...otherAPIRequestPara2,
      // TRAN_CD: "1",
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const TemporaryData = () => {
  return [
    {
      CHEQUE_BOOK_ISSUE: "Y",
      PERSONALIZE_CHEQUE_BOOK: "Y",
      ACCT_NM: "MAYUR SHAH",
      BALANCE: "763647836",
      FROM_CHEQUE_NO: "21",
      JOINT_HOLDER1: "BADAL",
      JOINT_HOLDER2: "VIJAY",
      GST: "18",
      SERVICE_TAX: "20",
      SERVICE_CHARGE_FLAG: "D",
      GST_ROUND_OFF: "5",
      // CONFIRM_MSG: " FHFH KFHUIFH FJKFHJFBM FE JKFH",
      // CHEQUE_BOOK_ISSUE_MSG: "jdkjwekl lkfjklnf kljfkf sklfjosH",
      // BALANCE_MSG: " FHFH 12121 FJ3123123KFHJFBM FE JKFH",
      // SERVICE_TAX_MSG: "",
    },
  ];
};
