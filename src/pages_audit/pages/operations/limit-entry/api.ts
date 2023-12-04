import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getLimitEntryData = async ({ otherAPIRequestPara }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLIMITENTRY", {
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
export const securityDropDownList = async () => {
  return [
    {
      label: "PROPERTY-PRT",
      value: "1",
    },
    {
      label: "OFFER LETTERS-OTH",
      value: "10",
    },
    {
      label: "GOLD ORNAMENTS-OTH",
      value: "11",
    },
    {
      label: "FIXED DEPOSIT-BFD",
      value: "12",
    },
    {
      label: "STOCK IMPACT-STK",
      value: "14",
    },
    {
      label: "THIRD PARTY FDOD-BFD",
      value: "16",
    },
    {
      label: "LETTER OF CREDITM-BLC",
      value: "18",
    },
    {
      label: "BANK RD-BRD",
      value: "19",
    },
    {
      label: "CASH-OTH",
      value: "2",
    },
    {
      label: "SHARE CERTIFICATE-OTH",
      value: "4",
    },
    {
      label: "COMPANY ASSETS-OTH",
      value: "5",
    },
    {
      label: "GUARANTEES-OTH",
      value: "6",
    },
    {
      label: "INSURANCE POLICIES-OTH",
      value: "7",
    },
    {
      label: "LETTER OF CREDIT-OTH",
      value: "8",
    },
    {
      label: "UNSECURED-OTH",
      value: "9",
    },
  ];
};
