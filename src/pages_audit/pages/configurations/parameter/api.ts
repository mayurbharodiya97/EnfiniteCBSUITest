import { AuthSDK } from "registry/fns/auth";
import { ParametersGridMetaData } from "./gridMetadata";
import { DefaultErrorObject } from "components/utils";
// import unicodeConversion from "./unicodeCoversion";
export const getGridFormMetaData =
  ({ gridCode }) =>
  async () => {
    switch (gridCode) {
      case "CCC/001":
        return ParametersGridMetaData;
      default:
        /* eslint-disable no-throw-literal */
        throw { error_msg: "Invalid Product type" };
    }
  };

export const getParametersGridData = async (paraType) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETPARAMETERSLIST", { PARA_TYPE: paraType });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
