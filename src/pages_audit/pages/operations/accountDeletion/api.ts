import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";
import { GeneralAPI } from "registry/fns/functions";

export const GetChargeTemplates = () => GeneralAPI.GetChargeTemplates();

export const getAccountDeletionReqGridData = async (confirmed) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(
      "GETACCTDELETIONCONFIRMLIST",
      { CONFIRMED: confirmed },
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
