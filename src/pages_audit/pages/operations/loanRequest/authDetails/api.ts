//import { LOSSDK } from "registry/fns/functions";
import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getAUTHDetailFormData =
  ({ moduleType }) =>
  async (tranCD) => {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher(
        "LOANAPPROVALPROCESS_AUTH",
        {
          TRAN_CD: tranCD,
          FLAG: "AUTH",
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

export const updateAUTHReqAcceptGridData = async ({
  trancd,
  remarks,
  fileRefNo,
}) => {
  if (!Boolean(remarks)) {
    throw DefaultErrorObject(
      "Required value missing for Message From Approval.",
      "warning"
    );
  } else if (!Boolean(trancd)) {
    throw DefaultErrorObject("Required value missing for tran cd.", "warning");
  } else {
    const { status, message, messageDetails } = await AuthSDK.internalFetcher(
      "LOANREQAUTHACCEPT",
      {
        FILE_REF_NO: fileRefNo,
        AUTH_REMARKS: remarks,
        AUTH_MACHINE_NM: "test",
        REQ_CHECK: "Y",
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

export const updateAUTHReqRejectGridData = async ({ remarks, trancd }) => {
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
