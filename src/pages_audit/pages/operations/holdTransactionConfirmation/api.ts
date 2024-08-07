import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getHoldTrnsData = async ({
    COMP_CD,
    BRANCH_CD,
  
    }) => {
    
    const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETHOLDTRNCONFGRID", {
        A_COMP_CD:COMP_CD,
        A_BRANCH_CD:BRANCH_CD,
    });
    
    if (status === "0") {
    
    return data;
    } else {
    throw DefaultErrorObject(message, messageDetails);
    }
    
    };
export const getTransactionConfmReject = async ({
COMP_CD,
BRANCH_CD,

}) => {

const { data, status, message, messageDetails } =
await AuthSDK.internalFetcher("GETHOLDTRNCONFGRID", {
COMP_CD:COMP_CD,
BRANCH_CD:BRANCH_CD,
});

if (status === "0") {

return data;
} else {
throw DefaultErrorObject(message, messageDetails);
}

};
