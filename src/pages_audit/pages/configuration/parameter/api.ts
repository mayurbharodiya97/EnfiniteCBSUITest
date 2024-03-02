import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";

export const getParametersGridData = async (paraType) => {
    const { status, data, message, messageDetails } =
      await AuthSDK.internalFetcher("GETSYSPARAMSTDISP", {
        PARA_TYPE: paraType,
        COMP_CD: "132 ",
        BRANCH_CD: "099 ",
      });
    if (status === "0") {
      return data;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };