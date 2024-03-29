import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";

export const getParametersGridData = async ({para_type, comp_cd, branch_cd, conf_type,remark}) => {
    const { status, data, message, messageDetails } =
      await AuthSDK.internalFetcher("GETSYSPARAMSTDISP", {
        PARA_TYPE: para_type,
        COMP_CD: comp_cd,
        BRANCH_CD: branch_cd,
        CONF_PARA: conf_type,
        REMARKS: remark
      });
    if (status === "0") {
      const dataStatus = data;
      dataStatus.map((item) => {
        if (item?.CONFIRMED_STATUS === "PENDING") {
          item._rowColor = "rgb(152 59 70 / 61%)";
        }
      });
      return dataStatus;
      // return data;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };