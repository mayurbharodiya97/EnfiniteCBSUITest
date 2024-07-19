import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getCategoryMasterGridData = async ({ companyID, branchCode }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCATMSTGENDATADISP", {
      COMP_CD: companyID,
      BRANCH_CD: branchCode,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getPMISCData = async (...reqData) => {
  reqData?.[1]?.handleButtonDisable(true);
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETPMISCDATA", {
      CATEGORY_CD: "CKYC_CONST_TYPE",
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData?.map(
        ({ DISPLAY_VALUE, DATA_VALUE, ...others }) => {
          return {
            ...others,
            value: DATA_VALUE,
            label: DISPLAY_VALUE,
          };
        }
      );
    }
    reqData?.[1]?.handleButtonDisable(false);
    return responseData;
  } else {
    reqData?.[1]?.handleButtonDisable(false);
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getDDDWAcctType = async (...reqData) => {
  reqData?.[1]?.handleButtonDisable(true);
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDDDWACCTTYPE", {
      COMP_CD: reqData?.[3]?.companyID,
      BRANCH_CD: reqData?.[3]?.user?.branchCode,
      DOC_CD: "MST/050",
      USER_NAME: reqData?.[3]?.user?.id,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData?.map(({ ACCT_TYPE, TYPE_NM, ...others }) => {
        return {
          ...others,
          value: ACCT_TYPE,
          label: ACCT_TYPE + " - " + TYPE_NM,
        };
      });
    }
    reqData?.[1]?.handleButtonDisable(false);
    return responseData;
  } else {
    reqData?.[1]?.handleButtonDisable(false);
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const categoryMasterDML = async (formData: any) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "CATEGORYMASTERDML",
    formData
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
