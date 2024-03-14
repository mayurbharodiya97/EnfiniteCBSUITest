import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";

export const getParametersGridData = async ({para_type, comp_cd, branch_cd, conf_type}) => {
    const { status, data, message, messageDetails } =
      await AuthSDK.internalFetcher("GETSYSPARAMSTDISP", {
        PARA_TYPE: para_type,
        COMP_CD: comp_cd,
        BRANCH_CD: branch_cd,
        CONF_PARA: conf_type
      });
    if (status === "0") {
      return data;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };