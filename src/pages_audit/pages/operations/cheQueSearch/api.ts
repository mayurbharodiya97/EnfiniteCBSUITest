import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getClearingTypeDDW = async ({
COMP_CD,BRANCH_CD
}) => {

  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCHQSEARCHTRANTYP", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
    if (status === "0") {
      let responseData = data;
      if (Array.isArray(responseData)) {
        responseData = responseData.map(
          ({ DESCRIPTION, TRAN_CD, ...items }) => {
            return {
              ...items,
              value: TRAN_CD,
              label: DESCRIPTION,
            };
  
          }
        );
      }
      return responseData;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }

};
export const getClgZoneData = async ({
COMP_CD,BRANCH_CD
}) => {

  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCLGZONELIST", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      CLG:"W"
    });
    if (status === "0") {
      let responseData = data;
      if (Array.isArray(responseData)) {
        responseData = responseData.map(
          ({ DISPLAY_NM, ZONE_CD, ...others }) => {
            return {
              value: ZONE_CD,
              label: DISPLAY_NM,
              ...others,
            };
          }
        );
      }
      return responseData;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }

};
export const getReasonDdwData = async ({
  COMP_CD,BRANCH_CD,RETURN_TYPE
  }) => {
  
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETINWREASONMSTDDW", {
        COMP_CD: COMP_CD,
        BRANCH_CD: BRANCH_CD,
        RETURN_TYPE:RETURN_TYPE
      });
      if (status === "0") {
        let responseData = data;
        if (Array.isArray(responseData)) {
          responseData = responseData.map(
            ({ DISLAY_REASON, REASON_CD, ...other }) => {
              return {
                value: REASON_CD,
                label: DISLAY_REASON,
                ...other,
              };
            }
          );
        }
        return responseData;
      } else {
        throw DefaultErrorObject(message, messageDetails);
      }
  
  };
export const getChequeSearchData = async ({
 ...reqData
  }) => {
  
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETCHQSEARCHDATA", {
        ...reqData
      });
      if (status === "0") {
        let responseData = data;
        
        return responseData;
      } else {
        throw DefaultErrorObject(message, messageDetails);
      }
  
  };
export const getCheckDuplicate = async ({
 ...reqpara
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDUPLICATECLGENTRY", {
      ...reqpara
    });
    if (status === "0") {
      let responseData = data;
      
      return responseData;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }

};