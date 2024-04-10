import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const parametersListDD = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTODPARA", {});
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ DISPLAY_NM, DATA_VALUE, ...other }) => {
          return {
            value: DATA_VALUE,
            label: DISPLAY_NM,
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

export const documentsListDD = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTODDOCDDW", {
      ...reqData,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ DESCRIPTION, DOC_TYPE, ...other }) => {
        return {
          value: DOC_TYPE,
          label: DESCRIPTION,
          ...other,
        };
      });
    }

    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const temporaryODdetails = async (Apireq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTODDATA", {
      ...Apireq,
      //   COMP_CD: "132 ",
      //   BRANCH_CD: "099 ",
      //   ACCT_TYPE: "301 ",
      //   ACCT_CD: "000004              ",
      //   FLAG: "Y",
      //   ASON_DT: "12-Mar-2024",
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
