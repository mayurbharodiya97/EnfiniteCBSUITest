import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getDayendprocessFlag = async ({ ENT_COMP_CD, ENT_BRANCH_CD, BASE_COMP_CD, BASE_BRANCH_CD,GD_DATE
}) => {

const { data, status, message, messageDetails } =
await AuthSDK.internalFetcher("GETEODHANDOVER", {
  ENT_COMP_CD: ENT_COMP_CD,
  ENT_BRANCH_CD: ENT_BRANCH_CD,
  BASE_COMP_CD: BASE_COMP_CD,
  BASE_BRANCH_CD:BASE_BRANCH_CD,
  GD_DATE:GD_DATE,


});

if (status === "0") {

return data;
} else {
throw DefaultErrorObject(message, messageDetails);
}

};
export const getpendingtrnReport = async ({ 
COMP_CD, BRANCH_CD, TRAN_DT, VERSION,DOCU_CD
}) => {

const { data, status, message, messageDetails } =
await AuthSDK.internalFetcher("GETDAYENDPENDINGTRNERRLOG", {
  COMP_CD:COMP_CD,
  BRANCH_CD:BRANCH_CD,
  TRAN_DT:TRAN_DT,
  VERSION:VERSION,
  DOCU_CD:DOCU_CD


});

if (status === "0") {

return data;
} else {
throw DefaultErrorObject(message, messageDetails);
}

};
export const getPendingTrns = async ({ ENT_COMP_CD, ENT_BRANCH_CD, BASE_COMP_CD, BASE_BRANCH_CD,GD_DATE
}) => {

const { data, status, message, messageDetails } =
await AuthSDK.internalFetcher("GETEODHANDOVER", {
  ENT_COMP_CD: ENT_COMP_CD,
  ENT_BRANCH_CD: ENT_BRANCH_CD,
  BASE_COMP_CD: BASE_COMP_CD,
  BASE_BRANCH_CD:BASE_BRANCH_CD,
  GD_DATE:GD_DATE,


});

if (status === "0") {

return data;
} else {
throw DefaultErrorObject(message, messageDetails);
}

};
export const getDocUrl = async ({ BASE_COMP,
BASE_BRANCH,
DOC_CD
}) => {

const { data, status, message, messageDetails } =
await AuthSDK.internalFetcher("GETTBGDOCURL", {
  BASE_COMP:BASE_COMP,
  BASE_BRANCH:BASE_BRANCH,
  DOC_CD:DOC_CD

});

if (status === "0") {

return data;
} else {
throw DefaultErrorObject(message, messageDetails);
}

};
export const getVerifyDayEndCheksumsData = async ({
  COMP_CD,
  BASE_BRANCH_CD,
  ARG,
  CHKSM_TYPE

  }) => {
  
  const { data, status, message, messageDetails } =
  await AuthSDK.internalFetcher("GETDAYENDVERIFYBTN", {
    COMP_CD:COMP_CD,
    BASE_BRANCH_CD:BASE_BRANCH_CD,
    ARG:ARG,
    CHKSM_TYPE:CHKSM_TYPE
  
  });
  
  if (status === "0") {
  
  return data;
  } else {
  throw DefaultErrorObject(message, messageDetails);
  }
  
  };
  export const getDayEnderrLog = async ({
    COMP_CD,
    BASE_BRANCH_CD,
    ARG,
    CHKSM_TYPE
  
    }) => {
    
    const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDAYENDERRLOG", {
      COMP_CD:COMP_CD,
      
    
    });
    
    if (status === "0") {
    
    return data;
    } else {
    throw DefaultErrorObject(message, messageDetails);
    }
    
    };