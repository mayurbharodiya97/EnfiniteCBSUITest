import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";

export const getproMiscData = async (category_cd) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(`GETPROPMISCDATA`, {
      CATEGORY_CD: category_cd,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ DATA_VALUE, DISPLAY_VALUE }) => {
        return {
          value: DATA_VALUE,
          label: DISPLAY_VALUE,
        };
      });
    }
    return responseData;
    // return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getDynamicgridConfigGridData = async ({ COMP_CD, BRANCH_CD }) => {
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

export const insertMastersData = () => async (formData: any) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "DYNAMICREPORTCONFIGINSERT",
    formData
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getDynamicReportConfigData = async (transactionID: number) => {
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

export const verifyDynRptSqlSyntax = async ({ sqlSyntax, detailsData }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("VERIFYDYNREPORTQUERY", {
      SQL_SYNTAX: sqlSyntax,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
