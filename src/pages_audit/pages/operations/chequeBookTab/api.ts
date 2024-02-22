import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getChequebookData = async ({ otherAPIRequestPara }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("CHEQUEBKDATA", {
      ...otherAPIRequestPara,
      // TRAN_CD: "1",
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getChequebookDTL = async (chequeDTLRequestPara) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCHEQUEBOOK", {
      ...chequeDTLRequestPara,
      // TRAN_CD: "1",
    });
  if (status === "0") {
    return data.map((item) => {
      if (item.CONFIRMED === "N") {
        item._rowColor = "rgb(152 59 70 / 61%)";
      }
      return {
        ...item,
        CONFIRMED: item.CONFIRMED === "Y" ? "Confirm" : "Pending",
        AUTO_CHQBK_FLAG: item.AUTO_CHQBK_FLAG === "Y" ? "Yes" : "No",
      };
    });
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const saveChequebookData = async (otherAPIRequestPara2) => {
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

export const chequebookCharge = async (Apireq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("CHEQUEBKCHARGE", {
      ...Apireq,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const validateDeleteData = async (Apireq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("VALIDDELETECHQDATA", {
      ...Apireq,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const chequeGridDTL = async (Apireq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCHQVIEWDETAILS", {
      ...Apireq,
    });
  if (status === "0") {
    return data.map((item) => {
      return {
        ...item,
        FLAG:
          item.FLAG === "P"
            ? "Processed"
            : item.FLAG === "T"
            ? "Stop Payment "
            : item.FLAG === "R"
            ? "Cheque Return "
            : item.FLAG === "S"
            ? "Surrender "
            : item.FLAG === "N"
            ? "Not Processed"
            : item.FLAG === "D"
            ? "PDC"
            : item.FLAG,
      };
    });
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
