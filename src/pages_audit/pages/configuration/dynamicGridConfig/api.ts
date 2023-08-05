import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";
import { AuthContext } from "pages_audit/auth";
import { useContext } from "react";
import { GeneralAPI } from "registry/fns/functions";

export const getTbgDocMstData = () => GeneralAPI.getTbgDocMstData();
export const getProMiscData = async (category_cd) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(`GETPROPMISCDATA`, {
      CATEGORY_CD: category_cd,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ DATA_VALUE, DISPLAY_VALUE, ...other }) => {
          return {
            value: DATA_VALUE,
            label: DISPLAY_VALUE,
            ...other,
          };
        }
      );
    }
    return responseData;
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getDynamicGridConfigGridData = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETGRIDCONFIGDATA", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const dynamicGridConfigDML = () => async (formData: any) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "DODYNAMICGRIDCONFIG",
    formData
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
// export const getDynamicReportConfigData = async (transactionID: number) => {
//   const { data, status, message, messageDetails } =
//     await AuthSDK.internalFetcher("GETDYNRPTCONFIGDATA", {
//       TRAN_CD: transactionID + "",
//     });
//   if (status === "0") {
//     return data;
//   } else {
//     throw DefaultErrorObject(message, messageDetails);
//   }
// };
export const getDynamicGridConfigData = async (
  transactionID: number,
  formMode: string
) => {
  if (formMode === "add") {
    return [];
  }
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDYNRPTCONFIGDATA", {
      TRAN_CD: transactionID + "",
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const verifyDynGridSqlSyntax = async ({ sqlSyntax, detailsData }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("VERIFYDYNGRIDQUERY", {
      SQL_SYNTAX: sqlSyntax,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const actionsFormData = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETTBGGRIDACTIONDATA", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      DOC_CD: "2",
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
