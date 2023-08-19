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
export const getMenulistData = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(`GETTBGMENUGRPLIST`, {});
  if (status === "0") {
    // let responseData = data;
    // if (Array.isArray(responseData)) {
    //   responseData = responseData.map(
    //     ({ DATA_VALUE, DISPLAY_VALUE, ...other }) => {
    //       return {
    //         value: DATA_VALUE,
    //         label: DISPLAY_VALUE,
    //         ...other,
    //       };
    //     }
    //   );
    // }
    // return responseData;
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
    return data.map((item) => {
      return {
        ...item,
        DENSE: item.DENSE === "Y" ? true : false,
        ALLOW_COLUMN_REORDERING:
          item.ALLOW_COLUMN_REORDERING === "Y" ? true : false,
        DISABLE_GROUP_BY: item.DISABLE_GROUP_BY === "Y" ? true : false,
        ENABLE_PAGINATION: item.ENABLE_PAGINATION === "Y" ? true : false,
        IS_CUSRSORFOCUSED: item.IS_CUSRSORFOCUSED === "Y" ? true : false,
        ALLOW_ROW_SELECTION: item.ALLOW_ROW_SELECTION === "Y" ? true : false,
        ISDOWNLOAD: item.ISDOWNLOAD === "Y" ? true : false,
        ROWID_COLUMN: item.ROWID_COLUMN === "Y" ? true : false,
      };
    });
    // return data;
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
export const getDynamicGridConfigData = async ({
  COMP_CD,
  BRANCH_CD,
  docCD,
}) => {
  // if (formMode === "add") {
  //   return [];
  // }
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETTBGGRIDCOLDATA", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      DOC_CD: docCD + "",
    });
  if (status === "0") {
    return data.map((item) => {
      return {
        ...item,
        IS_VISIBLE: item.IS_VISIBLE === "Y" ? true : false,
      };
    });
    // return data;
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

export const actionsFormData = async ({ COMP_CD, BRANCH_CD, DOC_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETTBGGRIDACTIONDATA", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      DOC_CD: DOC_CD,
    });
  if (status === "0") {
    return data.map((item) => {
      return {
        ...item,
        MULTIPLE: item.MULTIPLE === "Y" ? true : false,
        ROWDOUBLECLICK: item.ROWDOUBLECLICK === "Y" ? true : false,
        ALWAYSAVAILABLE: item.ALWAYSAVAILABLE === "Y" ? true : false,
        ISNODATATHENSHOW: item.ISNODATATHENSHOW === "Y" ? true : false,
      };
    });
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const actionsFormDataDML = () => async (formData: any) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "DODYNAMICGRIDACTION",
    formData
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
