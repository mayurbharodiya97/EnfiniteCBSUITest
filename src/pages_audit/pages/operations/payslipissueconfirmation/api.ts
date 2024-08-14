import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getPayslipCnfRetrieveData = async ({
  ENT_COMP_CD,ENT_BRANCH_CD,GD_DATE,FROM_DT,TO_DT,FLAG,A_LANG
}) => {

  const { data, status, message, messageDetails } = await AuthSDK.internalFetcher(
      "GETPAYSLIPCNFRETRIVEGRID",
      {
        ENT_COMP_CD: ENT_COMP_CD,
        ENT_BRANCH_CD: ENT_BRANCH_CD,
        GD_DATE: GD_DATE,
        FROM_DT: FROM_DT,
        TO_DT:TO_DT,
        FLAG: FLAG,
        A_LANG:A_LANG
      }
    );
   
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ ...items }) => {
          return {
            ...items,
            CONFIRMED_FLG: items.CONFIRMED === "Y" ? "Confirmed" : "Pending"

          };

        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getEntryConfirmed = async ({...reqdata}) => {

const { data, status, message, messageDetails } = await AuthSDK.internalFetcher(
"DODUALCONFIRMATION",
  {...reqdata}
);

if (status === "0") {
let responseData = data;
if (Array.isArray(responseData)) {
responseData = responseData.map(
  ({ ...items }) => {
    return {
      ...items,

      CONFIRMED_FLG: items.CONFIRMED === "Y" ? "Confirmed" : "Pending"

    };

  }
);
}
return message;
} else {
throw DefaultErrorObject(message, messageDetails);
}
};
export const getEntryReject = async (reqdata) => {

const { data, status, message, messageDetails } = await AuthSDK.internalFetcher(
"SAVEPAYSLIPISSUEENTRYDTL",
reqdata
);

if (status === "0") {
let responseData = data;
if (Array.isArray(responseData)) {
responseData = responseData.map(
  ({ ...items }) => {
    return {
      ...items,

    };

  }
);
}
return message;
} else {
throw DefaultErrorObject(message, messageDetails);
}
};
export const getShowConfirmedHistory = async (reqdata) => {

  const { data, status, message, messageDetails } = await AuthSDK.internalFetcher(
  "GETCONFIRMEDHISTORY",
  reqdata
  );
  
  if (status === "0") {
  let responseData = data;
  if (Array.isArray(responseData)) {
  responseData = responseData.map(
    ({ ...items }) => {
      return {
        ...items,
  
        CONFIRMED: items.CONFIRMED === "Y" ? "Confirmed" : "Pending"
  
      };
  
    }
  );
  }
  return responseData;
  } else {
  throw DefaultErrorObject(message, messageDetails);
  }
  };
  export const getSignatureDdnData = async ({COMM_TYPE_CD,COMP_CD,BRANCH_CD}) => {

    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETPAYSLIPSIGNATUREDDW", {
        COMP_CD: COMP_CD,
        BRANCH_CD:BRANCH_CD,
        COMM_TYPE_CD:COMM_TYPE_CD
      });
  
    if (status === "0") {
      let responseData = data;
      if (Array.isArray(responseData)) {
        responseData = responseData.map(
          ({ DISLAY_SIGNATURE, SIGNATURE_CD, ...items }) => {
            return {
              ...items,
              value: DISLAY_SIGNATURE,
              label: SIGNATURE_CD,
            };
            
          }
        );
      }
      return responseData;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  
  };
  export const getRegionDDData = async (...reqData) => {

    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETPAYSLIPREGIONDDW", {
        ...reqData[0],
      });
  
    if (status === "0") {
      let responseData = data;
      if (Array.isArray(responseData)) {
        responseData = responseData.map(
          ({ REGION_CD, REGION_NM, ...items }) => {
            return {
              ...items,
              value: REGION_NM,
              label: REGION_CD,
            };
  
          }
        );
      }
      return responseData;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  
  };
