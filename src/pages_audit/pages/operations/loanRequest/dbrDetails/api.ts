//import { LOSSDK } from "registry/fns/functions";
import { DefaultErrorObject, utilFunction } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getDBRDetailFormData = async (tranCD) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(
      "LOANAPPROVALPROCESS_DBR",
      {
        TRAN_CD: tranCD,
        FLAG: "DBR",
        DISPLAY_LANGUAGE: "en",
        ACTION: "",
      },
      {
        UNIQUE_REQ_ID: "32627636893400",
        APITOKEN: "MzI2Mjc2MzY4OTM0MDA=",
      }
    );
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getFileViewerData = async (tranCD) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(
      "GETLOANAPPDOCUMENTDATA",
      {
        TRAN_CD: tranCD,
      },
      {
        UNIQUE_REQ_ID: "32627636893400",
        APITOKEN: "MzI2Mjc2MzY4OTM0MDA=",
      }
    );
  if (status === "0") {
    let response = utilFunction.transformBlobData(data);
    return response;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const updateDBRReqAcceptGridData = async ({ rowData }) => {
  if (!Boolean(rowData?.SAN_LOAN_AMOUNT)) {
    throw DefaultErrorObject(
      "Required value missing for Loan Amount (D).",
      "warning"
    );
  } else if (!Boolean(rowData?.SAN_INT_RATE)) {
    throw DefaultErrorObject(
      "Required value missing for Rate Of Interest.",
      "warning"
    );
  } else if (!Boolean(rowData?.SAN_LOAN_TENURE)) {
    throw DefaultErrorObject(
      "Required value missing for Tenor(Month) .",
      "warning"
    );
  } else if (!Boolean(rowData?.DBR_REMARKS)) {
    throw DefaultErrorObject(
      "Required value missing for Message From DBR .",
      "warning"
    );
  } else if (!Boolean(rowData?.TRAN_CD)) {
    throw DefaultErrorObject("Required value missing for tran cd.", "warning");
  } else {
    const { status, message, messageDetails } = await AuthSDK.internalFetcher(
      "LOANREQDBRACCEPT",
      {
        OTHER_LOAN_EMI: rowData?.OTHER_LOAN_EMI,
        SAN_LOAN_AMOUNT: rowData?.SAN_LOAN_AMOUNT,
        SAN_INT_RATE: rowData?.SAN_INT_RATE,
        SAN_INST_AMT: rowData?.SAN_INST_AMT + "",
        CC_LIM_AMOUNT: rowData?.CC_LIM_AMOUNT,
        DBR_AMT: rowData?.DBR_AMT,
        LTV_PERC: rowData?.LTV_PERC + "",
        FINAL_LOAN_AMOUNT: rowData?.FINAL_LOAN_AMT,
        DBR_REMARKS: rowData?.DBR_REMARKS,
        DBR_USER_ID: "test",
        DBR_MACHINE_NM: "test",
        SAN_LOAN_TENURE: rowData?.SAN_LOAN_TENURE,
        REQ_CHECK: "D",
        TRAN_CD: rowData?.TRAN_CD + "",
        DISPLAY_LANGUAGE: "en",
        ACTION: "",
      },
      {
        UNIQUE_REQ_ID: "32627636893400",
        APITOKEN: "MzI2Mjc2MzY4OTM0MDA=",
      }
    );
    if (status === "0") {
      return message;
    } else {
      throw DefaultErrorObject(message, "error", messageDetails);
    }
  }
};

export const updateDBRReqRejectGridData = async ({ remarks, trancd }) => {
  if (!Boolean(remarks)) {
    throw DefaultErrorObject(
      "Required value missing for Rejection Remarks.",
      "warning"
    );
  } else if (!Boolean(trancd)) {
    throw DefaultErrorObject("Required value missing for tran cd.", "warning");
  } else {
    const { status, message, messageDetails } = await AuthSDK.internalFetcher(
      "LOANREQREJECT",
      {
        CONFIRMED: "R",
        REJECT_MACHINE_NM: "test",
        REJECT_REMARKS: remarks,
        TRAN_CD: trancd + "",
        DISPLAY_LANGUAGE: "en",
        ACTION: "",
      },
      {
        UNIQUE_REQ_ID: "32627636893400",
        APITOKEN: "MzI2Mjc2MzY4OTM0MDA=",
      }
    );
    if (status === "0") {
      return message;
    } else {
      throw DefaultErrorObject(message, "error", messageDetails);
    }
  }
};
