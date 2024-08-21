import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getFDtype = async ({
    COMP_CD,BRANCH_CD,
    }) => {
    
      const { data, status, message, messageDetails } =
        await AuthSDK.internalFetcher("GETFDTYPEDDW", {
          COMP_CD: COMP_CD,
          BRANCH_CD: BRANCH_CD,
         
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
export const gettypeDDWdata = async ({
COMP_CD,BRANCH_CD,
}) => {

const { data, status, message, messageDetails } =
await AuthSDK.internalFetcher("GETDDDWACCTTYPE", {
    COMP_CD: COMP_CD,
    BRANCH_CD: BRANCH_CD,
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
export const getCategoryDDWdata = async ({
    COMP_CD,BRANCH_CD
    }) => {
    
    const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTMSTCATEGORYDDW", {
        COMP_CD: COMP_CD,
        BRANCH_CD: BRANCH_CD
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