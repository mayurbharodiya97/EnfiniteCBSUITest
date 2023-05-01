import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";
import { GeneralAPI } from "registry/fns/functions";

export const GetMiscValue = () => GeneralAPI.GetMiscValue("TRAN_TYPE");

export const GetParentTypeDD = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETPARENTTYPEDROPDOWN", {});
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ DISPLAY_VALUE, PARENT_TYPE, ...other }) => {
          return {
            value: PARENT_TYPE,
            label: DISPLAY_VALUE,
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

export const GetLeafTemplateDD = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLEAFTEMPLATEDROPDOWN", {});
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ TEMPLATE_DESC, TRAN_CD, ...other }) => {
          return {
            value: TRAN_CD,
            label: TEMPLATE_DESC,
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
export const insertMastersData = () => async (formData: any) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "SCHEMEMSTDML",
    formData
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getDetailsGridData = async (transactionID: number) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSCHEMEDETAILDATA", {
      TRAN_CD: transactionID + "",
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getMastersGridData = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(`GETSCHEMEMASTERGRIDDATA`, {
      COMP_CD: "001 ",
      BRANCH_CD: "001 ",
      CONFIRMED: "ALL",
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const updateMastersData = () => async (formData: any) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "SCHEMEMSTDML",
    formData
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const deleteBytransactionID = (data) => async () => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "SCHEMEMSTDML" /*`/adminPanelCommonServiceAPI/UPDCHARGETEMPLATEMST`*/,
    data
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message);
  }
};

export const getMastersConfirmGridData = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(`GETSCHEMEMASTERGRIDDATA`, {
      COMP_CD: "001 ",
      BRANCH_CD: "001 ",
      CONFIRMED: "N",
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const confirmSchemeMasterData = async ({
  compCode,
  branchCode,
  tranCode,
  confirmed,
}) => {
  console.log(">>compCode", compCode);
  if (!Boolean(compCode)) {
    throw DefaultErrorObject("Company Code is not valid");
  } else if (!Boolean(branchCode)) {
    throw DefaultErrorObject("Branch Code is not valid");
  } else if (!Boolean(tranCode)) {
    throw DefaultErrorObject("Transaction Code is not valid");
  } else if (!Boolean(confirmed)) {
    throw DefaultErrorObject("Confirmed is not valid");
  } else {
    const { status, message, messageDetails } = await AuthSDK.internalFetcher(
      "CONFIRMSCHEMEMASTER",
      {
        COMP_CD: compCode,
        BRANCH_CD: branchCode,
        TRAN_CD: tranCode,
        CONFIRMED: confirmed,
      }
    );
    if (status === "0") {
      return message;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  }
};
