import { AuthSDK } from "registry/fns/auth";
import { ServiceWiseConfigGridMetaData } from "./gridMetadata";
import { DefaultErrorObject } from "components/utils";
import { GeneralAPI } from "registry/fns/functions";
// import unicodeConversion from "./unicodeCoversion";
export const getGridFormMetaData =
  ({ gridCode }) =>
  async () => {
    switch (gridCode) {
      case "CCC/001":
        return ServiceWiseConfigGridMetaData;
      default:
        /* eslint-disable no-throw-literal */
        throw { error_msg: "Invalid Product type" };
    }
  };

export const getTranParticularKeys = async () =>
  await GeneralAPI.GetMiscValue("TRNPERTC_KEY");

export const getServiceWiseConfigGridData = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("SERVICEWISECONFIGGRID", {});
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getAmountLabelsGridData = async (tranCD) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSERVICEAMTLABELSLIST", {
      TRAN_CD: tranCD,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
