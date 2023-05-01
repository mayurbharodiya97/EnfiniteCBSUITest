import { TagAccountsGridMetaData } from "./gridMetadata";
import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";

export const getGridFormMetaData =
  ({ gridCode }) =>
  async () => {
    switch (gridCode) {
      case "CCC/001":
        return TagAccountsGridMetaData;
      default:
        /* eslint-disable no-throw-literal */
        throw { error_msg: "Invalid Product type" };
    }
  };

export const getTagAcctCardGridData = async ({ confirmed, flag }) => {
  if (!Boolean(confirmed)) {
    throw DefaultErrorObject("Please Select Release Type.", "warning");
  } else if (!Boolean(flag)) {
    throw DefaultErrorObject("Please Select Block Type.", "warning");
  } else {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher(
        "TAGREQUEST",
        {
          CONFIRMED: confirmed,
          FLAG: flag,
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
  }
};

export const getTagAcceptRejectGridData = async ({
  confirmed,
  trancd,
  remarks,
}) => {
  if (!Boolean(confirmed)) {
    throw DefaultErrorObject(
      "Required value missing for confirmed.",
      "warning"
    );
  } else if (!Boolean(remarks)) {
    throw DefaultErrorObject("Required value missing for remarks.", "warning");
  } else if (!Boolean(trancd)) {
    throw DefaultErrorObject("Required value missing for tran cd.", "warning");
  } else {
    const { status, message, messageDetails } = await AuthSDK.internalFetcher(
      "TAGREQUESTUPDATE",
      {
        CONFIRMED: confirmed,
        TRAN_CD: trancd,
        REMARKS: remarks,
        VERIFIED_BY: "sys",
        VERIFIED_MACHINE_NM: "test",
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
