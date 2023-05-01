//import { LOSSDK } from "registry/fns/functions";
import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getLoanClosureDetailFormData =
  ({ moduleType }) =>
  async (tranCD) => {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETLOANCLSDETAIL", {
        TRAN_CD: tranCD,
        FLAG: "CIB",
        DISPLAY_LANGUAGE: "en",
        ACTION: "",
      });
    if (status === "0") {
      return data;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };

export const updateLoanClosureAcceptRejectData = async ({
  confirmed,
  authRemarks,
  trancd,
}) => {
  if (!Boolean(confirmed)) {
    throw DefaultErrorObject("Required value missing for confirm.", "warning");
  } else if (!Boolean(authRemarks)) {
    throw DefaultErrorObject("Required value missing for Remarks.", "warning");
  } else if (!Boolean(trancd)) {
    throw DefaultErrorObject("Required value missing for tran cd.", "warning");
  } else {
    const { status, message, messageDetails } = await AuthSDK.internalFetcher(
      "UPDATELOANCLSCONF",
      {
        CONFIRMED: confirmed,
        AUTH_REMARKS: authRemarks,
        VERIFIED_MACHINE_NM: "test",

        TRAN_CD: trancd + "",
        DISPLAY_LANGUAGE: "en",
        ACTION: "",
      }
    );
    if (status === "0") {
      return message;
    } else {
      throw DefaultErrorObject(message, "error", messageDetails);
    }
  }
};
