import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";


export const getPriorityMainMasterSubData = async ({ companyID, branchCode }) => {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETSUBPRIOMSTDATADISP", {
        COMP_CD: companyID,
        BRANCH_CD: branchCode,
      });
    if (status === "0") {
      return data.map((item)=>{
        return {
          ...item,
          ACTIVE_FLAG:
          item.ACTIVE_FLAG === "Y" ? true : false
        }
      });
  
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };

  export const getPMISCData = async (WEAKER_PARENT) => {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETPMISCDATA", {
        CATEGORY_CD: WEAKER_PARENT,
      });
     
    if (status === "0") {
      let responseData = data;
      if (Array.isArray(responseData)) {
        responseData = responseData.map(
          ({ DISPLAY_VALUE, DATA_VALUE,...other}) => {
            return {
              ...other,
              value: DATA_VALUE,
              label: DISPLAY_VALUE,
            };
          }
        );
      }
      return responseData;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };

  export const updatePriorityMasterSubData = async ({ data: reqdata }) => {
    const { status, message, messageDetails } = await AuthSDK.internalFetcher(
      "DOSUBPRIORITYMST",
      {
        ...reqdata,
        ALERT_TYPE: "E",
      }
    );
    if (status === "0") {
      return message;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };
  
  export const deletePriorityMasterSubData = async (data) => {
    const { status, message } = await AuthSDK.internalFetcher(
      "DOSUBPRIORITYMST",
      data
    );
    if (status === "0") {
      return message;
    } else {
      throw DefaultErrorObject(message);
    }
  };