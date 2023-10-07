import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";
import { AuthContext } from "pages_audit/auth";
import { useContext } from "react";
import { GeneralAPI } from "registry/fns/functions";

export const getDynApiListData = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(`GETDYNAPILIST`, {});
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ ACTION, ID }) => {
        return {
          value: ID,
          label: ACTION,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
// export const getDynamicGridConfigGridData = async ({ COMP_CD, BRANCH_CD }) => {
//   const { data, status, message, messageDetails } =
//     await AuthSDK.internalFetcher("GETGRIDCONFIGDATA", {
//       COMP_CD: COMP_CD,
//       BRANCH_CD: BRANCH_CD,
//     });
//   if (status === "0") {
//     return data;
//   } else {
//     throw DefaultErrorObject(message, messageDetails);
//   }
// };

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
export const getDynamicGridColConfigData = async ({
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
export const getDynamicParamterConfigData = async ({
  COMP_CD,
  BRANCH_CD,
  docCD,
}) => {
  // if (formMode === "add") {
  //   return [];
  // }
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETTBGGRIDPARADATA", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      DOC_CD: docCD + "",
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
export const getDynamicOwnerList = async () => {
  const { status, data, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDBOWNERLIST", {});
  if (status === "0") {
    // return data;
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ OWNER }) => {
        return {
          value: OWNER,
          label: OWNER,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
