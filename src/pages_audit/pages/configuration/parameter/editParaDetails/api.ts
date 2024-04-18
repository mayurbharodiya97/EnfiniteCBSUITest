import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const updateParameterData = async ({
   datatype_cd,
    paraValue,
    old_datatype,
    old_paraValue,
    remark,
    compCode,
    branch_cd,
    paraCode,
  }) => {
      const { status, message, messageDetails } = await AuthSDK.internalFetcher(
        "UPDATEPARAMST",
        {
          DATATYPE_CD: datatype_cd,
          COMP_CD: compCode,
          REMARKS: remark,BRANCH_CD:branch_cd,OLD_DATATYPE_CD:old_datatype,OLD_PARA_VALUE:old_paraValue,PARA_VALUE:paraValue,PARA_CD:paraCode
        }
      );
      if (status === "0") {
        return message;
      } else {
        throw DefaultErrorObject(message, "error", messageDetails);
      }
    };
    export const validateparavalue = async ({para_cd,para_value}) => {
      const { status, data, message, messageDetails } =
        await AuthSDK.internalFetcher("VALIDATEPARAVALUE", {
          PARA_CD:para_cd,
          PARA_VALUE:para_value
        });
      if (status === "0") {
        return data;
      } else {
        throw DefaultErrorObject(message, messageDetails);
      }
    };