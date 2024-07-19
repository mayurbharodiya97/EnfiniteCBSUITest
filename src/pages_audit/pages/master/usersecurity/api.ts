import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getSecurityUserGrid = async () => {
    const { status, data, message, messageDetails } =
      await AuthSDK.internalFetcher("GETSECMSTRETRIVE", {});
    if (status === "0") {
      // return data;
      return data;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };
