//import { LOSSDK } from "registry/fns/functions";
import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";
import { GeneralAPI } from "registry/fns/functions";

export const getCIBStatus = () => GeneralAPI.GetMiscValue("CIB_STATUS");

export const getCibDetailFormData =
  ({ moduleType }) =>
  async (tranCD) => {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher(
        "LOANAPPROVALPROCESS_CIB",
        {
          TRAN_CD: tranCD,
          FLAG: "CIB",
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

export const updateCIBReqAcceptGridData = async ({
  address,
  cibStatus,
  cibRemarks,
  fileName,
  trancd,
  dataFile,
  userName,
}) => {
  if (!Boolean(address)) {
    throw DefaultErrorObject(
      "Required value missing for Permanent Address.",
      "warning"
    );
  } else if (!Boolean(cibStatus)) {
    throw DefaultErrorObject(
      "Required value missing for CIB Status.",
      "warning"
    );
  } else if (!Boolean(cibRemarks)) {
    throw DefaultErrorObject(
      "Required value missing for CIB Remarks.",
      "warning"
    );
  } else if (!Boolean(trancd)) {
    throw DefaultErrorObject("Required value missing for tran cd.", "warning");
  } else {
    const { status, message, messageDetails } = await AuthSDK.internalFetcher(
      "LOANREQCIBACCEPT",
      {
        PERMANENT_ADD: address,
        CIB_STATUS: cibStatus,
        CIB_REMARKS: cibRemarks,
        FILE_NAME: fileName,
        REQ_CHECK: "C",
        CIB_FILES: dataFile,
        USER_NAME: userName,

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

export const updateCIBReqRejectGridData = async ({ remarks, trancd }) => {
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
